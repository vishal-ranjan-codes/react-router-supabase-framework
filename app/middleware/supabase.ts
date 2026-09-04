import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import type { MiddlewareFunction } from "react-router";
import { supabaseContext } from "~/lib/supabase/context";

type PendingCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

export const supabaseMiddleware: MiddlewareFunction<Response> = async (
  { request, context },
  next
) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  // Graceful degradation: If credentials missing, store null and continue
  if (!supabaseUrl || !supabasePublishableKey) {
    context.set(supabaseContext, null);
    return next();
  }

  const pendingCookies: PendingCookie[] = [];
  const pendingHeaders: Record<string, string> = {};

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get("Cookie") ?? "");
      },
      setAll(cookiesToSet, headers) {
        pendingCookies.push(...cookiesToSet);
        Object.assign(pendingHeaders, headers);
      },
    },
  });

  // Trigger session refresh before any route code runs.
  // getClaims() validates the JWT locally (via JWKS) and returns claims.
  // If the token is expired, it uses the refresh token from cookies.
  await supabase.auth.getClaims();

  // Store client in context for downstream routes
  context.set(supabaseContext, supabase);

  // Continue to next middleware / route handler
  const response = await next();

  // Write any new/refreshed cookies back to the response
  for (const { name, value, options } of pendingCookies) {
    response.headers.append(
      "Set-Cookie",
      serializeCookieHeader(name, value, options)
    );
  }

  for (const [key, value] of Object.entries(pendingHeaders)) {
    response.headers.set(key, value);
  }

  return response;
};
