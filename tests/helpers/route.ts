import type { SupabaseClient } from "@supabase/supabase-js";
import { type Mock, vi } from "vitest";
import { supabaseContext } from "~/lib/supabase/context";
import type { Database } from "~/types/database.types";

type Supabase = SupabaseClient<Database>;

/**
 * A POST Request shaped the way the browser sends a route form, so actions can be called
 * directly instead of booting a server.
 */
export function formRequest(
  url: string,
  fields: Record<string, string>,
): Request {
  const body = new FormData();
  for (const [name, value] of Object.entries(fields)) body.set(name, value);
  return new Request(url, { method: "POST", body });
}

/** Minimal stand-in for the router context: routes only ever read the Supabase client back out. */
export function contextFor(supabase: unknown) {
  return {
    get: (key: unknown) => (key === supabaseContext ? supabase : null),
    set: () => undefined,
  };
}

export function actionArgs(
  url: string,
  fields: Record<string, string>,
  supabase: unknown = createSupabaseDouble(),
) {
  return {
    request: formRequest(url, fields),
    context: contextFor(supabase),
    params: {},
  };
}

/**
 * Actions return either a Response, `data()`'s carrier, or a plain provider object, and the
 * framework collapses all three. Reading through this keeps the assertions about what the route
 * decided rather than about which wrapper the current React Router release happens to use.
 */
export async function readResult(
  result: unknown,
): Promise<{ status: number; body: Record<string, unknown> }> {
  if (result instanceof Response) {
    return {
      status: result.status,
      body: (await result.json()) as Record<string, unknown>,
    };
  }

  const carrier = result as {
    type?: unknown;
    data?: unknown;
    init?: ResponseInit;
  };
  if (carrier?.type === "DataWithResponseInit") {
    return {
      status: carrier.init?.status ?? 200,
      body: carrier.data as Record<string, unknown>,
    };
  }

  return { status: 200, body: result as Record<string, unknown> };
}

/** `throw redirect(...)` unwinds out of the action as a Response, preserving Set-Cookie writes. */
export async function captureRedirect(
  promise: Promise<unknown>,
): Promise<{ status: number; location: string }> {
  let thrown: unknown = null;
  try {
    await promise;
  } catch (error) {
    thrown = error;
  }

  if (!(thrown instanceof Response)) {
    throw new Error("Expected the action to throw a redirect Response");
  }

  return {
    status: thrown.status,
    location: thrown.headers.get("Location") ?? "",
  };
}

export interface SupabaseDouble {
  auth: {
    getClaims: Mock;
    signInWithPassword: Mock;
    signUp: Mock;
    signInWithOtp: Mock;
    verifyOtp: Mock;
    resetPasswordForEmail: Mock;
    updateUser: Mock;
    signOut: Mock;
    signInWithOAuth: Mock;
  };
}

export function createSupabaseDouble(): SupabaseDouble {
  return {
    auth: {
      getClaims: vi.fn().mockResolvedValue({ data: null, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      signUp: vi.fn().mockResolvedValue({ data: { session: {} }, error: null }),
      signInWithOtp: vi.fn().mockResolvedValue({ error: null }),
      verifyOtp: vi.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
      updateUser: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      signInWithOAuth: vi.fn().mockResolvedValue({
        data: {
          url: "https://supabase.example/auth/v1/authorize?provider=google",
        },
        error: null,
      }),
    },
  };
}

/** The same double, handed over with the `SupabaseClient` type the provider helpers expect. */
export function createAuthClient(): {
  double: SupabaseDouble;
  client: Supabase;
} {
  const double = createSupabaseDouble();
  return { double, client: double as unknown as Supabase };
}
