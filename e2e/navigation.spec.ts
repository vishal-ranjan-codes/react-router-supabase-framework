import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/React Router/);
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText("About")).toBeVisible();
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText("Contact")).toBeVisible();
  });

  test("design system page loads", async ({ page }) => {
    await page.goto("/design-system");
    await expect(page.getByText("Design System")).toBeVisible();
  });
});
