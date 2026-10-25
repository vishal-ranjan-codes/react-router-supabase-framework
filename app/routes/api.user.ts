import { data } from "react-router";
import type { Route } from "./+types/api.user";
import { requireAuth } from "~/middleware/chains";
import { userContext } from "~/lib/context";

export const middleware: Route.MiddlewareFunction[] = requireAuth;

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  if (!user) {
    return data({ error: "Unauthorized" }, { status: 401 });
  }

  return data({ id: user.id, email: user.email });
}
