import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

function memoryLimiter(limit: number, windowMs: number) {
  const buckets = new Map<string, number[]>();
  return {
    async limit(id: string) {
      const now = Date.now();
      const hits = (buckets.get(id) || []).filter((t) => now - t < windowMs);
      if (hits.length >= limit) return { success: false, reset: now + windowMs };
      hits.push(now);
      buckets.set(id, hits);
      return { success: true, reset: now + windowMs };
    },
  };
}

const hasRedis = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
const redis = hasRedis ? Redis.fromEnv() : null;

export const rateLimit = {
  chat: redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "15 m"), prefix: "rl:chat" })
    : memoryLimiter(20, 15 * 60 * 1000),
  rag: redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "15 m"), prefix: "rl:rag" })
    : memoryLimiter(10, 15 * 60 * 1000),
};
