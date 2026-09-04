import { Form, Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordFormProps {
  mode: "sign-in" | "sign-up";
  error?: string | null;
  isLoading?: boolean;
}

export function PasswordForm({ mode, error, isLoading }: PasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Form method="POST" className="space-y-4">
      <input type="hidden" name="method" value="email-password" />

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
          {mode === "sign-in" && (
            <span className="text-xs text-primary cursor-default">
              Forgot password?
            </span>
          )}
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="Enter your password"
            minLength={8}
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
            minLength={8}
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
