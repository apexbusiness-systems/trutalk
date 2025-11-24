import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../src/lib/supabase';
import { createErrorResponse, APIError } from '../../shared/src/utils';

/**
 * Daily Drop Endpoint
 *
 * POST /api/daily-drop
 * Distributes free Echo Chips to active users daily
 *
 * Called via CRON job (Vercel Cron or Supabase pg_cron)
 * Schedule: Every day at 00:00 UTC
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify CRON secret to prevent unauthorized calls
  const cronSecret = req.headers['x-cron-secret'];

  if (cronSecret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const dropAmount = 10; // Free chips per active user
    const activeDaysThreshold = 1; // Active in last 1 day

    // Find active users
    const { data: activeUsers, error: fetchError } = await supabase
      .from('users')
      .select('id, streak_count, last_active_at')
      .gte('last_active_at', new Date(Date.now() - activeDaysThreshold * 24 * 60 * 60 * 1000).toISOString());

    if (fetchError) {
      throw new APIError(500, 'Failed to fetch active users', 'DB_ERROR');
    }

    if (!activeUsers || activeUsers.length === 0) {
      return res.status(200).json({
        success: true,
        users_updated: 0,
        chips_distributed: 0,
        message: 'No active users found',
      });
    }

    // Bonus chips for streakers
    const updates = activeUsers.map((user) => {
      let bonusChips = dropAmount;

      // Streak bonuses
      if (user.streak_count >= 30) bonusChips += 15; // 30-day streak: +15 chips
      else if (user.streak_count >= 7) bonusChips += 5; // 7-day streak: +5 chips

      return {
        user_id: user.id,
        chips: bonusChips,
      };
    });

    // Batch update users
    for (const update of updates) {
      const { data: user } = await supabase
        .from('users')
        .select('echo_chips')
        .eq('id', update.user_id)
        .single();

      if (user) {
        await supabase
          .from('users')
          .update({
            echo_chips: (user.echo_chips || 0) + update.chips,
          })
          .eq('id', update.user_id);
      }

      // Record transaction
      await supabase.from('transactions').insert({
        user_id: update.user_id,
        type: 'daily_drop',
        amount: update.chips,
        description: 'Daily free chips',
      });
    }

    const totalChips = updates.reduce((sum, u) => sum + u.chips, 0);

    // Log analytics
    await supabase.from('analytics_events').insert({
      user_id: '00000000-0000-0000-0000-000000000000', // System event
      event_name: 'daily_drop_completed',
      event_properties: {
        users_count: activeUsers.length,
        total_chips: totalChips,
      },
    });

    console.log(`Daily drop: ${activeUsers.length} users received ${totalChips} total chips`);

    return res.status(200).json({
      success: true,
      users_updated: activeUsers.length,
      chips_distributed: totalChips,
    });

  } catch (error) {
    console.error('Daily drop error:', error);
    const errorResponse = createErrorResponse(error);
    return res.status(errorResponse.statusCode || 500).json(errorResponse);
  }
}
