import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "~/types/database.types";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (!client) {
    const supabaseUrl = window.env?.SUPABASE_URL;
    const supabasePublishableKey = window.env?.SUPABASE_PUBLISHABLE_KEY;

    // Return null if not configured
    if (!supabaseUrl || !supabasePublishableKey) {
      return null;
    }

    client = createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
  }
  return client;
}
