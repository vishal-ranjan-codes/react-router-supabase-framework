import { redirect } from "react-router";
import { supabaseMiddleware } from "~/middleware/supabase";
import { supabaseContext } from "~/lib/supabase/context";
import type { Route } from "./+types/auth.callback";

export const middleware: Route.MiddlewareFunction[] = [supabaseMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/dashboard";

  const supabase = context.get(supabaseContext);
  if (!supabase || !code) {
    return redirect("/sign-in?error=auth-callback-failed");
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (!error) {
    return redirect(next);
  }

  return redirect("/sign-in?error=auth-callback-failed");
}
