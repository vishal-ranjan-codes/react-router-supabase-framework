import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRateLimitMiddleware } from "./rate-limit";

describe("rate limit middleware", () => {
  it("allows requests within limit", async () => {
    const middleware = createRateLimitMiddleware(2, 60000);
    const request = new Request("http://localhost/test", {
      headers: { "cf-connecting-ip": "1.2.3.4" },
    });
    const context = { get: vi.fn(), set: vi.fn() };
    const next = vi.fn().mockResolvedValue(new Response("OK"));

    const response = await middleware({ request, context } as any, next);
    expect(response).toBeDefined();
    expect(response!.status).toBe(200);
  });

  it("blocks requests over limit", async () => {
    const middleware = createRateLimitMiddleware(1, 60000);
    const request = new Request("http://localhost/test", {
      headers: { "cf-connecting-ip": "5.6.7.8" },
    });
    const context = { get: vi.fn(), set: vi.fn() };
    const next = vi.fn().mockResolvedValue(new Response("OK"));

    // First request - should pass
    await middleware({ request, context } as any, next);

    // Second request - should be blocked
    const response = await middleware({ request, context } as any, next);
    expect(response).toBeDefined();
    expect(response!.status).toBe(429);
  });
});
