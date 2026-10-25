import { data, Form, useActionData, useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { userContext } from "~/lib/context";
import { supabaseContext } from "~/lib/supabase/context";
import type { Route } from "./+types/dashboard-settings";

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  return { user };
}

export async function action({ request, context }: Route.ActionArgs) {
  const supabase = context.get(supabaseContext);
  const user = context.get(userContext);
  const formData = await request.formData();
  const displayName = formData.get("displayName") as string;

  if (!supabase || !user) {
    return data({ error: "Not authenticated" }, { status: 401 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", user.id);

  if (error) {
    return data({ error: error.message }, { status: 400 });
  }

  return data({ success: true });
}

export default function DashboardSettings({
  loaderData,
}: Route.ComponentProps) {
  const { user } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  const isSuccess = actionData && "success" in actionData && actionData.success;
  const errorMessage =
    actionData && "error" in actionData ? actionData.error : null;

  return (
    <div className="space-y-6">
      <h1 className="theme-h1">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="POST" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email ?? ""}
                disabled
              />
              <p className="text-xs theme-fc-light">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                type="text"
                placeholder="Your display name"
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
            {isSuccess && (
              <p className="text-sm theme-text-success">Settings saved!</p>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
