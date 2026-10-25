import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { authConfig } from "~/lib/auth/config";

interface PasswordFormProps {
  mode: "sign-in" | "sign-up";
  error?: string | null;
  /** Sign-up accepted but the project requires email confirmation before a session exists. */
  requiresConfirmation?: boolean;
  /** A password reset email is on its way. */
  emailSent?: boolean;
  /** Renders the "Forgot password?" submitter; only meaningful in sign-in mode. */
  canResetPassword?: boolean;
  isLoading?: boolean;
}

export function PasswordForm({
  mode,
  error,
  requiresConfirmation,
  emailSent,
  canResetPassword,
  isLoading,
}: PasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const minLength = authConfig.passwordMinLength;

  return (
    <Form method="POST" className="space-y-4">
      <input type="hidden" name="method" value="email-password" />

      {requiresConfirmation && (
        <div className="rounded-md theme-bg-success p-4 text-sm theme-text-success text-center">
          Check your email to confirm your account.
        </div>
      )}

      {emailSent && (
        <div className="rounded-md theme-bg-success p-4 text-sm theme-text-success text-center">
          Check your email for a password reset link.
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {mode === "sign-in" && canResetPassword && (
            // formNoValidate keeps the reset submitter from demanding the password field.
            <button
              type="submit"
              name="intent"
              value="reset"
              formNoValidate
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </button>
          )}
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Enter your password"
            minLength={mode === "sign-up" ? minLength : undefined}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 theme-fc-light hover:theme-fc-heading"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mode === "sign-up" && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            placeholder="Confirm your password"
            minLength={minLength}
          />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? mode === "sign-in"
            ? "Signing in..."
            : "Creating account..."
          : mode === "sign-in"
            ? "Sign In"
            : "Sign Up"}
      </Button>
    </Form>
  );
}
