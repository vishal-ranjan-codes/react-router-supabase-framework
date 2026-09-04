import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "react-router";
import type { Database } from "~/types/database.types";
import type { AuthResult } from "./types";

type Supabase = SupabaseClient<Database>;

export async function signInWithPassword(
  supabase: Supabase,
  email: string,
  password: string
): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { success: true };
}

export async function signUpWithPassword(
  supabase: Supabase,
  email: string,
  password: string,
  origin: string
): Promise<AuthResult> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function sendEmailOtp(
  supabase: Supabase,
  email: string
): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });
  if (error) return { error: error.message };
  return { success: true, otpSent: true, email };
}

export async function verifyEmailOtp(
  supabase: Supabase,
  email: string,
  token: string
): Promise<AuthResult> {
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) return { error: error.message };
  return { success: true };
}

export async function signInWithMagicLink(
  supabase: Supabase,
  email: string,
  origin: string
): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });
  if (error) return { error: error.message };
  return { success: true };
}

/**
 * Initiates Google OAuth sign-in.
 * Returns a redirect Response to the Google consent page.
 * This function never returns a normal result - it always redirects.
 */
export async function signInWithGoogle(
  supabase: Supabase,
  origin: string
): Promise<never> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    throw redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  throw redirect(data.url);
}
