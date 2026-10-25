import { env } from "cloudflare:workers";
import type { CookieOptions } from "@supabase/ssr";
import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import type { MiddlewareFunction } from "react-router";
import {
  authClaimsContext,
  supabaseContext,
  supabaseHandledContext,
} from "~/lib/supabase/context";

type PendingCookie = {
  name: string;
  value: string;
  options: CookieOptions;
};

export const supabaseMiddleware: MiddlewareFunction<Response> = async (
  { request, context },
  next,
) => {
  // app/root.tsx already installs this middleware, so a route that lists it again must no-op:
  // running twice would validate the JWT twice and duplicate every refreshed cookie.
  if (context.get(supabaseHandledContext)) {
    return next();
  }
  context.set(supabaseHandledContext, true);

  const supabaseUrl = env.SUPABASE_URL;
  const supabasePublishableKey = env.SUPABASE_PUBLISHABLE_KEY;

  // Graceful degradation: If credentials missing, store null and continue
  if (!supabaseUrl || !supabasePublishableKey) {
    context.set(supabaseContext, null);
    context.set(authClaimsContext, null);
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

  // Trigger session refresh before any route code runs, and keep the result: getClaims()
  // verifies the JWT locally (via JWKS) and refreshes it when expired, so downstream middleware
  // can trust these claims instead of calling getUser() for a second network round trip.
  const { data, error } = await supabase.auth.getClaims();
  context.set(
    authClaimsContext,
    error || !data ? null : { sub: data.claims.sub, email: data.claims.email },
  );

  // Store client in context for downstream routes
  context.set(supabaseContext, supabase);

  // Continue to next middleware / route handler
  const response = await next();

  // Write any new/refreshed cookies back to the response
  for (const { name, value, options } of pendingCookies) {
    response.headers.append(
      "Set-Cookie",
      serializeCookieHeader(name, value, options),
    );
  }

  for (const [key, value] of Object.entries(pendingHeaders)) {
    response.headers.set(key, value);
  }

  return response;
};
