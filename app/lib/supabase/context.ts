import type { SupabaseClient } from "@supabase/supabase-js";
import { createContext } from "react-router";
import type { Database } from "~/types/database.types";

/**
 * The subset of the verified JWT claims the starter acts on. `supabaseMiddleware` extracts these
 * once per request; anything else a route needs should come from the database, not the token.
 */
export type AuthClaims = { sub: string; email?: string };

export const supabaseContext = createContext<SupabaseClient<Database> | null>(
  null,
);

/** Verified claims for this request, or null when there is no valid session. */
export const authClaimsContext = createContext<AuthClaims | null>(null);

/**
 * Guards against a route re-declaring `supabaseMiddleware` after `app/root.tsx` already did,
 * which would validate the JWT twice and append the same `Set-Cookie` values twice.
 */
export const supabaseHandledContext = createContext(false);
