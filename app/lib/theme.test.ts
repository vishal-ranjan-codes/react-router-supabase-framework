import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyTheme, getTheme, initTheme, setTheme } from "./theme";

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

  it("initTheme subscribes to the OS and the cleanup unsubscribes", () => {
    const list = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    const matchMedia = vi
      .spyOn(window, "matchMedia")
      .mockReturnValue(list as unknown as MediaQueryList);

    localStorage.setItem("theme", "system");
    const dispose = initTheme();

    expect(list.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );

    dispose();

    expect(list.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );

    matchMedia.mockRestore();
  });
});
