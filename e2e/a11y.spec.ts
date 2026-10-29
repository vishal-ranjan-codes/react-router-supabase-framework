import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Automated accessibility on every route the design system ships, in both themes.
 *
 * This is a floor, not a ceiling: it fails on `serious` and `critical` impacts, which
 * is where axe is reliable (missing names, contrast, heading order, ARIA state) and
 * where a regression is unambiguous. `moderate` and `minor` are reported in the test
 * output but do not fail the run — they need human judgement about intent, and a
 * check that cries wolf gets silenced rather than fixed.
 *
 * Contrast is checked here AND by the 55-pair manifest in
 * `tests/design-tokens.test.ts`. That is deliberate duplication: the manifest proves
 * the token pairs are reachable and correct in the abstract, axe proves no page
 * combined them into a failing foreground/background pair.
 */

const ROUTES = [
  { path: "/", name: "home" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
  { path: "/sign-in", name: "sign-in" },
  { path: "/sign-up", name: "sign-up" },
  { path: "/design-system", name: "design-system" },
];

const THEMES = ["light", "dark"] as const;

const FAILING_IMPACTS = ["serious", "critical"] as const;
const SOFT_IMPACTS = ["moderate", "minor"] as const;

// axe's own result type, reached through the builder rather than imported from `axe-core`:
// the latter is a transitive dependency, and a type-only import of it would resolve under
// npm but not under pnpm's strict `node_modules`.
type Violation = Awaited<
  ReturnType<AxeBuilder["analyze"]>
>["violations"][number];

function summarize(
  results: readonly Violation[],
  impacts: readonly (string | null | undefined)[],
) {
  return results
    .filter((result) => impacts.includes(result.impact))
    .map(
      (result) =>
        `  [${result.impact}] ${result.id} — ${result.description}\n` +
        `    ${result.helpUrl}\n` +
        result.nodes
          .slice(0, 5)
          .map((node) => `    → ${node.target.join(" ")}`)
          .join("\n"),
    )
    .join("\n\n");
}

for (const theme of THEMES) {
  test.describe(`Accessibility — ${theme} theme`, () => {
    // Pin the stored choice rather than emulating a system preference: `system` is a
    // third state, and axe must measure the theme we are claiming to support.
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => {
        localStorage.setItem("theme", value);
      }, theme);
    });

    for (const route of ROUTES) {
      test(`${route.name} has no serious or critical violations`, async ({
        page,
      }) => {
        // `animate-pulse` breathes down to 50% opacity and axe folds element opacity
        // into the contrast it computes, so measuring mid-animation reads a passing
        // pair as a failure. The base layer stops animations under this preference,
        // which is also what a reduced-motion user sees.
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto(route.path, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);

        const results = await new AxeBuilder({ page })
          // The disabled specimen is a deliberately low-contrast pair: WCAG 1.4.3
          // exempts inactive controls, and DESIGN.md §9 rule 5 keeps
          // `--foreground-disabled` out of the contrast manifest for the same reason.
          // It is on the page to be recognised, not read.
          .exclude('[data-state="disabled"]')
          .analyze();

        const blocking = summarize(results.violations, FAILING_IMPACTS);
        expect(
          blocking,
          `${route.path} (${theme}) failed axe:\n${blocking}`,
        ).toBe("");

        const noise = summarize(results.violations, SOFT_IMPACTS);
        if (noise)
          test.info().annotations.push({
            type: "warning",
            description: noise,
          });
      });
    }
  });
}

test("the theme toggle is operable and announces itself", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const toggle = page.getByRole("button", { name: /theme/i });
  await expect(toggle).toBeVisible();

  // Keyboard is the only reliable way to reach a focus-visible ring.
  await toggle.focus();
  await expect(toggle).toBeFocused();
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeTruthy();
});
