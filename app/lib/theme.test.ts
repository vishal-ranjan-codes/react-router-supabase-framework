import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTheme, setTheme, applyTheme } from "./theme";

describe("theme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("returns default theme", () => {
    expect(getTheme()).toBe("system");
  });

  it("sets and gets theme", () => {
    setTheme("dark");
    expect(getTheme()).toBe("dark");
  });

  it("applies dark theme", () => {
    applyTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("applies light theme", () => {
    applyTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
