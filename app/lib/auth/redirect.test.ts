import { describe, expect, it } from "vitest";
import { safeRedirectTarget } from "./redirect";

describe("safeRedirectTarget", () => {
  it("keeps same-origin paths", () => {
    expect(safeRedirectTarget("/dashboard")).toBe("/dashboard");
    expect(safeRedirectTarget("/")).toBe("/");
    expect(safeRedirectTarget("/admin/users?tab=roles")).toBe(
      "/admin/users?tab=roles",
    );
  });

  it("falls back when nothing was supplied", () => {
    expect(safeRedirectTarget(null)).toBe("/dashboard");
    expect(safeRedirectTarget("")).toBe("/dashboard");
  });

  it("falls back for absolute or protocol-relative targets", () => {
    for (const raw of [
      "https://evil.test/steal",
      "http://localhost:5173/x",
      "//evil.test",
      "evil.test/path",
    ]) {
      expect(safeRedirectTarget(raw)).toBe("/dashboard");
    }
  });

  it("falls back for backslash obfuscation", () => {
    expect(safeRedirectTarget("/\\evil.test")).toBe("/dashboard");
    expect(safeRedirectTarget("/a\\b")).toBe("/dashboard");
  });

  it("falls back for header-injection characters", () => {
    expect(safeRedirectTarget("/ok\r\nX-Injected: 1")).toBe("/dashboard");
    expect(safeRedirectTarget("/ok\nX-Injected: 1")).toBe("/dashboard");
  });

  it("honours a custom fallback", () => {
    expect(safeRedirectTarget("//evil.test", "/sign-in")).toBe("/sign-in");
  });
});
