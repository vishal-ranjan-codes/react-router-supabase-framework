import { useState } from "react";
import { Link, useActionData, useNavigation, data, redirect } from "react-router";
import { supabaseMiddleware } from "~/middleware/supabase";
import { supabaseContext } from "~/lib/supabase/context";
import {
  authConfig,
  getDefaultMethod,
  getEnabledFormMethods,
  isMethodEnabled,
  type AuthMethod,
} from "~/lib/auth/config";
import {
  signInWithPassword,
  signInWithMagicLink,
  sendEmailOtp,
  verifyEmailOtp,
  resetPasswordForEmail,
  signInWithGoogle,
} from "~/lib/auth/providers";
import { AuthLayout, AuthDivider } from "~/components/auth/AuthLayout";
import { MethodSelector } from "~/components/auth/MethodSelector";
import { PasswordForm } from "~/components/auth/PasswordForm";
import { EmailOtpForm } from "~/components/auth/EmailOtpForm";
import { MagicLinkForm } from "~/components/auth/MagicLinkForm";
import { GoogleButton } from "~/components/auth/GoogleButton";
import type { OtpIntent } from "~/lib/auth/types";
import type { Route } from "./+types/sign-in";

export const middleware: Route.MiddlewareFunction[] = [supabaseMiddleware];

export function meta() {
  return [
    { title: "Sign In" },
    { name: "description", content: "Sign in to your account" },
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
      if (formData.get("intent") === "reset") {
        if (!authConfig.passwordReset || !email) {
          return data({ error: "Enter a valid email address" }, { status: 400 });
        }
        return resetPasswordForEmail(supabase, email, origin);
      }

      if (!email) {
        return data({ error: "Enter your email address" }, { status: 400 });
      }

      const password = String(formData.get("password") ?? "");
      if (!password) {
        return data({ error: "Enter your password" }, { status: 400 });
      }

      const result = await signInWithPassword(supabase, email, password);
      if (result.error) return result;
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
      // The code step lives at its own URL so a refresh keeps the user where they were.
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

export default function SignIn() {
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

  const footer = (
    <p className="text-center text-sm theme-fc-light">
      Don&apos;t have an account?{" "}
      <Link to="/sign-up" className="text-primary hover:underline">
        Sign up
      </Link>
    </p>
  );

  return (
    <AuthLayout
      title="Sign In"
      description="Sign in to your account"
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
            mode="sign-in"
            error={error}
            emailSent={emailSent}
            canResetPassword={authConfig.passwordReset}
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
            <GoogleButton action="sign-in" isLoading={isLoading} />
          </>
        )}
      </div>
    </AuthLayout>
  );
}
