import { afterEach, describe, expect, it } from "vitest";
import { action } from "./auth.verify-otp";
import { authConfig } from "~/lib/auth/config";
import {
  actionArgs,
  captureRedirect,
  createSupabaseDouble,
  readResult,
} from "../../tests/helpers/route";

type Args = Parameters<typeof action>[0];

const url = "http://localhost/auth/verify-otp";

afterEach(() => {
  authConfig.methods.emailOtp = true;
});

describe("verify-otp action", () => {
  it("closes the page when email OTP is disabled", async () => {
    const supabase = createSupabaseDouble();
    authConfig.methods.emailOtp = false;

    const result = await action(
      actionArgs(url, { email: "a@b.c", token: "123456" }, supabase) as unknown as Args
    );

    expect(await readResult(result)).toMatchObject({
      status: 400,
      body: { error: "Email code sign-in is not available" },
    });
    expect(supabase.auth.verifyOtp).not.toHaveBeenCalled();
  });

  it("requires Supabase credentials to be configured", async () => {
    const result = await action(
      actionArgs(url, { email: "a@b.c" }, null) as unknown as Args
    );

    expect((await readResult(result)).status).toBe(503);
  });

  it("stays on the code step when the email or token is missing", async () => {
    const supabase = createSupabaseDouble();

    const noEmail = await action(
      actionArgs(url, { token: "123456" }, supabase) as unknown as Args
    );
    expect(await readResult(noEmail)).toMatchObject({
      status: 400,
      body: { otpStep: "verify" },
    });

    const noToken = await action(
      actionArgs(url, { email: "a@b.c" }, supabase) as unknown as Args
    );
    expect(await readResult(noToken)).toMatchObject({
      status: 400,
      body: { error: "Enter the 6-digit code", otpStep: "verify" },
    });
  });

  it("verifies the code and signs the user in", async () => {
    const supabase = createSupabaseDouble();

    const redirect = await captureRedirect(
      action(
        actionArgs(url, { email: "a@b.c", token: "123456" }, supabase) as unknown as Args
      )
    );

    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
      email: "a@b.c",
      token: "123456",
      type: "email",
    });
    expect(redirect).toMatchObject({ status: 302, location: "/dashboard" });
  });

  it("resends a code and reports it, without leaving the code step", async () => {
    const supabase = createSupabaseDouble();

    const result = await action(
      actionArgs(url, { otpAction: "resend", email: "a@b.c" }, supabase) as unknown as Args
    );

    expect(await readResult(result)).toMatchObject({
      body: { otpStep: "sent", otpSent: true },
    });
    expect(supabase.auth.signInWithOtp).toHaveBeenCalledOnce();
  });

  it("keeps the code step visible when the resend fails", async () => {
    const supabase = createSupabaseDouble();
    supabase.auth.signInWithOtp.mockResolvedValueOnce({
      error: { message: "Rate limit exceeded" },
    });

    const result = await action(
      actionArgs(url, { otpAction: "resend", email: "a@b.c" }, supabase) as unknown as Args
    );

    expect(await readResult(result)).toMatchObject({
      body: { error: "Rate limit exceeded", otpStep: "verify" },
    });
  });
});
