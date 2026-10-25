import { describe, it, expect, vi } from "vitest";
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

  it("keeps windows per limiter instance", async () => {
    const request = new Request("http://localhost/test", {
      headers: { "cf-connecting-ip": "9.9.9.9" },
    });
    const context = { get: vi.fn(), set: vi.fn() };
    const next = vi.fn().mockResolvedValue(new Response("OK"));

    const apiLimiter = createRateLimitMiddleware(1, 60000);
    const assetLimiter = createRateLimitMiddleware(1, 60000);

    expect((await apiLimiter({ request, context } as any, next))!.status).toBe(
      200
    );
    expect(
      (await assetLimiter({ request, context } as any, next))!.status
    ).toBe(200);
  });

  it("lets traffic through again once the window expires", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-24T12:00:00Z"));

    const middleware = createRateLimitMiddleware(1, 1000);
    const request = new Request("http://localhost/test", {
      headers: { "cf-connecting-ip": "8.8.8.8" },
    });
    const context = { get: vi.fn(), set: vi.fn() };
    const next = vi.fn().mockResolvedValue(new Response("OK"));

    await middleware({ request, context } as any, next);

    const blocked = await middleware({ request, context } as any, next);
    expect(blocked!.status).toBe(429);
    expect(blocked!.headers.get("Retry-After")).toBe("1");

    vi.advanceTimersByTime(1001);

    expect((await middleware({ request, context } as any, next))!.status).toBe(
      200
    );

    vi.useRealTimers();
  });
});
