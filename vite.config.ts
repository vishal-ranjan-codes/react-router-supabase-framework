import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  optimizeDeps: {
    include: [
      "class-variance-authority",
      "clsx",
      "cn",
      "embla-carousel-react",
      "input-otp",
      "lucide-react",
      "radix-ui",
      "react-day-picker",
      "react-hook-form",
      "react-resizable-panels",
      "sonner",
      "tailwind-merge",
      "vaul",
    ],
  },
});
