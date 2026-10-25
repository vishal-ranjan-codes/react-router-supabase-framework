import type { MiddlewareFunction } from "react-router";
import { adminMiddleware, authMiddleware } from "~/middleware/auth";
import { supabaseMiddleware } from "~/middleware/supabase";

/**
 * Precomposed chains so a protected route is one line, not a copy-pasted pair of imports.
 *
 * `supabaseMiddleware` is idempotent per request, so these stay correct even though `app/root.tsx`
 * already installs it - and a route that forgets it still gets a client.
 */
export const requireAuth: MiddlewareFunction<Response>[] = [
  supabaseMiddleware,
  authMiddleware,
];

export const requireAdmin: MiddlewareFunction<Response>[] = [
  supabaseMiddleware,
  adminMiddleware,
];
