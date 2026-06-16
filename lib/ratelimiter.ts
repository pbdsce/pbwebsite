import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

let ratelimiter: Ratelimit | null = null;

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (url && token) {
  try {
    const redis = new Redis({
      url,
      token,
    });
    ratelimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 requests per minute
    });
  } catch (error) {
    console.error("Failed to initialize Upstash Redis/Ratelimit client:", error);
  }
} else {
  console.warn("Upstash Redis environment variables are missing. Rate limiting is disabled.");
}

export { ratelimiter };