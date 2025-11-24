import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../src/lib/supabase';
import { transcribeAudio } from '../src/lib/openai';
import { transcribeSchema } from '../../shared/src/validators';
import { createErrorResponse, APIError } from '../../shared/src/utils';

/**
 * Transcribe Voice Clip Endpoint
 *
 * POST /api/transcribe
 * Body: { voice_clip_id: string, audio_url: string }
 *
 * Uses OpenAI Whisper to transcribe audio and detect language
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate request
    const body = transcribeSchema.parse(req.body);
    const { voice_clip_id, audio_url } = body;

    // Update status to processing
    await supabase
      .from('voice_clips')
      .update({ processing_status: 'processing' })
      .eq('id', voice_clip_id);

    // Transcribe using OpenAI Whisper
    const { text, language } = await transcribeAudio(audio_url);

    if (!text) {
      throw new APIError(400, 'No transcription generated', 'TRANSCRIPTION_EMPTY');
    }

    // Update voice clip with transcription
    const { error: updateError } = await supabase
      .from('voice_clips')
      .update({
        transcription: text,
        language_detected: language,
        confidence_score: 0.95, // Whisper is highly accurate
        processing_status: 'completed',
        error_message: null,
      })
      .eq('id', voice_clip_id);

    if (updateError) {
      throw new APIError(500, 'Failed to update voice clip', 'DB_UPDATE_ERROR');
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
        event_name: 'voice_transcribed',
        event_properties: { language, clip_id: voice_clip_id },
      });
    }

    return res.status(200).json({
      success: true,
      transcription: text,
      language_detected: language,
      confidence_score: 0.95,
    });

  } catch (error) {
    console.error('Transcribe error:', error);

    // Update voice clip status to error
    if (req.body?.voice_clip_id) {
      await supabase
        .from('voice_clips')
        .update({
          processing_status: 'error',
          error_message: error instanceof Error ? error.message : 'Unknown error',
        })
        .eq('id', req.body.voice_clip_id);
    }

    const errorResponse = createErrorResponse(error);
    return res.status(errorResponse.statusCode || 500).json(errorResponse);
  }
}
