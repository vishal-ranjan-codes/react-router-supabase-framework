import type { MiddlewareFunction } from "react-router";

export function createCorsMiddleware(
  origins: string[] = ["*"]
): MiddlewareFunction<Response> {
  return async ({ request }, next) => {
    const origin = request.headers.get("origin") ?? "";
    const allowedOrigin = origins.includes("*")
      ? origin
      : origins.includes(origin)
        ? origin
        : "";

    // Handle OPTIONS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin || "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin",
        },
      });
    }

    const response = await next();

    // Without this a shared cache can serve one origin's CORS headers to another.
    response.headers.append("Vary", "Origin");

    if (allowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
    }

    return response;
  };
}
