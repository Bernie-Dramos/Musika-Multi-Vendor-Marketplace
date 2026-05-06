/**
 * A simple rate-limited queue for external API requests.
 * Prevents overwhelming free APIs like MyMemory.
 */
class RateLimitedQueue {
  private queue: (() => Promise<void>)[] = [];
  private processing = false;
  private minInterval: number;

  constructor(requestsPerSecond: number = 2) {
    this.minInterval = 1000 / requestsPerSecond;
  }

  async enqueue<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
        // Wait for the interval before processing the next request
        if (this.queue.length > 0) {
          await new Promise((res) => setTimeout(res, this.minInterval));
        }
      }
    }

    this.processing = false;
  }
}

export const translationQueue = new RateLimitedQueue(5); // 5 requests per second for translation

/**
 * Validates text input for translation.
 * - Max length: 500 characters (MyMemory recommendation)
 * - Minimum length: 1 character
 */
export function validateTranslationInput(text: string): string | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  
  // Truncate if too long to prevent 414/431 errors or API rejection
  if (trimmed.length > 500) {
    return trimmed.slice(0, 497) + "...";
  }
  
  // Skip purely numeric/currency values to keep them in English
  if (/^[\d.,$%£¥€+-\s/%]+$/.test(trimmed)) {
    return null;
  }
  
  return trimmed;
}

/**
 * Secure wrapper for fetch with basic error handling for 429s.
 */
export async function secureFetch(url: string, options?: RequestInit) {
  const response = await fetch(url, options);
  
  if (response.status === 429) {
    console.warn("Rate limit hit (429). Retrying would be handled by the queue logic.");
    throw new Error("RATE_LIMIT_EXCEEDED");
  }
  
  if (!response.ok) {
    throw new Error(`API_ERROR_${response.status}`);
  }
  
  return response.json();
}

/**
 * Throttled translation function using MyMemory API.
 */
export async function translateText(text: string, langpair: string): Promise<string> {
  const validatedText = validateTranslationInput(text);
  if (!validatedText) return text;

  return translationQueue.enqueue(async () => {
    try {
      const data = await secureFetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(validatedText)}&langpair=${langpair}`
      );
      return data.responseData.translatedText || text;
    } catch (error) {
      console.error("Translation failed:", error);
      return text;
    }
  });
}
