/**
 * Oddiy in-memory fixed-window rate limiter.
 * DIQQAT: holat jarayon xotirasida — bitta instansiyada ishonchli, lekin
 * serverless (Vercel) ko'p instansiyada taxminiy. Production uchun keyin
 * Upstash Redis'ga almashtirish mumkin (interfeys o'zgarmaydi).
 */

export class RateLimitError extends Error {
  retryAfterSeconds: number;
  constructor(retryAfterSeconds: number, message = 'Too many requests') {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

// Map cheksiz o'smasligi uchun vaqti-vaqti bilan eskirgan bucketlarni tozalaymiz.
function sweep(now: number): void {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * `key` uchun `windowMs` oynada `limit` so'rovga ruxsat. Oshsa RateLimitError
 * tashlaydi (handleApiError uni 429 + Retry-After'ga aylantiradi).
 */
export function enforceRateLimit(
  key: string,
  limit: number,
  windowMs: number
): void {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (bucket.count >= limit) {
    throw new RateLimitError(Math.ceil((bucket.resetAt - now) / 1000));
  }

  bucket.count += 1;
}
