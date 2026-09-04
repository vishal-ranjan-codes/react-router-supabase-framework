import { redirect } from "react-router";
import { supabaseMiddleware } from "~/middleware/supabase";
import { supabaseContext } from "~/lib/supabase/context";
import type { Route } from "./+types/sign-out";

export const middleware: Route.MiddlewareFunction[] = [supabaseMiddleware];

export async function action({ context }: Route.ActionArgs) {
  const supabase = context.get(supabaseContext);
  if (supabase) {
    await supabase.auth.signOut();
  }
  return redirect("/");
}

export async function loader({ context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseContext);
  if (supabase) {
    await supabase.auth.signOut();
  }
  return redirect("/");
}
