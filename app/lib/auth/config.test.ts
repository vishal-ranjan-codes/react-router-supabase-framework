import { afterEach, describe, expect, it } from "vitest";
import {
  authConfig,
  getDefaultMethod,
  getEnabledFormMethods,
  getEnabledMethods,
  getMethodLabel,
  isMethodEnabled,
  type AuthConfig,
  type AuthMethod,
} from "./config";

const pristine: AuthConfig = structuredClone(authConfig);

afterEach(() => {
  Object.assign(authConfig, structuredClone(pristine));
});

function enableOnly(method: AuthMethod) {
  for (const flag of Object.keys(authConfig.methods) as (keyof AuthConfig["methods"])[]) {
    authConfig.methods[flag] = false;
  }
  const key = methodKey(method);
  authConfig.methods[key] = true;
}

function methodKey(method: AuthMethod): keyof AuthConfig["methods"] {
  return (
    {
      "email-password": "emailPassword",
      "email-otp": "emailOtp",
      "magic-link": "magicLink",
      google: "google",
    } as Record<AuthMethod, keyof AuthConfig["methods"]>
  )[method];
}

describe("auth config", () => {
  it("ships with password and OTP enabled", () => {
    expect(getEnabledMethods()).toEqual(["email-password", "email-otp"]);
  });

  it("excludes OAuth from the form methods that render a panel", () => {
    authConfig.methods.google = true;
    expect(getEnabledMethods()).toContain("google");
    expect(getEnabledFormMethods()).not.toContain("google");
  });

  it("maps every method to its own flag", () => {
    const methods: AuthMethod[] = [
      "email-password",
      "email-otp",
      "magic-link",
      "google",
    ];

    // Guards the method -> flag lookup table: a wrong entry silently enables the wrong form.
    for (const method of methods) {
      enableOnly(method);
      expect(isMethodEnabled(method)).toBe(true);
      expect(getEnabledMethods()).toEqual([method]);
    }
  });

  it("falls back when the configured default method is disabled", () => {
    authConfig.defaultMethod = "google";
    expect(getDefaultMethod()).toBe("email-password");

    enableOnly("magic-link");
    authConfig.defaultMethod = "email-password";
    expect(getDefaultMethod()).toBe("magic-link");
  });

  it("still names a default when every method is disabled", () => {
    for (const flag of Object.keys(authConfig.methods) as (keyof AuthConfig["methods"])[]) {
      authConfig.methods[flag] = false;
    }
    expect(getEnabledMethods()).toEqual([]);
    expect(getDefaultMethod()).toBe("email-password");
  });

  it("labels every method for the selector", () => {
    const methods: AuthMethod[] = [
      "email-password",
      "email-otp",
      "magic-link",
      "google",
    ];
    for (const method of methods) {
      expect(getMethodLabel(method)).toBeTruthy();
    }
  });
});
