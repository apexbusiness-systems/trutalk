import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../src/lib/supabase';
import { extractEmotionVectors } from '../src/lib/openai';
import { vectorizeSchema } from '../../shared/src/validators';
import { createErrorResponse, APIError } from '../../shared/src/utils';

/**
 * Vectorize Voice Clip Endpoint
 *
 * POST /api/vectorize
 * Body: { voice_clip_id: string, transcription: string }
 *
 * Generates emotion vectors using OpenAI embeddings + GPT-4 analysis
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request
    const body = vectorizeSchema.parse(req.body);
    const { voice_clip_id, transcription } = body;

    // Extract emotion vectors using OpenAI
    const { embedding, emotions } = await extractEmotionVectors(transcription);

    if (!embedding || embedding.length === 0) {
      throw new APIError(400, 'Failed to generate embedding', 'EMBEDDING_ERROR');
    }

    // Validate emotions object
    const validEmotions = [
      'lonely',
      'happy',
      'excited',
      'sad',
      'anxious',
      'calm',
      'romantic',
      'playful',
    ];

    const emotionLabels = Object.keys(emotions)
      .filter((key) => validEmotions.includes(key))
      .reduce((obj, key) => {
        obj[key] = emotions[key];
        return obj;
      }, {} as Record<string, number>);

    // Update voice clip with vectors
    const { error: updateError } = await supabase
      .from('voice_clips')
      .update({
        emotion_vector: embedding,
        emotion_labels: emotionLabels,
        processing_status: 'completed',
      })
      .eq('id', voice_clip_id);

    if (updateError) {
      throw new APIError(500, 'Failed to update voice clip vectors', 'DB_UPDATE_ERROR');
    }

    // Log analytics
    const { data: voiceClip } = await supabase
      .from('voice_clips')
      .select('user_id')
      .eq('id', voice_clip_id)
      .single();

    if (voiceClip) {
      await supabase.from('analytics_events').insert({
        user_id: voiceClip.user_id,
        event_name: 'emotions_analyzed',
        event_properties: {
          clip_id: voice_clip_id,
          emotions: emotionLabels,
        },
      });
    }

    return res.status(200).json({
      success: true,
      emotion_vector: embedding,
      emotion_labels: emotionLabels,
    });

  } catch (error) {
    console.error('Vectorize error:', error);

    // Update voice clip status to error
    if (req.body?.voice_clip_id) {
      await supabase
        .from('voice_clips')
        .update({
          processing_status: 'error',
          error_message: error instanceof Error ? error.message : 'Vectorization failed',
        })
        .eq('id', req.body.voice_clip_id);
    }

    const errorResponse = createErrorResponse(error);
    return res.status(errorResponse.statusCode || 500).json(errorResponse);
  }
}
