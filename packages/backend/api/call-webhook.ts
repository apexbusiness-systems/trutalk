import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../src/lib/supabase';
import { generateEchoSummary } from '../src/lib/openai';

/**
 * Call Webhook Endpoint
 *
 * POST /api/call-webhook
 * Receives webhooks from Daily.co about call events
 *
 * Events: call.started, call.ended, recording.ready
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;
    const eventType = event.type;

    console.log('Daily webhook received:', eventType, event);

    switch (eventType) {
      case 'call.started':
        await handleCallStarted(event);
        break;

      case 'call.ended':
        await handleCallEnded(event);
        break;

      case 'participant.joined':
        await handleParticipantJoined(event);
        break;

      case 'participant.left':
        await handleParticipantLeft(event);
        break;

      default:
        console.log('Unhandled event type:', eventType);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Call webhook error:', error);
    return res.status(200).json({ received: true }); // Always return 200 to Daily
  }
}

async function handleCallStarted(event: any) {
  const roomName = event.room;

  const { data: call } = await supabase
    .from('calls')
    .select('*')
    .eq('daily_room_name', roomName)
    .single();

  if (call) {
    await supabase
      .from('calls')
      .update({
        status: 'active',
        started_at: new Date().toISOString(),
      })
      .eq('id', call.id);

    // Log analytics
    await supabase.from('analytics_events').insert([
      {
        user_id: call.user_id_1,
        event_name: 'call_active',
        event_properties: { call_id: call.id },
      },
      {
        user_id: call.user_id_2,
        event_name: 'call_active',
        event_properties: { call_id: call.id },
      },
    ]);
  }
}

async function handleCallEnded(event: any) {
  const roomName = event.room;
  const duration = event.duration || 0; // seconds

  const { data: call } = await supabase
    .from('calls')
    .select('*')
    .eq('daily_room_name', roomName)
    .single();

  if (call) {
    const endedAt = new Date().toISOString();

    // Update call status
    await supabase
      .from('calls')
      .update({
        status: 'completed',
        ended_at: endedAt,
        duration_seconds: duration,
      })
      .eq('id', call.id);

    // Generate Echo summary if call was longer than 30 seconds
    if (duration > 30 && call.translation_segments && call.translation_segments.length > 0) {
      const transcript = call.translation_segments
        .map((seg: any) => seg.original)
        .join(' ');

      const summary = await generateEchoSummary(transcript);

      // Create Echo for both users
      await supabase.from('echos').insert([
        {
          call_id: call.id,
          user_id: call.user_id_1,
          summary,
          full_transcript: transcript,
        },
        {
          call_id: call.id,
          user_id: call.user_id_2,
          summary,
          full_transcript: transcript,
        },
      ]);
    }

    // Reward users with Echo Chips for completing call
    if (duration > 60) { // At least 1 minute
      const rewardChips = Math.min(Math.floor(duration / 60), 10); // Max 10 chips

      // Get current chip counts
      const { data: users } = await supabase
        .from('users')
        .select('id, echo_chips')
        .in('id', [call.user_id_1, call.user_id_2]);

      if (users) {
        for (const user of users) {
          await supabase
            .from('users')
            .update({ echo_chips: (user.echo_chips || 0) + rewardChips })
            .eq('id', user.id);
        }
      }

      // Log transactions
      await supabase.from('transactions').insert([
        {
          user_id: call.user_id_1,
          type: 'reward',
          amount: rewardChips,
          description: 'Call completion reward',
        },
        {
          user_id: call.user_id_2,
          type: 'reward',
          amount: rewardChips,
          description: 'Call completion reward',
        },
      ]);
    }

    // Log analytics
    await supabase.from('analytics_events').insert([
      {
        user_id: call.user_id_1,
        event_name: 'call_completed',
        event_properties: {
          call_id: call.id,
          duration_seconds: duration,
          translation_used: call.translation_enabled,
        },
      },
      {
        user_id: call.user_id_2,
        event_name: 'call_completed',
        event_properties: {
          call_id: call.id,
          duration_seconds: duration,
          translation_used: call.translation_enabled,
        },
      },
    ]);
  }
}

async function handleParticipantJoined(event: any) {
  const userId = event.participant?.user_id;

  if (userId) {
    await supabase.from('analytics_events').insert({
      user_id: userId,
      event_name: 'call_joined',
      event_properties: { room: event.room },
    });
  }
}

async function handleParticipantLeft(event: any) {
  const userId = event.participant?.user_id;

  if (userId) {
    await supabase.from('analytics_events').insert({
      user_id: userId,
      event_name: 'call_left',
      event_properties: { room: event.room },
    });
  }
}
