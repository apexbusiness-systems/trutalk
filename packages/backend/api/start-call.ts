import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../src/lib/supabase';
import { createCallRoom, getMeetingToken } from '../src/lib/daily';
import { startCallSchema } from '../../shared/src/validators';
import { createErrorResponse, APIError } from '../../shared/src/utils';

/**
 * Start Call Endpoint
 *
 * POST /api/start-call
 * Body: { match_id: string, user_id: string }
 *
 * Creates Daily.co room and initiates WebRTC call
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request
    const body = startCallSchema.parse(req.body);
    const { match_id, user_id } = body;

    // Get match details
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', match_id)
      .single();

    if (matchError || !match) {
      throw new APIError(404, 'Match not found', 'MATCH_NOT_FOUND');
    }

    // Verify user is part of this match
    if (match.user_id_1 !== user_id && match.user_id_2 !== user_id) {
      throw new APIError(403, 'User not part of this match', 'UNAUTHORIZED');
    }

    // Check if match is still valid
    if (match.status !== 'pending' && match.status !== 'accepted') {
      throw new APIError(400, 'Match is no longer active', 'MATCH_EXPIRED');
    }

    // Check if call already exists
    const { data: existingCall } = await supabase
      .from('calls')
      .select('id, daily_room_url, status')
      .eq('match_id', match_id)
      .single();

    if (existingCall) {
      // Return existing call if still active
      if (existingCall.status === 'initiated' || existingCall.status === 'active') {
        const token = await getMeetingToken(existingCall.daily_room_url!, user_id);

        return res.status(200).json({
          success: true,
          call: existingCall,
          room_url: existingCall.daily_room_url,
          token,
        });
      }
    }

    // Create Daily.co room
    const roomName = `trutalk-${match_id}`;
    const dailyRoom = await createCallRoom(roomName);

    // Get user preferences for translation
    const { data: user } = await supabase
      .from('users')
      .select('preferred_languages, translation_enabled, fcm_token')
      .eq('id', user_id)
      .single();

    const otherUserId = match.user_id_1 === user_id ? match.user_id_2 : match.user_id_1;

    const { data: otherUser } = await supabase
      .from('users')
      .select('preferred_languages, translation_enabled, fcm_token')
      .eq('id', otherUserId)
      .single();

    const translationEnabled =
      user?.translation_enabled &&
      otherUser?.translation_enabled &&
      user?.preferred_languages[0] !== otherUser?.preferred_languages[0];

    // Create call record
    const { data: newCall, error: callError } = await supabase
      .from('calls')
      .insert({
        match_id,
        user_id_1: match.user_id_1,
        user_id_2: match.user_id_2,
        daily_room_name: dailyRoom.name,
        daily_room_url: dailyRoom.url,
        status: 'initiated',
        translation_enabled: translationEnabled,
        language_user_1: user?.preferred_languages[0] || 'en',
        language_user_2: otherUser?.preferred_languages[0] || 'en',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (callError || !newCall) {
      throw new APIError(500, 'Failed to create call', 'CALL_CREATE_ERROR');
    }

    // Update match status to accepted
    await supabase
      .from('matches')
      .update({ status: 'accepted' })
      .eq('id', match_id);

    // Generate meeting token for user
    const token = await getMeetingToken(dailyRoom.name, user_id);

    // Log analytics
    await supabase.from('analytics_events').insert({
      user_id,
      event_name: 'call_started',
      event_properties: {
        call_id: newCall.id,
        match_id,
        translation_enabled: translationEnabled,
      },
    });

    // Send push notification to other user
    if (otherUser?.fcm_token) {
      // TODO: Implement push notification
      console.log(`Send call notification to user ${otherUserId}`);
    }

    return res.status(200).json({
      success: true,
      call: newCall,
      room_url: dailyRoom.url,
      token,
    });

  } catch (error) {
    console.error('Start call error:', error);
    const errorResponse = createErrorResponse(error);
    return res.status(errorResponse.statusCode || 500).json(errorResponse);
  }
}
