import { describe, expect, it } from "vitest";
import {
  captureRedirect,
  createAuthClient,
} from "../../../tests/helpers/route";
import {
  resetPasswordForEmail,
  sendEmailOtp,
  signInWithGoogle,
  signInWithMagicLink,
  signInWithPassword,
  signUpWithPassword,
  updatePassword,
  verifyEmailOtp,
} from "./providers";

const origin = "https://app.example";

describe("auth providers", () => {
  it("reports a password sign-in failure verbatim", async () => {
    const { double, client } = createAuthClient();
    double.auth.signInWithPassword.mockResolvedValueOnce({
      error: { message: "Invalid login credentials" },
    });

    expect(await signInWithPassword(client, "a@b.c", "secret")).toEqual({
      error: "Invalid login credentials",
    });
  });

  it("returns a plain success when Supabase reports no error", async () => {
    const { client } = createAuthClient();
    expect(await signInWithPassword(client, "a@b.c", "secret")).toEqual({
      success: true,
    });
  });

  it("asks for email confirmation when the sign-up response has no session", async () => {
    const { double, client } = createAuthClient();
    double.auth.signUp.mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    expect(await signUpWithPassword(client, "a@b.c", "secret", origin)).toEqual(
      {
        success: true,
        requiresConfirmation: true,
        email: "a@b.c",
      },
    );
    expect(double.auth.signUp).toHaveBeenCalledWith({
      email: "a@b.c",
      password: "secret",
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
  });

  it("requests an OTP that can create the account on first sign-in", async () => {
    const { double, client } = createAuthClient();

    expect(await sendEmailOtp(client, "a@b.c")).toEqual({
      success: true,
      otpSent: true,
      email: "a@b.c",
    });
    expect(double.auth.signInWithOtp).toHaveBeenCalledWith({
      email: "a@b.c",
      options: { shouldCreateUser: true },
    });
  });

  it("verifies a code as an email token", async () => {
    const { double, client } = createAuthClient();

    expect(await verifyEmailOtp(client, "a@b.c", "123456")).toEqual({
      success: true,
    });
    expect(double.auth.verifyOtp).toHaveBeenCalledWith({
      email: "a@b.c",
      token: "123456",
      type: "email",
    });
  });

  it("treats a magic link as an email that is on its way, not a session", async () => {
    const { double, client } = createAuthClient();

    expect(await signInWithMagicLink(client, "a@b.c", origin)).toEqual({
      success: true,
      otpSent: true,
      email: "a@b.c",
    });
    expect(double.auth.signInWithOtp).toHaveBeenCalledWith({
      email: "a@b.c",
      options: { emailRedirectTo: `${origin}/auth/callback` },
    });
  });

  it("lands the reset link on the new-password step", async () => {
    const { double, client } = createAuthClient();

    expect(await resetPasswordForEmail(client, "a@b.c", origin)).toEqual({
      success: true,
      otpSent: true,
      email: "a@b.c",
    });
    expect(double.auth.resetPasswordForEmail).toHaveBeenCalledWith("a@b.c", {
      redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
    });
  });

  it("updates the password of the recovery session", async () => {
    const { double, client } = createAuthClient();

    expect(await updatePassword(client, "newsecret")).toEqual({
      success: true,
    });
    expect(double.auth.updateUser).toHaveBeenCalledWith({
      password: "newsecret",
    });
  });

  it("hands the browser the OAuth consent url", async () => {
    const { double, client } = createAuthClient();

    const redirect = await captureRedirect(signInWithGoogle(client, origin));

    expect(double.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: `${origin}/auth/callback` },
    });
    expect(redirect.location).toContain("provider=google");
  });

  it("bounces an OAuth failure back to sign-in with the reason attached", async () => {
    const { double, client } = createAuthClient();
    double.auth.signInWithOAuth.mockResolvedValueOnce({
      data: null,
      error: { message: "Redirect not allowed" },
    });

    const redirect = await captureRedirect(signInWithGoogle(client, origin));

    expect(redirect.location).toBe("/sign-in?error=Redirect%20not%20allowed");
  });
});
