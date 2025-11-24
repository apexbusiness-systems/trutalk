/**
 * Production monitoring and logging utilities
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  userId?: string;
  sessionId?: string;
  [key: string]: any;
}

class Logger {
  private context: LogContext = {};

  setContext(context: LogContext) {
    this.context = { ...this.context, ...context };
  }

  clearContext() {
    this.context = {};
  }

  private log(level: LogLevel, message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.context,
      data,
    };

    // In development, use console
    if (import.meta.env.DEV) {
      console[level === LogLevel.DEBUG ? 'log' : level](message, data);
      return;
    }

    // In production, send to monitoring service
    // TODO: Integrate with Sentry, LogRocket, or similar
    if (level === LogLevel.ERROR) {
      console.error('Production error:', logEntry);
    }
  }

  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, error?: Error | any) {
    this.log(LogLevel.ERROR, message, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : error,
    });
  }
}

export const logger = new Logger();

/**
 * Performance monitoring
 */
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  try {
    fn();
  } finally {
    const duration = performance.now() - start;
    logger.debug(`Performance: ${name}`, { duration: `${duration.toFixed(2)}ms` });
  }
}

export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    const duration = performance.now() - start;
    logger.debug(`Performance: ${name}`, { duration: `${duration.toFixed(2)}ms` });
  }
}
