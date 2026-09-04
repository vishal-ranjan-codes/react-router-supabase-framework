import { test, expect } from "@playwright/test";

test.describe("Theme", () => {
  test("defaults to dark theme", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
  });

  test("can toggle theme", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    
    // Click theme toggle
    await page.getByLabel("Toggle theme").click();
    
    // Verify theme changed
    const hasDark = await html.evaluate((el) => el.classList.contains("dark"));
    expect(hasDark).toBe(false);
  });
});
