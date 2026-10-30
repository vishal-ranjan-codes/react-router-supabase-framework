import type { MiddlewareFunction } from "react-router";
import { type Mock, vi } from "vitest";

type MiddlewareArgs = Parameters<MiddlewareFunction<Response>>[0];

/**
 * Middleware under test only reads `request` (and sometimes `context`), so a partial double
 * keeps the call honest without booting a router.
 */
export function middlewareArgsFor(request: Request): MiddlewareArgs {
  return {
    request,
    context: { get: vi.fn(), set: vi.fn() },
  } as unknown as MiddlewareArgs;
}

/** The downstream handler: records the call and resolves with a plain 200. */
export function okNext(): Mock<() => Promise<Response>> {
  return vi.fn().mockResolvedValue(new Response("OK", { status: 200 }));
}

/**
 * `MiddlewareFunction<Result>` is typed to return `Result | void` because a middleware may
 * return nothing and let the route handler answer. Every branch these tests exercise returns.
 */
type MiddlewareResult = Awaited<ReturnType<MiddlewareFunction<Response>>>;

export function expectResponse(result: MiddlewareResult): Response {
  if (!(result instanceof Response)) {
    throw new Error(
      `Expected the middleware to return a Response, got ${typeof result}`,
    );
  }
  return result;
}

/**
 * `Origin` is a forbidden header name, so a real Request drops it no matter what the test
 * asks for; this double lets middleware that reads it be exercised.
 */
export function requestWithOrigin(
  method: string,
  origin: string | null,
): Request {
  return {
    method,
    headers: {
      get: (name: string) => (name.toLowerCase() === "origin" ? origin : null),
    },
  } as unknown as Request;
}
