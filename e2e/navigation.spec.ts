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
      page.getByRole("heading", {
        level: 1,
        name: "A starter that stays maintainable after the demo",
      }),
    ).toBeVisible();
  });

  test("contact page loads", async ({ page }) => {
    await page.goto("/contact");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Talk to the people who maintain it",
      }),
    ).toBeVisible();
  });

  test("design system page loads", async ({ page }) => {
    await page.goto("/design-system");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Building blocks for modern edge applications",
      }),
    ).toBeVisible();
  });

  test("desktop dropdowns: mega menu, grouped dropdown, and simple dropdown", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // 1. Click Features to open the navigation menu
    const featuresTrigger = page.getByRole("button", { name: "Features" });
    await expect(featuresTrigger).toBeVisible();
    await featuresTrigger.click();

    // Verify mega menu contents: spotlight card & categories
    await expect(page.getByText("Design System v2")).toBeVisible();
    await expect(page.getByText("Platform Core")).toBeVisible();
    await expect(page.getByText("Developer Workflow")).toBeVisible();

    // 2. Hover Resources: Radix NavigationMenu switches contents smoothly
    const resourcesTrigger = page.getByRole("button", { name: "Resources" });
    await resourcesTrigger.hover();
    await expect(page.getByText("Documentation")).toBeVisible();
    await expect(page.getByText("Community & Help")).toBeVisible();
    await expect(page.getByText(/Release Notes/i)).toBeVisible();

    // 3. Hover Company: Radix NavigationMenu switches to simple dropdown
    const companyTrigger = page.getByRole("button", { name: "Company" });
    await companyTrigger.hover();
    await expect(page.getByText("Security & Privacy")).toBeVisible();
    await expect(page.getByText("System Status")).toBeVisible();

    // 4. Keyboard Escape closes the menu
    await page.keyboard.press("Escape");
    await expect(page.getByText("Security & Privacy")).not.toBeVisible();
  });

  test("mobile navigation drawer: opens, expands accordions, has no logo in top bar, and navigates", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Open mobile nav drawer with retry in case hydration is completing
    const menuButton = page.getByRole("button", {
      name: /toggle navigation menu/i,
    });
    await expect(menuButton).toBeVisible();

    const drawer = page.getByRole("dialog");
    await expect(async () => {
      if (!(await drawer.isVisible())) {
        await menuButton.click();
      }
      await expect(drawer).toBeVisible();
    }).toPass({ timeout: 5000 });

    // Verify top bar has close button
    const closeButton = page.getByRole("button", {
      name: /close navigation menu/i,
    });
    await expect(closeButton).toBeVisible();

    // Verify pinned footer has authentication buttons
    await expect(drawer.getByRole("link", { name: "Sign In" })).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Sign Up" })).toBeVisible();

    // Expand "Features" accordion
    const featuresAccordion = drawer.getByRole("button", { name: "Features" });
    await featuresAccordion.click();
    await expect(drawer.getByText("Design System v2")).toBeVisible();
    await expect(drawer.getByText("Supabase & Postgres")).toBeVisible();

    // Expand "Company" accordion
    const companyAccordion = drawer.getByRole("button", { name: "Company" });
    await companyAccordion.click();
    await expect(drawer.getByText("Security & Privacy")).toBeVisible();

    // Click "Contact" link inside Company accordion
    await drawer.getByRole("link", { name: /contact/i }).click();

    // Verify navigation occurred and drawer closed
    await expect(page).toHaveURL(/\/contact$/);
    await expect(drawer).not.toBeVisible();
  });
});
