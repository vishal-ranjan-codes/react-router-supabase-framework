import { createContext } from "react-router";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/types/database.types";

export const supabaseContext = createContext<SupabaseClient<Database> | null>(
  null
);
