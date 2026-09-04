import type { Env } from "~/lib/env";

declare module "react-router" {
  interface AppLoadContext {
    cloudflare: {
      env: Env;
    };
  }
}
