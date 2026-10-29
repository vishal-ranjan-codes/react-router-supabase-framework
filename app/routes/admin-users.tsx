import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { supabaseContext } from "~/lib/supabase/context";
import type { Route } from "./+types/admin-users";

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
      <h1 className="text-h1">Users</h1>

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-muted-foreground">Email</TableHead>
              <TableHead className="text-muted-foreground">Role</TableHead>
              <TableHead className="text-muted-foreground">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
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
