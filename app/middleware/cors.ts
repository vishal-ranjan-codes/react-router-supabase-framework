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
        },
      });
    }

    const response = await next();

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
