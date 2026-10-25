import { env } from "cloudflare:workers";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/types/database.types";

/**
 * Service-role client for webhook and cron handlers, where there is no end-user session to act
 * on behalf of. It bypasses RLS, so never use it in a handler that trusts client input.
 */
export function createAdminClient() {
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
    throw new Error("Missing Supabase credentials for admin client");
  }

  return createClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
