import { Activity, Database, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { supabaseContext } from "~/lib/supabase/context";
import type { Route } from "./+types/admin-home";

export async function loader({ context }: Route.LoaderArgs) {
  const supabase = context.get(supabaseContext);

  if (!supabase) {
    return { userCount: 0 };
  }

  const { count: userCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return { userCount };
}

export default function AdminHome({ loaderData }: Route.ComponentProps) {
  const { userCount } = loaderData;

  return (
    <div className="space-y-6">
      <h1 className="text-h1">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {userCount ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-success">Healthy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-foreground">Supabase</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
