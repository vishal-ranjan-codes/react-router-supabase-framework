import {
  data,
  Link,
  redirect,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { AuthLayout } from "~/components/auth/AuthLayout";
import { EmailOtpForm } from "~/components/auth/EmailOtpForm";
import { isMethodEnabled } from "~/lib/auth/config";
import { sendEmailOtp, verifyEmailOtp } from "~/lib/auth/providers";
import type { OtpIntent } from "~/lib/auth/types";
import { supabaseContext } from "~/lib/supabase/context";
import { supabaseMiddleware } from "~/middleware/supabase";
import type { Route } from "./+types/auth.verify-otp";

export const middleware: Route.MiddlewareFunction[] = [supabaseMiddleware];

export function meta() {
  return [
    { title: "Verify OTP" },
    { name: "description", content: "Verify your email code" },
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
      { status: 503 },
    );
  }

  if (!isMethodEnabled("email-otp")) {
    return data(
      { error: "Email code sign-in is not available" },
      { status: 400 },
    );
  }

  const formData = await request.formData();
  const intent = (formData.get("otpAction") ?? "verify") as OtpIntent;
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return data(
      { error: "Enter your email address", otpStep: "verify" },
      { status: 400 },
    );
  }

  if (intent === "verify") {
    const token = String(formData.get("token") ?? "");
    if (!token) {
      return data(
        { error: "Enter the 6-digit code", otpStep: "verify" },
        { status: 400 },
      );
    }

    const result = await verifyEmailOtp(supabase, email, token);
    if (result.error) return { ...result, otpStep: "verify" as const };
    throw redirect(result.redirectTo ?? "/dashboard");
  }

  const result = await sendEmailOtp(supabase, email);
  if (result.error) return { ...result, otpStep: "verify" as const };
  return { ...result, otpStep: "sent" as const };
}

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const email = searchParams.get("email") || "";
  const error = actionData && "error" in actionData ? actionData.error : null;
  const sentEmail =
    actionData && "email" in actionData ? actionData.email : undefined;
  const resent =
    actionData && "otpStep" in actionData
      ? actionData.otpStep === "sent"
      : false;

  const footer = (
    <p className="text-center text-sm text-muted-foreground">
      <Link to="/sign-in" className="text-link hover:underline">
        &larr; Back to sign in
      </Link>
    </p>
  );

  return (
    <AuthLayout
      title="Verify Your Email"
      description="Enter the 6-digit code sent to your email"
      footer={footer}
    >
      <EmailOtpForm
        error={error}
        otpSent
        email={email || sentEmail}
        resent={resent}
        isLoading={navigation.state === "submitting"}
      />
    </AuthLayout>
  );
}
