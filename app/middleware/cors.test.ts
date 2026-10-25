import { describe, it, expect, vi } from "vitest";
import { createCorsMiddleware } from "./cors";

// `Origin` is a forbidden header name, so a real Request drops it no matter what
// the test asks for; this double lets the middleware's own lookups be exercised.
function fakeRequest(method: string, origin: string | null): Request {
  return {
    method,
    headers: {
      get: (name: string) =>
        name.toLowerCase() === "origin" ? origin : null,
    },
  } as unknown as Request;
}

async function call(origins: string[] | undefined, request: Request) {
  const middleware = createCorsMiddleware(origins);
  const context = { get: vi.fn(), set: vi.fn() };
  const next = vi.fn().mockResolvedValue(new Response("OK"));

  const response = await middleware({ request, context } as never, next);

  return { response: response!, next };
}

describe("cors middleware", () => {
  it("answers preflight without calling downstream", async () => {
    const { response, next } = await call(
      ["https://trusted.test"],
      fakeRequest("OPTIONS", "https://trusted.test")
    );

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://trusted.test"
    );
    expect(response.headers.get("Access-Control-Max-Age")).toBe("86400");
    expect(response.headers.get("Vary")).toContain("Origin");
    expect(next).not.toHaveBeenCalled();
  });

  it("echoes an allowed origin on a real request", async () => {
    const { response, next } = await call(
      ["https://trusted.test"],
      fakeRequest("GET", "https://trusted.test")
    );

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://trusted.test"
    );
    expect(next).toHaveBeenCalledOnce();
  });

  it("sends no allow header for a rejected origin but still varies on it", async () => {
    const { response } = await call(
      ["https://trusted.test"],
      fakeRequest("GET", "https://untrusted.test")
    );

    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
    expect(response.headers.get("Vary")).toContain("Origin");
  });

  it("echoes any origin when configured as a wildcard", async () => {
    const { response } = await call(
      undefined,
      fakeRequest("GET", "https://anywhere.test")
    );

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://anywhere.test"
    );
  });

  it("falls back to a wildcard allow-origin for an origin-less preflight", async () => {
    const { response } = await call(
      undefined,
      fakeRequest("OPTIONS", null)
    );

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});
