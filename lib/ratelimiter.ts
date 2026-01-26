import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import logger from "@/lib/server/logger";
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export const ratelimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'), // 10 requests/minute
});
logger.info(
  { module: "ratelimiter", state: "initialized" },
  "Rate limiter configured"
);