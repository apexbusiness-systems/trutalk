/**
 * Google Cloud AI Integration
 * Speech-to-Text (STT) and Text-to-Speech (TTS) with emotion preservation
 */

import speech from '@google-cloud/speech';
import textToSpeech from '@google-cloud/text-to-speech';
import { Translate } from '@google-cloud/translate/build/src/v2';

// Initialize clients
const speechClient = new speech.SpeechClient({
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || '{}'),
});

const ttsClient = new textToSpeech.TextToSpeechClient({
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || '{}'),
});

const translateClient = new Translate({
  credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || '{}'),
});

export interface TranscriptionResult {
  text: string;
  language: string;
  confidence: number;
  words: Array<{
    word: string;
    startTime: number;
    endTime: number;
  }>;
}

export interface TTSOptions {
  text: string;
  languageCode: string;
  voiceGender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
  speakingRate?: number; // 0.25 to 4.0 (preserve emotion)
  pitch?: number; // -20.0 to 20.0 (preserve emotion)
}

/**
 * Transcribe audio using Google Cloud Speech-to-Text
 * Auto-detects language and returns word-level timestamps
 */
export async function transcribeAudioGoogle(
  audioBuffer: Buffer,
  languageCode: string = 'auto'
): Promise<TranscriptionResult> {
  try {
    const audioBytes = audioBuffer.toString('base64');

    const config: any = {
      encoding: 'MP3',
      sampleRateHertz: 48000,
      enableWordTimeOffsets: true,
      enableAutomaticPunctuation: true,
      model: 'latest_long',
    };

    // Auto-detect language or specify
    if (languageCode === 'auto') {
      config.languageCode = 'en-US'; // Primary
      config.alternativeLanguageCodes = [
        'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR',
        'ru-RU', 'ja-JP', 'ko-KR', 'zh-CN', 'ar-SA',
        'hi-IN', 'tr-TR', 'nl-NL', 'pl-PL', 'sv-SE'
      ];
    } else {
      config.languageCode = languageCode;
    }

    const audio = { content: audioBytes };
    const request = { config, audio };

    const [response] = await speechClient.recognize(request);

    if (!response.results || response.results.length === 0) {
      throw new Error('No transcription results');
    }

    const result = response.results[0];
    const alternative = result.alternatives?.[0];

    if (!alternative) {
      throw new Error('No alternative transcription');
    }

    const words = alternative.words?.map((wordInfo) => ({
      word: wordInfo.word || '',
      startTime: parseFloat(String(wordInfo.startTime?.seconds || 0)),
      endTime: parseFloat(String(wordInfo.endTime?.seconds || 0)),
    })) || [];

    return {
      text: alternative.transcript || '',
      language: result.languageCode || 'en',
      confidence: alternative.confidence || 0,
      words,
    };

  } catch (error) {
    console.error('Google STT error:', error);
    throw new Error('Failed to transcribe audio with Google Cloud');
  }
}

/**
 * Convert text to speech with emotion preservation
 * Uses SSML for advanced control
 */
export async function textToSpeechGoogle(options: TTSOptions): Promise<Buffer> {
  try {
    const {
      text,
      languageCode,
      voiceGender = 'NEUTRAL',
      speakingRate = 1.0,
      pitch = 0,
    } = options;

    // Build SSML for emotion preservation
    const ssml = `
      <speak>
        <prosody rate="${speakingRate}" pitch="${pitch}st">
          ${text}
        </prosody>
      </speak>
    `;

    const request = {
      input: { ssml },
      voice: {
        languageCode,
        ssmlGender: voiceGender,
      },
      audioConfig: {
        audioEncoding: 'MP3' as const,
        speakingRate,
        pitch,
        effectsProfileId: ['telephony-class-application'], // Optimize for calls
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error('No audio content generated');
    }

    return Buffer.from(response.audioContent as Uint8Array);

  } catch (error) {
    console.error('Google TTS error:', error);
    throw new Error('Failed to generate speech with Google Cloud');
  }
}

/**
 * Detect language from text
 */
export async function detectLanguage(text: string): Promise<string> {
  try {
    const [detection] = await translateClient.detect(text);
    return detection.language || 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Fallback to English
  }
}

/**
 * Real-time streaming transcription (for live calls)
 */
export async function* streamTranscribe(
  audioStream: AsyncIterable<Buffer>,
  languageCode: string = 'en-US'
): AsyncGenerator<string> {
  const recognizeStream = speechClient
    .streamingRecognize({
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode,
        enableAutomaticPunctuation: true,
      },
      interimResults: true,
    })
    .on('error', (error) => {
      console.error('Streaming error:', error);
    });

  for await (const audioChunk of audioStream) {
    recognizeStream.write(audioChunk);

    // Yield transcription results
    for await (const data of recognizeStream) {
      if (data.results[0] && data.results[0].alternatives[0]) {
        yield data.results[0].alternatives[0].transcript;
      }
    }
  }

  recognizeStream.end();
}

/**
 * Batch translate text (fallback if DeepL fails)
 */
export async function translateTextGoogle(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<string> {
  try {
    const [translation] = await translateClient.translate(text, {
      from: sourceLanguage,
      to: targetLanguage,
    });

    return translation;
  } catch (error) {
    console.error('Google Translate error:', error);
    throw new Error('Translation failed');
  }
}
