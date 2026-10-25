import { afterEach, describe, expect, it } from "vitest";
import { action } from "./sign-in";
import { authConfig } from "~/lib/auth/config";
import {
  actionArgs,
  captureRedirect,
  createSupabaseDouble,
  readResult,
} from "../../tests/helpers/route";

type Args = Parameters<typeof action>[0];

afterEach(() => {
  authConfig.methods.emailPassword = true;
  authConfig.methods.emailOtp = true;
  authConfig.methods.magicLink = false;
  authConfig.methods.google = false;
  authConfig.passwordReset = true;
});

describe("sign-in action", () => {
  it("refuses a method the config disables, without calling the provider", async () => {
    const supabase = createSupabaseDouble();
    const result = await action(
      actionArgs("http://localhost/sign-in", { method: "magic-link", email: "a@b.c" }, supabase) as unknown as Args
    );

    expect(await readResult(result)).toMatchObject({
      status: 400,
      body: { error: "Invalid authentication method" },
    });
    expect(supabase.auth.signInWithOtp).not.toHaveBeenCalled();
  });

  it("accepts the same method once its flag is on", async () => {
    const supabase = createSupabaseDouble();
    authConfig.methods.magicLink = true;

    const result = await action(
      actionArgs("http://localhost/sign-in", { method: "magic-link", email: "a@b.c" }, supabase) as unknown as Args
    );

    expect(await readResult(result)).toMatchObject({
      status: 200,
      body: { success: true, otpSent: true },
    });
    expect(supabase.auth.signInWithOtp).toHaveBeenCalledOnce();
  });

  it("requires Supabase credentials to be configured", async () => {
    const result = await action(
      actionArgs("http://localhost/sign-in", { method: "email-password" }, null) as unknown as Args
    );

    expect((await readResult(result)).status).toBe(503);
  });

  it("validates credentials before contacting Supabase", async () => {
    const supabase = createSupabaseDouble();

    const noEmail = await action(
      actionArgs("http://localhost/sign-in", { method: "email-password", password: "secret" }, supabase) as unknown as Args
    );
    expect(await readResult(noEmail)).toMatchObject({
      status: 400,
      body: { error: "Enter your email address" },
    });

    const noPassword = await action(
      actionArgs("http://localhost/sign-in", { method: "email-password", email: " a@b.c " }, supabase) as unknown as Args
    );
    expect(await readResult(noPassword)).toMatchObject({
      status: 400,
      body: { error: "Enter your password" },
    });
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("trims the email it forwards and redirects on success", async () => {
    const supabase = createSupabaseDouble();

    const redirect = await captureRedirect(
      action(
        actionArgs(
          "http://localhost/sign-in",
          { method: "email-password", email: "  a@b.c  ", password: "secret" },
          supabase
        ) as unknown as Args
      )
    );

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "a@b.c",
      password: "secret",
    });
    expect(redirect).toMatchObject({ status: 302, location: "/dashboard" });
  });

  it("shows the provider error instead of redirecting", async () => {
    const supabase = createSupabaseDouble();
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      error: { message: "Invalid login credentials" },
    });

    const result = await action(
      actionArgs(
        "http://localhost/sign-in",
        { method: "email-password", email: "a@b.c", password: "secret" },
        supabase
      ) as unknown as Args
    );

    expect(await readResult(result)).toMatchObject({ body: { error: "Invalid login credentials" } });
  });

  it("sends a reset link that returns to the new-password step", async () => {
    const supabase = createSupabaseDouble();

    const result = await action(
      actionArgs(
        "http://localhost/sign-in",
        { method: "email-password", intent: "reset", email: "a@b.c" },
        supabase
      ) as unknown as Args
    );

    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith("a@b.c", {
      redirectTo: "http://localhost/auth/callback?next=/auth/reset-password",
    });
    expect(await readResult(result)).toMatchObject({ body: { success: true, otpSent: true } });
  });

  it("hides the reset path when the config turns it off", async () => {
    const supabase = createSupabaseDouble();
    authConfig.passwordReset = false;

    const result = await action(
      actionArgs(
        "http://localhost/sign-in",
        { method: "email-password", intent: "reset", email: "a@b.c" },
        supabase
      ) as unknown as Args
    );

    expect(await readResult(result)).toMatchObject({ status: 400 });
    expect(supabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it("moves the OTP flow to its own URL so a refresh keeps the user there", async () => {
    const supabase = createSupabaseDouble();

    const redirect = await captureRedirect(
      action(
        actionArgs("http://localhost/sign-in", { method: "email-otp", email: "a+b@c.d" }, supabase) as unknown as Args
      )
    );

    expect(redirect.location).toBe("/auth/verify-otp?email=a%2Bb%40c.d");
  });

  it("keeps the user on the code step when the token is wrong", async () => {
    const supabase = createSupabaseDouble();
    supabase.auth.verifyOtp.mockResolvedValueOnce({
      error: { message: "Invalid token" },
    });

    const result = await action(
      actionArgs(
        "http://localhost/sign-in",
        { method: "email-otp", otpAction: "verify", email: "a@b.c", token: "123456" },
        supabase
      ) as unknown as Args
    );

    expect(await readResult(result)).toMatchObject({
      body: { error: "Invalid token", otpStep: "verify" },
    });
  });

  it("redirects to the OAuth consent page for Google", async () => {
    const supabase = createSupabaseDouble();
    authConfig.methods.google = true;

    const redirect = await captureRedirect(
      action(
        actionArgs("http://localhost/sign-in", { method: "google" }, supabase) as unknown as Args
      )
    );

    expect(redirect.location).toContain("provider=google");
  });
});
