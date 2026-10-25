import { redirect } from "react-router";
import type { MiddlewareFunction } from "react-router";
import { userContext } from "~/lib/context";
import type { SessionUser } from "~/lib/context";
import { authClaimsContext, supabaseContext } from "~/lib/supabase/context";

/**
 * Auth middleware - requires an authenticated user.
 *
 * Reads the claims `supabaseMiddleware` already verified for this request, so protecting a route
 * costs no extra call to the Auth server. Throws redirect to /sign-in when there is none, and
 * stores the session user for downstream loaders and actions.
 */
export const authMiddleware: MiddlewareFunction<Response> = async ({
  context,
}) => {
  const claims = context.get(authClaimsContext);
  if (!claims) {
    throw redirect("/sign-in");
  }

  const user: SessionUser = { id: claims.sub, email: claims.email ?? null };
  context.set(userContext, user);
};

/**
 * Admin middleware - requires an authenticated user whose profile role is 'admin'.
 *
 * Authentication is the same claim check; only the authorization needs a query, and a non-admin
 * is redirected to /dashboard rather than shown an error so the admin path stays invisible.
 */
export const adminMiddleware: MiddlewareFunction<Response> = async ({
  context,
}) => {
  const claims = context.get(authClaimsContext);
  const supabase = context.get(supabaseContext);
  if (!claims || !supabase) {
    throw redirect("/sign-in");
  }

  const user: SessionUser = { id: claims.sub, email: claims.email ?? null };

  const { data: profile, error: dbError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (dbError || profile?.role !== "admin") {
    throw redirect("/dashboard");
  }

  context.set(userContext, user);
};
