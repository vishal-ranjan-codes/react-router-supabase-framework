import { useState } from "react";
import { Link, useActionData, useNavigation, data } from "react-router";
import { supabaseMiddleware } from "~/middleware/supabase";
import { supabaseContext } from "~/lib/supabase/context";
import { authConfig } from "~/lib/auth/config";
import {
  signUpWithPassword,
  signInWithMagicLink,
  sendEmailOtp,
  verifyEmailOtp,
  signInWithGoogle,
} from "~/lib/auth/providers";
import { AuthLayout } from "~/components/auth/AuthLayout";
import { PasswordForm } from "~/components/auth/PasswordForm";
import { EmailOtpForm } from "~/components/auth/EmailOtpForm";
import { GoogleButton } from "~/components/auth/GoogleButton";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/sign-up";

export const middleware: Route.MiddlewareFunction[] = [supabaseMiddleware];

export function meta() {
  return [
    { title: "Sign Up" },
    { name: "description", content: "Create a new account" },
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

  const formData = await request.formData();
  const method = formData.get("method") as string;
  const origin = new URL(request.url).origin;

  switch (method) {
    case "email-password": {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        return data({ error: "Passwords do not match" }, { status: 400 });
      }

      return signUpWithPassword(supabase, email, password, origin);
    }
    case "email-otp": {
      const otpAction = formData.get("otpAction") as string;
      const email = formData.get("email") as string;

      if (otpAction === "verify") {
        const token = formData.get("token") as string;
        return verifyEmailOtp(supabase, email, token);
      }

      const result = await sendEmailOtp(supabase, email);
      return { ...result, otpAction: "sent" };
    }
    case "magic-link": {
      const email = formData.get("email") as string;
      return signInWithMagicLink(supabase, email, origin);
    }
    case "google": {
      return signInWithGoogle(supabase, origin);
    }
    default:
      return data({ error: "Invalid authentication method" }, { status: 400 });
  }
}

export default function SignUp() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";
  const [activeMethod, setActiveMethod] = useState<"email-password" | "email-otp">("email-password");

  const error = actionData && "error" in actionData ? actionData.error : null;
  const otpSent =
    actionData && "otpSent" in actionData ? actionData.otpSent : false;
  const otpEmail =
    actionData && "email" in actionData ? actionData.email : undefined;

  const footer = (
    <p className="text-center text-sm theme-fc-light">
      Already have an account?{" "}
      <Link to="/sign-in" className="text-primary hover:underline">
        Sign in
      </Link>
    </p>
  );

  return (
    <AuthLayout
      title="Sign Up"
      description="Create a new account"
      footer={footer}
    >
      <div className="space-y-4">
        {activeMethod === "email-password" ? (
          <PasswordForm mode="sign-up" error={error} isLoading={isLoading} />
        ) : (
          <EmailOtpForm error={error} otpSent={otpSent} email={otpEmail} isLoading={isLoading} />
        )}

        {authConfig.methods.emailOtp && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t theme-border-color" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="theme-bg-color px-2 theme-fc-light">or</span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={() =>
                setActiveMethod(activeMethod === "email-password" ? "email-otp" : "email-password")
              }
            >
              {activeMethod === "email-password" ? "Sign up with OTP" : "Sign up with Password"}
            </Button>
          </>
        )}

        {authConfig.methods.google && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t theme-border-color" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="theme-bg-color px-2 theme-fc-light">
                  or continue with
                </span>
              </div>
            </div>
            <GoogleButton action="sign-up" isLoading={isLoading} />
          </>
        )}
      </div>
    </AuthLayout>
  );
}
