import { useState } from "react";
import { Link, useActionData, useNavigation, data, redirect } from "react-router";
import { supabaseMiddleware } from "~/middleware/supabase";
import { supabaseContext } from "~/lib/supabase/context";
import {
  getDefaultMethod,
  getEnabledFormMethods,
  isMethodEnabled,
  type AuthMethod,
} from "~/lib/auth/config";
import {
  signUpWithPassword,
  signInWithMagicLink,
  sendEmailOtp,
  verifyEmailOtp,
  signInWithGoogle,
} from "~/lib/auth/providers";
import { AuthLayout, AuthDivider } from "~/components/auth/AuthLayout";
import { MethodSelector } from "~/components/auth/MethodSelector";
import { PasswordForm } from "~/components/auth/PasswordForm";
import { EmailOtpForm } from "~/components/auth/EmailOtpForm";
import { MagicLinkForm } from "~/components/auth/MagicLinkForm";
import { GoogleButton } from "~/components/auth/GoogleButton";
import type { OtpIntent } from "~/lib/auth/types";
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
  const method = formData.get("method") as AuthMethod;
  const origin = new URL(request.url).origin;
  const email = String(formData.get("email") ?? "").trim();

  // The flags decide which methods exist at all, not just which buttons render.
  if (!isMethodEnabled(method)) {
    return data({ error: "Invalid authentication method" }, { status: 400 });
  }

  switch (method) {
    case "email-password": {
      if (!email) {
        return data({ error: "Enter your email address" }, { status: 400 });
      }

      const password = String(formData.get("password") ?? "");
      const confirmPassword = String(formData.get("confirmPassword") ?? "");

      if (!password) {
        return data({ error: "Enter a password" }, { status: 400 });
      }

      if (password !== confirmPassword) {
        return data({ error: "Passwords do not match" }, { status: 400 });
      }

      const result = await signUpWithPassword(supabase, email, password, origin);
      if (result.error || result.requiresConfirmation) return result;
      throw redirect(result.redirectTo ?? "/dashboard");
    }
    case "email-otp": {
      const intent = (formData.get("otpAction") ?? "send") as OtpIntent;

      if (intent === "verify") {
        if (!email) {
          return data({ error: "Enter your email address" }, { status: 400 });
        }

        const token = String(formData.get("token") ?? "");
        if (!token) {
          return data(
            { error: "Enter the 6-digit code", otpStep: "verify" },
            { status: 400 }
          );
        }

        const result = await verifyEmailOtp(supabase, email, token);
        if (result.error) return { ...result, otpStep: "verify" as const };
        throw redirect(result.redirectTo ?? "/dashboard");
      }

      if (!email) {
        return data({ error: "Enter your email address" }, { status: 400 });
      }

      const result = await sendEmailOtp(supabase, email);
      if (result.error) return result;
      throw redirect(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    }
    case "magic-link": {
      if (!email) {
        return data({ error: "Enter your email address" }, { status: 400 });
      }
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
  const methods = getEnabledFormMethods();
  const [activeMethod, setActiveMethod] = useState<AuthMethod>(getDefaultMethod);
  // When every flag is off, getDefaultMethod() still names a method so the page is never blank -
  // but rendering its panel would show a form the action always rejects, so gate it on the flags.
  const panel = methods.includes(activeMethod) ? activeMethod : undefined;

  const error = actionData && "error" in actionData ? actionData.error : null;
  const emailSent =
    actionData && "otpSent" in actionData ? Boolean(actionData.otpSent) : false;
  const otpStep =
    actionData && "otpStep" in actionData ? actionData.otpStep : undefined;
  const sentEmail =
    actionData && "email" in actionData ? actionData.email : undefined;
  const requiresConfirmation =
    actionData && "requiresConfirmation" in actionData
      ? Boolean(actionData.requiresConfirmation)
      : false;

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
        <MethodSelector
          methods={methods}
          activeMethod={activeMethod}
          onChange={setActiveMethod}
        />

        {panel === "email-password" && (
          <PasswordForm
            mode="sign-up"
            error={error}
            requiresConfirmation={requiresConfirmation}
            isLoading={isLoading}
          />
        )}

        {panel === "email-otp" && (
          <EmailOtpForm
            error={error}
            otpSent={otpStep === "verify"}
            email={sentEmail}
            isLoading={isLoading}
          />
        )}

        {panel === "magic-link" && (
          <MagicLinkForm
            error={error}
            success={emailSent}
            isLoading={isLoading}
          />
        )}

        {methods.length === 0 && (
          <p className="rounded-md border theme-border-color p-4 text-center text-sm theme-fc-light">
            No authentication methods are enabled. Turn some on in{" "}
            <code className="text-xs">app/lib/auth/config.ts</code>.
          </p>
        )}

        {isMethodEnabled("google") && (
          <>
            <AuthDivider label="or continue with" />
            <GoogleButton action="sign-up" isLoading={isLoading} />
          </>
        )}
      </div>
    </AuthLayout>
  );
}
