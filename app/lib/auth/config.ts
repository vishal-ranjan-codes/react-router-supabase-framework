/**
 * Auth Configuration
 *
 * Centralized configuration for authentication methods.
 * Enable/disable methods per project by toggling the boolean flags.
 *
 * Default: Email + Password (primary), Email OTP (secondary)
 */

export type AuthMethod =
  | "email-password"
  | "email-otp"
  | "magic-link"
  | "google";

export interface AuthConfig {
  methods: {
    emailPassword: boolean;
    emailOtp: boolean;
    magicLink: boolean;
    google: boolean;
  };
  defaultMethod: AuthMethod;
  passwordMinLength: number;
  /** Offers "Forgot password?" and the /auth/reset-password step for the password method. */
  passwordReset: boolean;
}

export const authConfig: AuthConfig = {
  methods: {
    emailPassword: true, // Primary: Email + Password
    emailOtp: true, // Secondary: Email OTP
    magicLink: false, // Enable for passwordless magic link
    google: false, // Enable for Google OAuth
  },
  defaultMethod: "email-password",
  passwordMinLength: 8,
  passwordReset: true,
};

const METHOD_ORDER: AuthMethod[] = [
  "email-password",
  "email-otp",
  "magic-link",
  "google",
];

const METHOD_FLAGS: Record<AuthMethod, keyof AuthConfig["methods"]> = {
  "email-password": "emailPassword",
  "email-otp": "emailOtp",
  "magic-link": "magicLink",
  google: "google",
};

const METHOD_LABELS: Record<AuthMethod, string> = {
  "email-password": "Password",
  "email-otp": "Email OTP",
  "magic-link": "Magic Link",
  google: "Google",
};

/**
 * Ordered list of methods (primary first).
 * Only methods enabled in authConfig.methods are included.
 */
export function getEnabledMethods(): AuthMethod[] {
  return METHOD_ORDER.filter(isMethodEnabled);
}

/** Enabled methods that render a form panel; OAuth providers render as buttons instead. */
export function getEnabledFormMethods(): AuthMethod[] {
  return getEnabledMethods().filter((method) => method !== "google");
}

export function isMethodEnabled(method: AuthMethod): boolean {
  return authConfig.methods[METHOD_FLAGS[method]];
}

/**
 * The method a form should open on. A disabled `defaultMethod` would otherwise
 * leave the page with a selector that has no matching panel.
 */
export function getDefaultMethod(): AuthMethod {
  const enabled = getEnabledMethods();

  if (enabled.includes(authConfig.defaultMethod))
    return authConfig.defaultMethod;

  return enabled[0] ?? "email-password";
}

export function getMethodLabel(method: AuthMethod): string {
  return METHOD_LABELS[method];
}
