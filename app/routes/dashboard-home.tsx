import { Calendar, Shield, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { userContext } from "~/lib/context";
import { supabaseContext } from "~/lib/supabase/context";
import type { Route } from "./+types/dashboard-home";

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  const supabase = context.get(supabaseContext);

  // Fetch additional profile data
  let profile = null;
  if (supabase && user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return { user, profile };
}

export default function DashboardHome({ loaderData }: Route.ComponentProps) {
  const { user, profile } = loaderData;

  return (
    <div className="space-y-6">
      <h1 className="theme-h1">Welcome back</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Email</CardTitle>
            <User className="h-4 w-4 theme-fc-light" />
          </CardHeader>
          <CardContent>
            <p className="theme-fc-base text-lg">{user?.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Role</CardTitle>
            <Shield className="h-4 w-4 theme-fc-light" />
          </CardHeader>
          <CardContent>
            <p className="theme-fc-base text-lg capitalize">
              {profile?.role || "user"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Calendar className="h-4 w-4 theme-fc-light" />
          </CardHeader>
          <CardContent>
            <p className="theme-fc-base text-lg">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
