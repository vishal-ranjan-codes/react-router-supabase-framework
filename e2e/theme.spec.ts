import { expect, test } from "@playwright/test";

// The toggle only flips between "dark" and "light", so the first click from the
// default "system" preference resolves to "dark". These specs pin the colour
// scheme explicitly instead of assuming what CI's browser reports.

test.describe("Theme follows the system preference", () => {
  test.use({ colorScheme: "dark" });

  test("applies the dark class on first load", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator("html")).not.toHaveClass(/light/);
  });

  test("first toggle pins dark and stops following the system", async ({
    page,
  }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Toggle theme" });

    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
      "dark",
    );

    await toggle.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
      "light",
    );
  });
});

test.describe("Theme ignores the system preference once stored", () => {
  test.use({ colorScheme: "dark" });

  test("stored light wins over a dark system preference", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });
});

test.describe("Theme survives a reload", () => {
  // Light scheme, so "no choice stored" and "choice = dark" look different on load.
  test.use({ colorScheme: "light" });

  test("keeps the picked theme after navigating again", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/dark/);

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
