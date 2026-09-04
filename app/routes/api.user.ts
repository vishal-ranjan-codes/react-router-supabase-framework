import { data } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { supabaseContext } from "~/lib/supabase/context";
import { supabaseMiddleware } from "~/middleware/supabase";
import { authMiddleware } from "~/middleware/auth";
import type { Route } from "./+types/api.user";

export const middleware: Route.MiddlewareFunction[] = [
  supabaseMiddleware,
  authMiddleware,
];

export async function loader({ context }: LoaderFunctionArgs) {
  const supabase = context.get(supabaseContext);
  const {
    data: { user },
  } = await supabase!.auth.getUser();

  return data({
    id: user!.id,
    email: user!.email,
    created_at: user!.created_at,
  });
}
