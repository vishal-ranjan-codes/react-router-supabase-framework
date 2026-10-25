import { expect, test } from "@playwright/test";

// Anchored on the page heading rather than loose text: "About", "Contact" and
// "Design System" also appear in the nav and footer, and Playwright's default
// strict mode fails a bare getByText on the first of those duplicates.
test.describe("Navigation", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/React Router/);
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { level: 1, name: /about/i }),
    ).toBeVisible();
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(
      page.getByRole("heading", { level: 1, name: "Get in Touch" }),
    ).toBeVisible();
  });

  test("design system page loads", async ({ page }) => {
    await page.goto("/design-system");
    await expect(
      page.getByRole("heading", { level: 1, name: "Design System" }),
    ).toBeVisible();
  });

  test("client-side navigation between pages", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /about/i }).first().click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /about/i }),
    ).toBeVisible();
  });
});
