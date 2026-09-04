import { Link, useActionData, useSearchParams, data } from "react-router";
import { supabaseMiddleware } from "~/middleware/supabase";
import { supabaseContext } from "~/lib/supabase/context";
import { verifyEmailOtp, sendEmailOtp } from "~/lib/auth/providers";
import { AuthLayout } from "~/components/auth/AuthLayout";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
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
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const otpAction = formData.get("otpAction") as string;
  const email = formData.get("email") as string;

  if (otpAction === "resend") {
    return sendEmailOtp(supabase, email);
  }

  const token = formData.get("token") as string;
  return verifyEmailOtp(supabase, email, token);
}

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();
  const email = searchParams.get("email") || "";

  const error = actionData && "error" in actionData ? actionData.error : null;
  const success =
    actionData && "success" in actionData ? actionData.success : false;

  const footer = (
    <>
      <p className="text-center text-sm theme-fc-light">
        <Link to="/sign-in" className="text-primary hover:underline">
          &larr; Back to sign in
        </Link>
      </p>
    </>
  );

  return (
    <AuthLayout
      title="Verify Your Email"
      description="Enter the 6-digit code sent to your email"
      footer={footer}
    >
      <div className="space-y-4">
        <form method="POST" className="space-y-4">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="otpAction" value="verify" />

          <div className="space-y-2 text-center">
            <Label>Code sent to</Label>
            <p className="text-sm font-medium theme-fc-heading">{email}</p>
          </div>

          <div className="flex justify-center">
            <InputOTP maxLength={6} name="token">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && <p className="text-sm text-destructive text-center">{error}</p>}
          {success && (
            <p className="text-sm theme-text-success text-center">
              Verified! Redirecting...
            </p>
          )}

          <Button type="submit" className="w-full">
            Verify Code
          </Button>
        </form>

        <form method="POST">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="otpAction" value="resend" />
          <div className="text-center">
            <Button type="submit" variant="ghost" size="sm">
              Didn&apos;t receive a code? Resend
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
