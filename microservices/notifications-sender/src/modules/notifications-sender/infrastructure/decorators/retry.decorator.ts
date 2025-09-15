import { Logger } from '@nestjs/common';

export interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  backoffMultiplier: number;
  maxDelay: number;
  retryCondition?: (error: any) => boolean;
}

const defaultRetryCondition = (error: any): boolean => {
  // Retry on network errors, 5xx server errors, or timeout errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
    return true;
  }

  if (error.response?.status >= 500) {
    return true;
  }

  return false;
};

export function Retry(options: RetryOptions) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const logger = new Logger(`${target.constructor.name}.${propertyKey}`);

    descriptor.value = async function (...args: any[]) {
      let lastError: any;
      let attempt = 0;
      let delay = options.initialDelay;

      while (attempt < options.maxAttempts) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error;
          attempt++;

          if (attempt >= options.maxAttempts) {
            logger.error(`All ${options.maxAttempts} retry attempts exhausted`, error.stack);
            break;
          }

          const shouldRetry = options.retryCondition ? options.retryCondition(error) : defaultRetryCondition(error);

          if (!shouldRetry) {
            logger.warn(`Error is not retryable: ${error.message}`);
            break;
          }

          logger.warn(`Attempt ${attempt}/${options.maxAttempts} failed: ${error.message}. Retrying in ${delay}ms...`);

          // Exponential backoff with max delay cap
          delay = Math.min(delay * options.backoffMultiplier, options.maxDelay);

          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      throw lastError;
    };

    return descriptor;
  };
}
