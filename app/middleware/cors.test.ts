import { describe, expect, it } from "vitest";
import {
  expectResponse,
  middlewareArgsFor,
  okNext,
  requestWithOrigin,
} from "../../tests/helpers/middleware";
import { createCorsMiddleware } from "./cors";

async function call(origins: string[] | undefined, request: Request) {
  const middleware = createCorsMiddleware(origins);
  const next = okNext();

  const response = expectResponse(
    await middleware(middlewareArgsFor(request), next),
  );

  return { response, next };
}

describe("cors middleware", () => {
  it("answers preflight without calling downstream", async () => {
    const { response, next } = await call(
      ["https://trusted.test"],
      requestWithOrigin("OPTIONS", "https://trusted.test"),
    );

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://trusted.test",
    );
    expect(response.headers.get("Access-Control-Max-Age")).toBe("86400");
    expect(response.headers.get("Vary")).toContain("Origin");
    expect(next).not.toHaveBeenCalled();
  });

  it("echoes an allowed origin on a real request", async () => {
    const { response, next } = await call(
      ["https://trusted.test"],
      requestWithOrigin("GET", "https://trusted.test"),
    );

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://trusted.test",
    );
    expect(next).toHaveBeenCalledOnce();
  });

  it("sends no allow header for a rejected origin but still varies on it", async () => {
    const { response } = await call(
      ["https://trusted.test"],
      requestWithOrigin("GET", "https://untrusted.test"),
    );

    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
    expect(response.headers.get("Vary")).toContain("Origin");
  });

  it("echoes any origin when configured as a wildcard", async () => {
    const { response } = await call(
      undefined,
      requestWithOrigin("GET", "https://anywhere.test"),
    );

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://anywhere.test",
    );
  });

  it("falls back to a wildcard allow-origin for an origin-less preflight", async () => {
    const { response } = await call(
      undefined,
      requestWithOrigin("OPTIONS", null),
    );

    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});
