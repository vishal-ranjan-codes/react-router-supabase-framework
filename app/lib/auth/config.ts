/**
 * Auth Configuration
 *
 * Centralized configuration for authentication methods.
 * Enable/disable methods per project by toggling the boolean flags.
 *
 * Default: Email + Password (primary), Email OTP (secondary)
 */

export type AuthMethod = 'email-password' | 'email-otp' | 'magic-link' | 'google';

export interface AuthConfig {
  methods: {
    emailPassword: boolean;
    emailOtp: boolean;
    magicLink: boolean;
    google: boolean;
  };
  defaultMethod: AuthMethod;
  passwordMinLength: number;
}

export const authConfig: AuthConfig = {
  methods: {
    emailPassword: true,   // Primary: Email + Password
    emailOtp: true,        // Secondary: Email OTP
    magicLink: false,      // Enable for passwordless magic link
    google: false,         // Enable for Google OAuth
  },
  defaultMethod: 'email-password',
  passwordMinLength: 8,
};

/**
 * Ordered list of methods (primary first).
 * Only methods enabled in authConfig.methods are included.
 */
export function getEnabledMethods(): AuthMethod[] {
  const all: AuthMethod[] = ['email-password', 'email-otp', 'magic-link', 'google'];
  return all.filter((m) => authConfig.methods[m === 'email-password' ? 'emailPassword' : m === 'email-otp' ? 'emailOtp' : m === 'magic-link' ? 'magicLink' : 'google']);
}

export function isMethodEnabled(method: AuthMethod): boolean {
  const key = method === 'email-password' ? 'emailPassword' : method === 'email-otp' ? 'emailOtp' : method === 'magic-link' ? 'magicLink' : 'google';
  return authConfig.methods[key];
}

export function getMethodLabel(method: AuthMethod): string {
  const labels: Record<AuthMethod, string> = {
    'email-password': 'Password',
    'email-otp': 'Email OTP',
    'magic-link': 'Magic Link',
    'google': 'Google',
  };
  return labels[method];
}
