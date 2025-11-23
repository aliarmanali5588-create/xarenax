import { useState } from 'react';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

export const usePaymentRetry = () => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const executeWithRetry = async <T,>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> => {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 10000,
      backoffMultiplier = 2,
    } = options;

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setRetryCount(attempt);
        setIsRetrying(attempt > 0);
        
        const result = await fn();
        
        // Success - reset state
        setRetryCount(0);
        setIsRetrying(false);
        
        return result;
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt + 1} failed:`, error);
        
        // If this was the last attempt, throw the error
        if (attempt === maxRetries) {
          setIsRetrying(false);
          throw lastError;
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          initialDelay * Math.pow(backoffMultiplier, attempt),
          maxDelay
        );
        
        console.log(`Retrying in ${delay}ms... (attempt ${attempt + 2}/${maxRetries + 1})`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // This should never be reached, but TypeScript needs it
    throw lastError || new Error('Payment failed after retries');
  };

  const reset = () => {
    setRetryCount(0);
    setIsRetrying(false);
  };

  return {
    executeWithRetry,
    retryCount,
    isRetrying,
    reset,
  };
};
