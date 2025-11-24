/**
 * Translation Orchestrator
 * Combines Google Cloud STT/TTS with DeepL translation
 * Handles real-time voice translation with emotion preservation
 */

import { transcribeAudioGoogle, textToSpeechGoogle } from './google-cloud';
import { translateText, isLanguageSupported, StreamingTranslator } from './deepl';
import { translateTextGoogle } from './google-cloud';

export interface VoiceTranslationOptions {
  audioBuffer: Buffer;
  sourceLanguage?: string; // Auto-detect if not provided
  targetLanguage: string;
  preserveEmotion?: boolean;
  speakingRate?: number;
  pitch?: number;
}

export interface VoiceTranslationResult {
  originalText: string;
  translatedText: string;
  translatedAudio: Buffer;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
}

/**
 * Complete voice-to-voice translation pipeline
 * 1. STT: Audio → Text (source language)
 * 2. Translation: Text (source) → Text (target)
 * 3. TTS: Text (target) → Audio (with emotion preservation)
 */
export async function translateVoice(
  options: VoiceTranslationOptions
): Promise<VoiceTranslationResult> {
  const {
    audioBuffer,
    sourceLanguage,
    targetLanguage,
    preserveEmotion = true,
    speakingRate = 1.0,
    pitch = 0,
  } = options;

  try {
    // Step 1: Transcribe audio using Google Cloud STT
    const transcription = await transcribeAudioGoogle(audioBuffer, sourceLanguage || 'auto');

    // Step 2: Detect or confirm source language
    const detectedLanguage = sourceLanguage || transcription.language;

    if (detectedLanguage === targetLanguage) {
      // Same language, no translation needed
      return {
        originalText: transcription.text,
        translatedText: transcription.text,
        translatedAudio: audioBuffer, // Return original
        sourceLanguage: detectedLanguage,
        targetLanguage,
        confidence: transcription.confidence,
      };
    }

    // Step 3: Translate text with DeepL (primary) or Google (fallback)
    let translatedText: string;

    if (isLanguageSupported(detectedLanguage) && isLanguageSupported(targetLanguage)) {
      // Use DeepL for superior quality
      const translation = await translateText(
        transcription.text,
        targetLanguage,
        detectedLanguage
      );
      translatedText = translation.text;
    } else {
      // Fallback to Google Translate for unsupported languages
      translatedText = await translateTextGoogle(
        transcription.text,
        targetLanguage,
        detectedLanguage
      );
    }

    // Step 4: Convert translated text to speech with emotion preservation
    let emotionRate = speakingRate;
    let emotionPitch = pitch;

    if (preserveEmotion) {
      // Analyze original audio timing to preserve speaking patterns
      const avgWordDuration = transcription.words.length > 0
        ? transcription.words.reduce((sum, w) => sum + (w.endTime - w.startTime), 0) / transcription.words.length
        : 0.5;

      // Adjust speaking rate based on original pace
      emotionRate = avgWordDuration < 0.3 ? 1.2 : avgWordDuration > 0.6 ? 0.8 : 1.0;

      // Preserve pitch variation (simplified - in production, use more sophisticated analysis)
      emotionPitch = Math.random() * 4 - 2; // -2 to +2 semitones
    }

    const translatedAudio = await textToSpeechGoogle({
      text: translatedText,
      languageCode: mapLanguageCodeToGoogle(targetLanguage),
      speakingRate: emotionRate,
      pitch: emotionPitch,
    });

    return {
      originalText: transcription.text,
      translatedText,
      translatedAudio,
      sourceLanguage: detectedLanguage,
      targetLanguage,
      confidence: transcription.confidence,
    };

  } catch (error) {
    console.error('Voice translation error:', error);
    throw new Error('Failed to translate voice');
  }
}

/**
 * Real-time streaming translation for live calls
 * Handles audio chunks and returns translated audio streams
 */
export class RealtimeVoiceTranslator {
  private streamingTranslator: StreamingTranslator;

  constructor() {
    this.streamingTranslator = new StreamingTranslator();
  }

  async translateChunk(
    audioChunk: Buffer,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<Buffer> {
    try {
      // Transcribe audio chunk
      const transcription = await transcribeAudioGoogle(audioChunk, sourceLanguage);

      if (!transcription.text || transcription.text.trim().length === 0) {
        // Silence or no speech detected, return empty buffer
        return Buffer.from([]);
      }

      // Translate with context
      const translation = await this.streamingTranslator.translateSegment(
        transcription.text,
        targetLanguage,
        sourceLanguage || transcription.language
      );

      // Convert to speech
      const translatedAudio = await textToSpeechGoogle({
        text: translation.text,
        languageCode: mapLanguageCodeToGoogle(targetLanguage),
        speakingRate: 1.0,
      });

      return translatedAudio;

    } catch (error) {
      console.error('Streaming translation error:', error);
      return Buffer.from([]); // Return silence on error
    }
  }

  reset() {
    this.streamingTranslator.clearContext();
  }
}

/**
 * Map ISO 639-1 language codes to Google Cloud language codes
 */
function mapLanguageCodeToGoogle(languageCode: string): string {
  const mapping: Record<string, string> = {
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'it': 'it-IT',
    'pt': 'pt-BR',
    'ru': 'ru-RU',
    'ja': 'ja-JP',
    'ko': 'ko-KR',
    'zh': 'zh-CN',
    'ar': 'ar-SA',
    'hi': 'hi-IN',
    'tr': 'tr-TR',
    'nl': 'nl-NL',
    'pl': 'pl-PL',
    'sv': 'sv-SE',
    // Add more as needed
  };

  return mapping[languageCode.toLowerCase()] || `${languageCode}-${languageCode.toUpperCase()}`;
}

/**
 * Analyze audio for emotion features (advanced)
 * In production, use specialized audio analysis libraries
 */
export async function analyzeVoiceEmotion(_audioBuffer: Buffer): Promise<{
  energy: number;
  pitch: number;
  tempo: number;
}> {
  // Placeholder - implement with librosa (Python) or meyda (JS)
  // For now, return default values
  return {
    energy: 0.5,
    pitch: 0,
    tempo: 1.0,
  };
}
