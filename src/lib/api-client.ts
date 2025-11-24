import { supabase } from '@/integrations/supabase/client';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

/**
 * Exponential backoff retry logic for API calls
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error | null = null;
  let delay = opts.initialDelay;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on client errors (4xx)
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as any).status;
        if (status >= 400 && status < 500) {
          throw error;
        }
      }

      if (attempt < opts.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelay);
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Type-safe Supabase function invocation with retry logic
 */
export async function invokeEdgeFunction<T = any>(
  functionName: string,
  body?: Record<string, any>,
  options: RetryOptions = {}
): Promise<T> {
  return withRetry(async () => {
    const { data, error } = await supabase.functions.invoke<T>(functionName, {
      body,
    });

    if (error) {
      throw new Error(`Edge function ${functionName} failed: ${error.message}`);
    }

    return data as T;
  }, options);
}

/**
 * Health check utility
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1).single();
    return !error || error.code === 'PGRST116'; // PGRST116 = no rows returned (acceptable)
  } catch {
    return false;
  }
}
