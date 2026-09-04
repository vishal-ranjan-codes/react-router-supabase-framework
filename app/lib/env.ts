export interface Env {
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE_KEY: string;
  SUPABASE_SECRET_KEY: string;

  // Cloudflare R2 (Phase 4)
  CLOUDFLARE_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET_NAME?: string;
  R2_PUBLIC_DOMAIN?: string;

  // Webhook secret (Phase 4)
  WEBHOOK_SECRET?: string;
}
