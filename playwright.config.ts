import { defineConfig, devices } from "@playwright/test";

/**
 * The repo supports npm and pnpm, so the e2e runner has to start the dev server with whichever
 * one invoked it. `npm_config_user_agent` is set by both, and CI only ever runs npm.
 */
function devCommand(): string {
  const agent = process.env.npm_config_user_agent ?? "";
  if (agent.startsWith("pnpm")) return "pnpm dev";
  if (agent.startsWith("yarn")) return "yarn dev";
  return "npm run dev";
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  // `open: "never"` keeps CI (and headless runs) from blocking on the report server.
  reporter: [["list"], ["html", { open: "never" }]],
  // Baselines are platform-scoped on purpose: the committed set was rendered on
  // `windows-latest`, and any other platform must fail with "snapshot missing"
  // rather than silently diffing against a different OS's font rasterisation.
  snapshotPathTemplate:
    "{testDir}/__screenshots__/{platform}/{testFilePath}/{arg}{ext}",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  // The visual project is chromium-only, so the functional projects ignore it and
  // never download another engine's baselines.
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /visual\.spec\.ts/,
    },
    // CI only downloads chromium, so asking for the other engines there would fail
    // on a missing browser binary rather than on real behaviour.
    ...(process.env.CI
      ? []
      : [
          {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
            testIgnore: /visual\.spec\.ts/,
          },
          {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
            testIgnore: /visual\.spec\.ts/,
          },
        ]),
    {
      name: "visual",
      use: { ...devices["Desktop Chrome"] },
      testMatch: /visual\.spec\.ts/,
    },
  ],
  webServer: {
    command: devCommand(),
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
