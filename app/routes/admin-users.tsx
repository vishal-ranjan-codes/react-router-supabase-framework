import type { Route } from "./+types/admin-users";
import { supabaseContext } from "~/lib/supabase/context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";

export async function loader({ context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseContext);

  if (!supabase) {
    return { users: [] };
  }

  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return { users: users ?? [] };
}

export default function AdminUsers({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData;

  return (
    <div className="space-y-6">
      <h1 className="theme-h1">Users</h1>

      <div className="rounded-lg border theme-border-color theme-fg-color">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="theme-fc-light">Email</TableHead>
              <TableHead className="theme-fc-light">Role</TableHead>
              <TableHead className="theme-fc-light">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="theme-fc-heading">{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="theme-fc-light">
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
