import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";

interface EmailOtpFormProps {
  error?: string | null;
  otpSent?: boolean;
  email?: string;
  isLoading?: boolean;
}

export function EmailOtpForm({ error, otpSent, email, isLoading }: EmailOtpFormProps) {
  if (otpSent) {
    return (
      <Form method="POST" className="space-y-4">
        <input type="hidden" name="method" value="email-otp" />
        <input type="hidden" name="otpAction" value="verify" />
        <input type="hidden" name="email" value={email} />

        <div className="space-y-2 text-center">
          <Label>Enter the 6-digit code sent to</Label>
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>
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
