import { afterEach, describe, expect, it } from "vitest";
import { authConfig } from "~/lib/auth/config";
import {
  actionArgs,
  captureRedirect,
  createSupabaseDouble,
  readResult,
} from "../../tests/helpers/route";
import { action } from "./sign-up";

type Args = Parameters<typeof action>[0];

const url = "http://localhost/sign-up";

afterEach(() => {
  authConfig.methods.google = false;
  authConfig.methods.magicLink = false;
});

describe("sign-up action", () => {
  it("refuses a method the config disables", async () => {
    const supabase = createSupabaseDouble();

    const result = await action(
      actionArgs(url, { method: "google" }, supabase) as unknown as Args,
    );

    expect(await readResult(result)).toMatchObject({ status: 400 });
    expect(supabase.auth.signInWithOAuth).not.toHaveBeenCalled();
  });

  it("requires the two password fields to agree", async () => {
    const supabase = createSupabaseDouble();

    const result = await action(
      actionArgs(
        url,
        {
          method: "email-password",
          email: "a@b.c",
          password: "one",
          confirmPassword: "two",
        },
        supabase,
      ) as unknown as Args,
    );

    expect(await readResult(result)).toMatchObject({
      status: 400,
      body: { error: "Passwords do not match" },
    });
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it("redirects straight in when the project does not confirm emails", async () => {
    const supabase = createSupabaseDouble();

    const redirect = await captureRedirect(
      action(
        actionArgs(
          url,
          {
            method: "email-password",
            email: "a@b.c",
            password: "secret",
            confirmPassword: "secret",
          },
          supabase,
        ) as unknown as Args,
      ),
    );

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: "a@b.c",
      password: "secret",
      options: { emailRedirectTo: "http://localhost/auth/callback" },
    });
    expect(redirect).toMatchObject({ status: 302, location: "/dashboard" });
  });

  it("keeps the user on the form when email confirmation is required", async () => {
    const supabase = createSupabaseDouble();
    supabase.auth.signUp.mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    const result = await action(
      actionArgs(
        url,
        {
          method: "email-password",
          email: "a@b.c",
          password: "secret",
          confirmPassword: "secret",
        },
        supabase,
      ) as unknown as Args,
    );

    expect(await readResult(result)).toMatchObject({
      body: { success: true, requiresConfirmation: true, email: "a@b.c" },
    });
  });

  it("sends the OTP code to its own verification URL", async () => {
    const supabase = createSupabaseDouble();

    const redirect = await captureRedirect(
      action(
        actionArgs(
          url,
          { method: "email-otp", email: "a@b.c" },
          supabase,
        ) as unknown as Args,
      ),
    );

    expect(redirect.location).toBe("/auth/verify-otp?email=a%40b.c");
  });

  it("offers magic link sign-up once the flag is on", async () => {
    const supabase = createSupabaseDouble();
    authConfig.methods.magicLink = true;

    const result = await action(
      actionArgs(
        url,
        { method: "magic-link", email: "a@b.c" },
        supabase,
      ) as unknown as Args,
    );

    expect(await readResult(result)).toMatchObject({ body: { otpSent: true } });
  });
});
