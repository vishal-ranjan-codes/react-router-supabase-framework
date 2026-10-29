import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { Label } from "~/components/ui/label";

interface EmailOtpFormProps {
  error?: string | null;
  /** Renders the code-entry step instead of the email step. */
  otpSent?: boolean;
  email?: string;
  /** Shown on the code-entry step after a resend. */
  resent?: boolean;
  isLoading?: boolean;
}

export function EmailOtpForm({
  error,
  otpSent,
  email,
  resent,
  isLoading,
}: EmailOtpFormProps) {
  if (otpSent) {
    return (
      <Form method="POST" className="space-y-4">
        <input type="hidden" name="method" value="email-otp" />
        <input type="hidden" name="email" value={email} />

        <div className="space-y-2 text-center">
          <Label>Enter the 6-digit code sent to</Label>
          <p className="text-sm font-medium text-foreground">{email}</p>
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

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
        {resent && (
          <p className="text-sm text-success text-center">
            A new code is on its way.
          </p>
        )}

        {/* Each submitter carries its own otpAction, so one form serves both steps. */}
        <Button
          type="submit"
          name="otpAction"
          value="verify"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="text-center">
          <Button
            type="submit"
            name="otpAction"
            value="resend"
            variant="ghost"
            size="sm"
            disabled={isLoading}
          >
            Didn&apos;t receive a code? Resend
          </Button>
        </div>
      </Form>
    );
  }

  return (
    <Form method="POST" className="space-y-4">
      <input type="hidden" name="method" value="email-otp" />
      <input type="hidden" name="otpAction" value="send" />

      <div className="space-y-2">
        <Label htmlFor="otp-email">Email Address</Label>
        <Input
          id="otp-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending code..." : "Send Code"}
      </Button>
    </Form>
  );
}
