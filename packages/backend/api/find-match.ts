import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../src/lib/supabase';
import { findMatchSchema } from '../../shared/src/validators';
import { createErrorResponse, APIError } from '../../shared/src/utils';

/**
 * Find Match Endpoint
 *
 * POST /api/find-match
 * Body: { user_id: string, voice_clip_id: string }
 *
 * Uses vector similarity search to find best emotional match
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request
    const body = findMatchSchema.parse(req.body);
    const { user_id, voice_clip_id } = body;

    // Get user's voice clip with emotion vector
    const { data: userClip, error: clipError } = await supabase
      .from('voice_clips')
      .select('emotion_vector, emotion_labels')
      .eq('id', voice_clip_id)
      .single();

    if (clipError || !userClip || !userClip.emotion_vector) {
      throw new APIError(400, 'Voice clip not found or not processed', 'CLIP_NOT_READY');
    }

    // Call database function to find matches
    const { data: matches, error: matchError } = await supabase.rpc('find_emotion_match', {
      target_user_id: user_id,
      target_vector: userClip.emotion_vector,
      max_results: 10,
    });

    if (matchError) {
      console.error('Match search error:', matchError);
      throw new APIError(500, 'Failed to find matches', 'MATCH_SEARCH_ERROR');
    }

    if (!matches || matches.length === 0) {
      // No matches found - user goes into waiting pool
      await supabase.from('analytics_events').insert({
        user_id,
        event_name: 'no_match_found',
        event_properties: { clip_id: voice_clip_id },
      });

      return res.status(200).json({
        success: true,
        match: null,
        message: 'No matches available. Your voice is in the pool!',
      });
    }

    // Get best match (highest similarity)
    const bestMatch = matches[0];

    // Check if match already exists (prevent duplicates)
    const { data: existingMatch } = await supabase
      .from('matches')
      .select('id')
      .or(
        `and(user_id_1.eq.${user_id},user_id_2.eq.${bestMatch.match_user_id}),` +
        `and(user_id_1.eq.${bestMatch.match_user_id},user_id_2.eq.${user_id})`
      )
      .eq('status', 'pending')
      .single();

    if (existingMatch) {
      throw new APIError(400, 'Match already exists', 'DUPLICATE_MATCH');
    }

    // Create match
    const { data: newMatch, error: createError } = await supabase
      .from('matches')
      .insert({
        user_id_1: user_id,
        user_id_2: bestMatch.match_user_id,
        similarity_score: bestMatch.similarity_score,
        voice_clip_id_1: voice_clip_id,
        voice_clip_id_2: bestMatch.voice_clip_id,
        status: 'pending',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      })
      .select()
      .single();

    if (createError || !newMatch) {
      throw new APIError(500, 'Failed to create match', 'MATCH_CREATE_ERROR');
    }

    // Send push notifications to both users
    const { data: matchedUser } = await supabase
      .from('users')
      .select('fcm_token, notification_enabled')
      .eq('id', bestMatch.match_user_id)
      .single();

    if (matchedUser?.notification_enabled && matchedUser.fcm_token) {
      // TODO: Implement push notification via Firebase Cloud Messaging
      console.log(`Send push notification to user ${bestMatch.match_user_id}`);
    }

    // Log analytics
    await supabase.from('analytics_events').insert([
      {
        user_id,
        event_name: 'match_created',
        event_properties: {
          match_id: newMatch.id,
          similarity_score: bestMatch.similarity_score,
        },
      },
      {
        user_id: bestMatch.match_user_id,
        event_name: 'match_received',
        event_properties: {
          match_id: newMatch.id,
          similarity_score: bestMatch.similarity_score,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      match: newMatch,
      similarity_score: bestMatch.similarity_score,
    });

  } catch (error) {
    console.error('Find match error:', error);
    const errorResponse = createErrorResponse(error);
    return res.status(errorResponse.statusCode || 500).json(errorResponse);
  }
}
