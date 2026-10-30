import { expect, test } from "@playwright/test";

/**
 * Pixel baselines for the surfaces the design system is judged on.
 *
 * The committed set lives under `e2e/__screenshots__/win32/` and was rendered on
 * `windows-latest`. `snapshotPathTemplate` scopes baselines by platform on purpose:
 * a Linux or macOS run must fail with "snapshot missing" rather than diff against a
 * different OS's font rasterisation and report a phantom regression. Re-baseline with
 * `npx playwright test --project=visual --update-snapshots` and review the PNG diff —
 * the diff is the review artifact, not an incidental output.
 *
 * Theme is pinned through `localStorage`, not `colorScheme`, because that is what the
 * app's blocking script in `app/root.tsx` actually reads; emulating a system
 * preference would leave the third state (`system`) doing something different on every
 * machine.
 */

const SCREENSHOT = {
  animations: "disabled",
  maxDiffPixelRatio: 0.01,
  caret: "hide",
  scale: "css",
} as const;

const THEMES = ["light", "dark"] as const;

const SIZES = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "mobile", width: 390, height: 844 },
];

/**
 * `fullPage` is deliberately sparse. `/design-system` is ~21,000px tall and a baseline
 * that size swells the repo without adding signal the section screenshots do not
 * already carry; `/sign-in` is one form.
 */
const ROUTES = [
  { path: "/", name: "home", fullPage: true },
  { path: "/about", name: "about", fullPage: true },
  { path: "/contact", name: "contact", fullPage: true },
  { path: "/sign-in", name: "sign-in", fullPage: false },
  { path: "/design-system", name: "design-system", fullPage: false },
];

/** Pin the theme before the blocking script runs, so first paint is already correct. */
async function pinTheme(page: import("@playwright/test").Page, theme: string) {
  await page.addInitScript((value) => {
    localStorage.setItem("theme", value);
  }, theme);
}

/** Everything the pages draw after hydration must be settled before the capture. */
async function settle(page: import("@playwright/test").Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
}

for (const size of SIZES) {
  test.describe(`Visual regression — ${size.name} ${size.width}×${size.height}`, () => {
    test.use({ viewport: { width: size.width, height: size.height } });

    for (const theme of THEMES) {
      test.describe(theme, () => {
        for (const route of ROUTES) {
          test(`${route.name} ${theme} ${size.name}`, async ({ page }) => {
            await pinTheme(page, theme);
            await page.goto(route.path, { waitUntil: "networkidle" });
            await settle(page);

            if (route.path === "/design-system") {
              // The contrast table is computed in the browser after mount; a baseline
              // captured before it resolves would bake in an empty column.
              await expect(page.getByText(/\d+\.\d+:1/).first()).toBeVisible();
            }

            await expect(page).toHaveScreenshot(
              `${size.name}-${theme}-${route.name}${route.fullPage ? "-full" : "-fold"}.png`,
              { ...SCREENSHOT, fullPage: route.fullPage },
            );
          });
        }
      });
    }
  });
}

/**
 * Structural invariants that hold regardless of rasterisation — these fail with a
 * readable message instead of a pixel diff, so a regression is attributable.
 */
test.describe("Contract invariants", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  // AGENTS.md rule 3 is a ceiling, not a quota: one full-bleed `brand-deep` band in
  // the page body, plus — only as the page's last section — a closing CTA bookend.
  // `/about` and `/contact` close on `inverse` instead, so they carry a single band.
  // Sonner's toast region is also a <section> (appended to <body>), so only sections
  // painted with a surface tone count as bands.
  const SURFACE_TONES = [
    "bg-background",
    "bg-card",
    "bg-background-subtle",
    "bg-surface-inverse",
    "bg-surface-brand",
  ];
  for (const path of ["/", "/about", "/contact"]) {
    test(`${path} keeps brand bands to one body band plus a closing bookend`, async ({
      page,
    }) => {
      await page.goto(path, { waitUntil: "networkidle" });

      const isBrandBand = await page.evaluate(
        (tones) =>
          [...document.querySelectorAll("section")]
            .filter((section) =>
              tones.some((tone) => section.classList.contains(tone)),
            )
            .map((section) => section.classList.contains("bg-surface-brand")),
        SURFACE_TONES,
      );
      const bands = isBrandBand.filter(Boolean).length;
      expect(bands).toBeLessThanOrEqual(2);
      if (bands === 2) expect(isBrandBand.at(-1)).toBe(true);
    });

    test(`${path} paints no decorative blur blob`, async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });

      // `blur-3xl`/`blur-2xl` are the decorative blobs check:ds rule 7 bans in
      // source; this catches one arriving as an arbitrary value or inline style.
      const blobs = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("*")].filter((element) => {
          const match = /blur\((\d+(?:\.\d+)?)px\)/.exec(
            getComputedStyle(element).filter,
          );
          return match ? Number(match[1]) > 40 : false;
        }),
      );
      expect(blobs).toHaveLength(0);
    });
  }

  test("sections are full-bleed, not inset by a container", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Compared against the layout viewport rather than a literal 1280: a classic
    // scrollbar shrinks it, and the assertion is about edge-to-edge, not pixels.
    const widths = await page.evaluate(() => {
      const viewport = document.documentElement.clientWidth;
      return [...document.querySelectorAll("section")].map(
        (element) => element.getBoundingClientRect().width === viewport,
      );
    });

    expect(widths.length).toBeGreaterThan(0);
    expect(widths.every((full) => full)).toBe(true);
  });

  test("the theme flip changes the page canvas, not just a class", async ({
    page,
  }) => {
    await pinTheme(page, "light");
    await page.goto("/", { waitUntil: "networkidle" });
    const light = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );

    await pinTheme(page, "dark");
    await page.goto("/", { waitUntil: "networkidle" });
    const dark = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor,
    );

    expect(light).not.toBe(dark);
  });

  // The guide is one long page of `#section` links, and a section rename leaves an
  // anchor that scrolls nowhere — invisible to a screenshot, trivial to assert.
  test("every in-page anchor on the style guide resolves", async ({ page }) => {
    await page.goto("/design-system", { waitUntil: "networkidle" });

    const dangling = await page.evaluate(() =>
      [...document.querySelectorAll('a[href^="#"]')]
        .map((link) => link.getAttribute("href")?.slice(1) ?? "")
        .filter((id) => id !== "" && !document.getElementById(id)),
    );
    expect(dangling).toEqual([]);
  });
});
