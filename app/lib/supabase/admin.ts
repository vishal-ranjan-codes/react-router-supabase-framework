import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/types/database.types";
import type { Env } from "~/lib/env";

export function createAdminClient(env: Env) {
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
