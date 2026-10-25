import type { MiddlewareFunction } from "react-router";
import { describe, expect, it, vi } from "vitest";
import {
  expectResponse,
  middlewareArgsFor,
  okNext,
} from "../../tests/helpers/middleware";
import { createRateLimitMiddleware } from "./rate-limit";

function requestFrom(ip: string): Request {
  return new Request("http://localhost/test", {
    headers: { "cf-connecting-ip": ip },
  });
}

async function call(
  middleware: MiddlewareFunction<Response>,
  ip: string,
  next = okNext(),
) {
  return expectResponse(
    await middleware(middlewareArgsFor(requestFrom(ip)), next),
  );
}

describe("rate limit middleware", () => {
  it("allows requests within limit", async () => {
    const middleware = createRateLimitMiddleware(2, 60_000);

    expect((await call(middleware, "1.2.3.4")).status).toBe(200);
    expect((await call(middleware, "1.2.3.4")).status).toBe(200);
  });

  it("blocks requests over limit", async () => {
    const middleware = createRateLimitMiddleware(1, 60_000);

    expect((await call(middleware, "5.6.7.8")).status).toBe(200);
    expect((await call(middleware, "5.6.7.8")).status).toBe(429);
  });

  it("keeps windows per limiter instance", async () => {
    const apiLimiter = createRateLimitMiddleware(1, 60_000);
    const assetLimiter = createRateLimitMiddleware(1, 60_000);

    expect((await call(apiLimiter, "9.9.9.9")).status).toBe(200);
    expect((await call(assetLimiter, "9.9.9.9")).status).toBe(200);
  });

  it("lets traffic through again once the window expires", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-24T12:00:00Z"));

    const middleware = createRateLimitMiddleware(1, 1000);

    expect((await call(middleware, "8.8.8.8")).status).toBe(200);

    const blocked = await call(middleware, "8.8.8.8");
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBe("1");

    vi.advanceTimersByTime(1001);

    expect((await call(middleware, "8.8.8.8")).status).toBe(200);

    vi.useRealTimers();
  });
});
