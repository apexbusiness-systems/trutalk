import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(audioUrl: string): Promise<{
  text: string;
  language: string;
}> {
  try {
    const response = await fetch(audioUrl);
    const audioBuffer = await response.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const audioFile = new File([audioBlob], 'audio.mp3', { type: 'audio/mpeg' });

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'auto', // Auto-detect
      response_format: 'verbose_json',
    });

    return {
      text: transcription.text,
      language: transcription.language || 'en',
    };
  } catch (error) {
    console.error('OpenAI transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

export async function extractEmotionVectors(text: string): Promise<{
  embedding: number[];
  emotions: Record<string, number>;
}> {
  try {
    // Get text embedding
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    const embedding = embeddingResponse.data[0].embedding;

    // Use GPT-4 to analyze emotions
    const emotionResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are an emotion analysis expert. Analyze the text and return emotion scores as JSON with keys: lonely, happy, excited, sad, anxious, calm, romantic, playful. Values should be 0-1.',
        },
        {
          role: 'user',
          content: `Analyze emotions in: "${text}"`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const emotions = JSON.parse(emotionResponse.choices[0].message.content || '{}');

    return { embedding, emotions };
  } catch (error) {
    console.error('OpenAI emotion extraction error:', error);
    throw new Error('Failed to extract emotion vectors');
  }
}

export async function generateEchoSummary(transcript: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'Summarize the conversation in exactly 5 impactful words. Be creative and emotional.',
        },
        {
          role: 'user',
          content: transcript,
        },
      ],
      max_tokens: 20,
      temperature: 0.8,
    });

    return response.choices[0].message.content?.trim() || 'Unforgettable voice connection';
  } catch (error) {
    console.error('OpenAI echo generation error:', error);
    return 'Amazing conversation happened';
  }
}
