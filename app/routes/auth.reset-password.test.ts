import { afterEach, describe, expect, it } from "vitest";
import { authConfig } from "~/lib/auth/config";
import {
  actionArgs,
  createSupabaseDouble,
  readResult,
} from "../../tests/helpers/route";
import { action } from "./auth.reset-password";

type Args = Parameters<typeof action>[0];

const url = "http://localhost/auth/reset-password";
const valid = { password: "longenough", confirmPassword: "longenough" };

afterEach(() => {
  authConfig.passwordReset = true;
  authConfig.passwordMinLength = 8;
});

describe("reset-password action", () => {
  it("requires Supabase credentials to be configured", async () => {
    const result = await action(
      actionArgs(url, valid, null) as unknown as Args,
    );
    expect((await readResult(result)).status).toBe(503);
  });

  it("closes the page when password reset is disabled", async () => {
    const supabase = createSupabaseDouble();
    authConfig.passwordReset = false;

    const result = await action(
      actionArgs(url, valid, supabase) as unknown as Args,
    );

    expect(await readResult(result)).toMatchObject({
      status: 400,
      body: { error: "Password reset is not available" },
    });
    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  it("enforces the configured minimum length", async () => {
    const supabase = createSupabaseDouble();
    authConfig.passwordMinLength = 12;

    const result = await action(
      actionArgs(
        url,
        { password: "short", confirmPassword: "short" },
        supabase,
      ) as unknown as Args,
    );

    expect(await readResult(result)).toMatchObject({
      status: 400,
      body: { error: "Use at least 12 characters" },
    });
  });

  it("requires both fields to match", async () => {
    const supabase = createSupabaseDouble();

    const result = await action(
      actionArgs(
        url,
        { password: "longenough", confirmPassword: "different" },
        supabase,
      ) as unknown as Args,
    );

    expect(await readResult(result)).toMatchObject({
      status: 400,
      body: { error: "Passwords do not match" },
    });
  });

  it("applies the new password to the recovery session", async () => {
    const supabase = createSupabaseDouble();

    const result = await action(
      actionArgs(url, valid, supabase) as unknown as Args,
    );

    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      password: "longenough",
    });
    expect(await readResult(result)).toMatchObject({ body: { success: true } });
  });

  it("surfaces a provider failure", async () => {
    const supabase = createSupabaseDouble();
    supabase.auth.updateUser.mockResolvedValueOnce({
      error: { message: "New password failed to update" },
    });

    const result = await action(
      actionArgs(url, valid, supabase) as unknown as Args,
    );

    expect(await readResult(result)).toMatchObject({
      body: { error: "New password failed to update" },
    });
  });
});
