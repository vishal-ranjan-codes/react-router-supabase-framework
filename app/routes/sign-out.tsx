import { redirect } from "react-router";
import { supabaseMiddleware } from "~/middleware/supabase";
import { supabaseContext } from "~/lib/supabase/context";
import type { Route } from "./+types/sign-out";

export const middleware: Route.MiddlewareFunction[] = [supabaseMiddleware];

/**
 * POST only on purpose: a hover-prefetched <Link> or a browser GET must never end a session.
 * Throwing still unwinds through supabaseMiddleware, which appends the cookie-clearing
 * Set-Cookie headers to this 302.
 */
export async function action({ context }: Route.ActionArgs) {
  const supabase = context.get(supabaseContext);
  if (supabase) {
    await supabase.auth.signOut();
  }

  throw redirect("/");
}
