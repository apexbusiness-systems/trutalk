/**
 * DeepL Translation Integration
 * High-quality translation with nuance preservation (50+ languages)
 */

import * as deepl from 'deepl-node';

if (!process.env.DEEPL_API_KEY) {
  throw new Error('Missing DEEPL_API_KEY environment variable');
}

const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

export interface TranslationResult {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  detectedLanguage?: string;
}

/**
 * Supported languages (50+)
 * DeepL supports formal/informal variations for some languages
 */
export const SUPPORTED_LANGUAGES = [
  'ar', 'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr',
  'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nb', 'nl', 'pl', 'pt',
  'ro', 'ru', 'sk', 'sl', 'sv', 'tr', 'uk', 'zh',
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

/**
 * Translate text with nuance preservation
 * Uses DeepL's advanced neural networks
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string,
  preserveFormatting: boolean = true
): Promise<TranslationResult> {
  try {
    const sourceLang = sourceLanguage 
      ? (sourceLanguage.toUpperCase() as deepl.SourceLanguageCode)
      : null;

    const result = await translator.translateText(
      text,
      sourceLang,
      targetLanguage.toUpperCase() as deepl.TargetLanguageCode,
      {
        preserveFormatting,
        formality: 'default' as deepl.Formality,
      }
    );

    const resultItem = Array.isArray(result) ? result[0] : result;

    return {
      text: resultItem.text,
      sourceLanguage: resultItem.detectedSourceLang?.toLowerCase() || sourceLanguage || 'auto',
      targetLanguage: targetLanguage.toLowerCase(),
      detectedLanguage: resultItem.detectedSourceLang?.toLowerCase(),
    };

  } catch (error) {
    console.error('DeepL translation error:', error);
    throw new Error('Failed to translate text with DeepL');
  }
}

/**
 * Batch translate multiple texts (optimized for conversations)
 */
export async function translateBatch(
  texts: string[],
  targetLanguage: string,
  sourceLanguage?: string
): Promise<TranslationResult[]> {
  try {
    const sourceLang = sourceLanguage
      ? (sourceLanguage.toUpperCase() as deepl.SourceLanguageCode)
      : null;

    const results = await translator.translateText(
      texts,
      sourceLang,
      targetLanguage.toUpperCase() as deepl.TargetLanguageCode
    );

    const resultArray = Array.isArray(results) ? results : [results];

    return resultArray.map((result) => ({
      text: result.text,
      sourceLanguage: result.detectedSourceLang?.toLowerCase() || sourceLanguage || 'auto',
      targetLanguage: targetLanguage.toLowerCase(),
      detectedLanguage: result.detectedSourceLang?.toLowerCase(),
    }));

  } catch (error) {
    console.error('DeepL batch translation error:', error);
    throw new Error('Failed to translate batch with DeepL');
  }
}

/**
 * Get available languages
 */
export async function getAvailableLanguages(): Promise<readonly deepl.Language[]> {
  try {
    return await translator.getTargetLanguages();
  } catch (error) {
    console.error('Failed to fetch DeepL languages:', error);
    return [];
  }
}

/**
 * Get translation usage stats (for monitoring API quota)
 */
export async function getUsageStats(): Promise<deepl.Usage> {
  try {
    return await translator.getUsage();
  } catch (error) {
    console.error('Failed to fetch DeepL usage:', error);
    throw error;
  }
}

/**
 * Detect language from text
 */
export async function detectLanguageDeepL(text: string): Promise<string> {
  try {
    // DeepL doesn't have explicit language detection, so we translate to English
    // and check the detected source language
    const result = await translator.translateText(text, null, 'en-US');
    return result.detectedSourceLang?.toLowerCase() || 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en';
  }
}

/**
 * Check if language is supported
 */
export function isLanguageSupported(languageCode: string): boolean {
  return SUPPORTED_LANGUAGES.includes(languageCode.toLowerCase() as SupportedLanguage);
}

/**
 * Real-time translation for voice calls
 * Handles streaming text chunks with context preservation
 */
export class StreamingTranslator {
  private context: string[] = [];
  private maxContextLength = 5; // Keep last 5 sentences for context

  async translateSegment(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<TranslationResult> {
    // Add current text to context
    this.context.push(text);

    // Keep only recent context
    if (this.context.length > this.maxContextLength) {
      this.context.shift();
    }

    // Translate with context for better accuracy
    const contextualText = this.context.join(' ');

    const result = await translateText(contextualText, targetLanguage, sourceLanguage);

    // Extract only the latest translated segment
    const sentences = result.text.split(/[.!?]+/);
    const latestTranslation = sentences[sentences.length - 1]?.trim() || result.text;

    return {
      ...result,
      text: latestTranslation,
    };
  }

  clearContext() {
    this.context = [];
  }
}
