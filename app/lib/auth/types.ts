import type { AuthMethod } from "./config";

export type AuthAction = "sign-in" | "sign-up";

export interface AuthResult {
  success?: boolean;
  error?: string;
  redirectTo?: string;
  otpSent?: boolean;
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
}

export interface MagicLinkFormData {
  email: string;
}

export type { AuthMethod };
