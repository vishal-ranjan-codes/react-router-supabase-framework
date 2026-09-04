import type { MiddlewareFunction } from "react-router";

// Simple in-memory rate limiter (use Cloudflare KV for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function createRateLimitMiddleware(
  maxRequests: number,
  windowMs: number
): MiddlewareFunction<Response> {
  return async ({ request }, next) => {
    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const now = Date.now();

    const limit = rateLimitMap.get(ip);

    if (limit && limit.resetTime > now) {
      if (limit.count >= maxRequests) {
        return new Response(
          JSON.stringify({ error: "Too many requests" }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(
                Math.ceil((limit.resetTime - now) / 1000)
              ),
            },
          }
        );
      }
      limit.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    }

    return next();
  };
}

// Usage:
// export const rateLimit = createRateLimitMiddleware(100, 60000); // 100 req/min
