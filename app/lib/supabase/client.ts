import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "~/types/database.types";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Opt-in browser client for client-side Supabase realtime, used only when a site needs the
 * subscription to live in the browser. Auth itself stays server-side (cookie sessions via
 * `supabaseMiddleware`), so a site that never calls this can ignore the `VITE_SUPABASE_*` vars.
 *
 * The publishable key is a public client key by design - do not put `SUPABASE_SECRET_KEY` here.
 */
export function getSupabaseBrowserClient() {
  if (!client) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabasePublishableKey = import.meta.env
      .VITE_SUPABASE_PUBLISHABLE_KEY;

    // Return null if not configured
    if (!supabaseUrl || !supabasePublishableKey) {
      return null;
    }

    client = createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
  }
  return client;
}
