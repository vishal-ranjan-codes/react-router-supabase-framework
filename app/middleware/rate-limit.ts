import type { MiddlewareFunction } from "react-router";

type Bucket = { count: number; resetTime: number };

// A warm isolate can serve every visitor for hours, so the window table is
// capped and expired buckets are dropped on write instead of accumulating.
const MAX_BUCKETS = 10_000;

function prune(buckets: Map<string, Bucket>, now: number): void {
  for (const [key, bucket] of buckets) {
    if (bucket.resetTime <= now) buckets.delete(key);
  }
  while (buckets.size >= MAX_BUCKETS) {
    const oldest = buckets.keys().next();
    if (oldest.done) break;
    buckets.delete(oldest.value);
  }
}

/**
 * Counts live in the isolate that handled the request, so a scaled-out Worker
 * enforces `maxRequests` per isolate rather than globally.
 */
export function createRateLimitMiddleware(
  maxRequests: number,
  windowMs: number,
): MiddlewareFunction<Response> {
  const buckets = new Map<string, Bucket>();

  return async ({ request }, next) => {
    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const now = Date.now();

    const bucket = buckets.get(ip);

    if (bucket && bucket.resetTime > now) {
      if (bucket.count >= maxRequests) {
        return new Response(JSON.stringify({ error: "Too many requests" }), {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil((bucket.resetTime - now) / 1000)),
          },
        });
      }
      bucket.count++;
    } else {
      prune(buckets, now);
      buckets.set(ip, { count: 1, resetTime: now + windowMs });
    }

    return next();
  };
}

// Usage:
// export const rateLimit = createRateLimitMiddleware(100, 60000); // 100 req/min
