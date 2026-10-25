import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    // Server code reads bindings from the workerd builtin; under Vitest it is plain Node.
    alias: {
      "cloudflare:workers": fileURLToPath(
        new URL("./tests/mocks/cloudflare-workers.ts", import.meta.url)
      ),
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["app/**/*.test.{ts,tsx}", "tests/**/*.test.{ts,tsx}"],
    clearMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "app/components/ui/**",
        "**/*.test.{ts,tsx}",
        ".react-router/**",
        "build/",
        "tests/**",
        "playwright.config.ts",
        "vitest.config.ts",
        "vite.config.ts",
        "react-router.config.ts",
      ],
      thresholds: { lines: 60, functions: 60 },
    },
    env: {
      NODE_ENV: "development",
    },
  },
});
