import { redirect } from "react-router";
import type { MiddlewareFunction } from "react-router";
import { supabaseContext } from "~/lib/supabase/context";
import { userContext } from "~/lib/context";

/**
 * Auth middleware - requires authenticated user.
 * Throws redirect to /sign-in if not authenticated.
 * Stores user in context for downstream routes.
 */
export const authMiddleware: MiddlewareFunction<Response> = async ({
  context,
}) => {
  const supabase = context.get(supabaseContext);
  if (!supabase) {
    throw redirect("/sign-in");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw redirect("/sign-in");
  }

  // Store user in context for child routes to use
  context.set(userContext, user);
};

/**
 * Admin middleware - requires authenticated user with 'admin' role.
 * Throws redirect to /dashboard if not admin (hides admin path existence).
 */
export const adminMiddleware: MiddlewareFunction<Response> = async ({
  context,
}) => {
  const supabase = context.get(supabaseContext);
  if (!supabase) {
    throw redirect("/sign-in");
  }

  // 1. Authenticate
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw redirect("/sign-in");
  }

  // 2. Authorize (check role in profiles table)
  const { data: profile, error: dbError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (dbError || profile?.role !== "admin") {
    // Silent redirect to dashboard - don't reveal admin path exists
    throw redirect("/dashboard");
  }

  // Store user in context
  context.set(userContext, user);
};
