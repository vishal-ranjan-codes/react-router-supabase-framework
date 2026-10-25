import type { AuthMethod } from "./config";

export type AuthAction = "sign-in" | "sign-up";

/** Which OTP step the page should show after a result: the email box or the code box. */
export type OtpStep = "sent" | "verify";

/** The `otpAction` form field a submitter can send. */
export type OtpIntent = "send" | "verify" | "resend";

export interface AuthResult {
  success?: boolean;
  error?: string;
  /**
   * Destination for a successful sign-in. Routes fall back to their own default,
   * so a flow that knows where the user came from can override it here.
   */
  redirectTo?: string;
  /**
   * An email with a code or link is on its way, so there is no session yet and the
   * action must not redirect past the "check your email" step.
   */
  otpSent?: boolean;
  /** Set by routes alongside `otpSent` to pick the OTP step to render. */
  otpStep?: OtpStep;
  /**
   * Sign-up was accepted, but the Supabase project requires email confirmation, so no session
   * exists yet. The action must not redirect past this.
   */
  requiresConfirmation?: boolean;
  email?: string;
}

export interface PasswordFormData {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface OtpFormData {
  email: string;
  token?: string;
  otpAction?: OtpIntent;
}

export interface MagicLinkFormData {
  email: string;
}

export type { AuthMethod };
