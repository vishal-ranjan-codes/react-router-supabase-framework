import { Form, Link, useActionData, useNavigation, data } from "react-router";
import { requireAuth } from "~/middleware/chains";
import { supabaseContext } from "~/lib/supabase/context";
import { authConfig } from "~/lib/auth/config";
import { updatePassword } from "~/lib/auth/providers";
import { AuthLayout } from "~/components/auth/AuthLayout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { Route } from "./+types/auth.reset-password";

export const middleware: Route.MiddlewareFunction[] = requireAuth;

export function meta() {
  return [
    { title: "Reset Password" },
    { name: "description", content: "Choose a new password" },
  ];
}

export async function action({ request, context }: Route.ActionArgs) {
  const supabase = context.get(supabaseContext);

  if (!supabase) {
    return data(
      {
        error:
          "Authentication is not configured. Please set up Supabase credentials.",
      },
      { status: 503 }
    );
  }

  if (!authConfig.passwordReset) {
    return data(
      { error: "Password reset is not available" },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password.length < authConfig.passwordMinLength) {
    return data(
      {
        error: `Use at least ${authConfig.passwordMinLength} characters`,
      },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return data({ error: "Passwords do not match" }, { status: 400 });
  }

  return updatePassword(supabase, password);
}

export default function ResetPassword() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  const error = actionData && "error" in actionData ? actionData.error : null;
  const done =
    actionData && "success" in actionData ? Boolean(actionData.success) : false;

  const footer = (
    <p className="text-center text-sm theme-fc-light">
      <Link to="/sign-in" className="text-primary hover:underline">
        &larr; Back to sign in
      </Link>
    </p>
  );

  return (
    <AuthLayout
      title="New Password"
      description="Choose the password for your account"
      footer={footer}
    >
      {done ? (
        <div className="space-y-4">
          <div className="rounded-md theme-bg-success p-4 text-sm theme-text-success text-center">
            Password updated.
          </div>
          <Button className="w-full" asChild>
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      ) : (
        <Form method="POST" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={authConfig.passwordMinLength}
              placeholder="New password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={authConfig.passwordMinLength}
              placeholder="Repeat the new password"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </Form>
      )}
    </AuthLayout>
  );
}
