/**
 * The server bindings this starter expects.
 *
 * `wrangler types` regenerates `worker-configuration.d.ts` (gitignored) from `wrangler.jsonc`
 * bindings plus every key in `.dev.vars`, and merges it into this same global `Env` - so this
 * file is what keeps `env.SUPABASE_URL` typed on a fresh clone, before anyone has copied
 * `.dev.vars.example`.
 *
 * Types here must stay exactly `string`: a binding re-declared with a wider or optional type
 * makes `interface Env` fail to extend the generated `__BaseEnv_Env`. Optional-in-practice
 * bindings therefore still need a runtime truthiness guard at the call site.
 */
declare global {
  interface Env {
    SUPABASE_URL: string;
    SUPABASE_PUBLISHABLE_KEY: string;
    SUPABASE_SECRET_KEY: string;

    // Cloudflare R2 - required by /api/upload and /api/download
    CLOUDFLARE_ACCOUNT_ID: string;
    R2_ACCESS_KEY_ID: string;
    R2_SECRET_ACCESS_KEY: string;
    R2_BUCKET_NAME: string;
    R2_PUBLIC_DOMAIN: string;

    // HMAC secret for /api/webhooks
    WEBHOOK_SECRET: string;

    // Google OAuth - enable methods.google in app/lib/auth/config.ts
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
  }

  namespace Cloudflare {
    interface Env extends globalThis.Env {}
  }

  /**
   * Browser-side vars, statically inlined by Vite from `.env` at build time. Only `VITE_`-prefixed
   * values reach the bundle, which is why `app/lib/supabase/client.ts` reads these instead of the
   * server `Env` above.
   */
  interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL?: string;
    readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  }
}

export {};
