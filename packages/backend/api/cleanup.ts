import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../src/lib/supabase';
import { deleteCallRoom } from '../src/lib/daily';
import { createErrorResponse } from '../../shared/src/utils';

/**
 * Cleanup Endpoint
 *
 * POST /api/cleanup
 * Deletes expired voice clips (60s retention) and old data
 *
 * Called via CRON job every 5 minutes
 * Schedule: every 5 minutes (cron expression)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify CRON secret
  const cronSecret = req.headers['x-cron-secret'];

  if (cronSecret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    let totalCleaned = 0;

    // 1. Delete expired voice clips (privacy: 60-second retention)
    const { data: expiredClips } = await supabase
      .from('voice_clips')
      .select('id, storage_path')
      .lt('expires_at', new Date().toISOString());

    if (expiredClips && expiredClips.length > 0) {
      // Delete from storage
      for (const clip of expiredClips) {
        try {
          await supabase.storage.from('voice-clips').remove([clip.storage_path]);
        } catch (storageError) {
          console.error('Failed to delete storage file:', clip.storage_path, storageError);
        }
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('voice_clips')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (!deleteError) {
        totalCleaned += expiredClips.length;
        console.log(`Deleted ${expiredClips.length} expired voice clips`);
      }
    }

    // 2. Delete expired matches
    const { data: expiredMatches, error: matchDeleteError } = await supabase
      .from('matches')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (!matchDeleteError && expiredMatches) {
      totalCleaned += expiredMatches.length;
      console.log(`Deleted ${expiredMatches.length} expired matches`);
    }

    // 3. Clean up old Daily.co rooms (older than 2 hours)
    const { data: oldCalls } = await supabase
      .from('calls')
      .select('daily_room_name')
      .eq('status', 'completed')
      .lt('ended_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString());

    if (oldCalls && oldCalls.length > 0) {
      for (const call of oldCalls) {
        if (call.daily_room_name) {
          try {
            await deleteCallRoom(call.daily_room_name);
          } catch (dailyError) {
            console.error('Failed to delete Daily room:', call.daily_room_name);
          }
        }
      }
      console.log(`Cleaned up ${oldCalls.length} Daily.co rooms`);
    }

    // 4. Delete old analytics events (keep last 90 days for performance)
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - 90);

    const { data: oldEvents, error: eventsDeleteError } = await supabase
      .from('analytics_events')
      .delete()
      .lt('created_at', retentionDate.toISOString())
      .select('id');

    if (!eventsDeleteError && oldEvents) {
      totalCleaned += oldEvents.length;
      console.log(`Deleted ${oldEvents.length} old analytics events`);
    }

    // 5. Expire old forum posts marked as deleted
    const { data: deletedPosts, error: postsDeleteError } = await supabase
      .from('forum_posts')
      .delete()
      .eq('is_deleted', true)
      .lt('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .select('id');

    if (!postsDeleteError && deletedPosts) {
      totalCleaned += deletedPosts.length;
      console.log(`Deleted ${deletedPosts.length} old forum posts`);
    }

    // Log cleanup analytics
    await supabase.from('analytics_events').insert({
      user_id: '00000000-0000-0000-0000-000000000000', // System event
      event_name: 'cleanup_completed',
      event_properties: {
        total_cleaned: totalCleaned,
        timestamp: new Date().toISOString(),
      },
    });

    return res.status(200).json({
      success: true,
      total_cleaned: totalCleaned,
      message: 'Cleanup completed successfully',
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    const errorResponse = createErrorResponse(error);
    return res.status(errorResponse.statusCode || 500).json(errorResponse);
  }
}
