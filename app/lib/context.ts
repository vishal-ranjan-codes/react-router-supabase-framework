import { createContext } from "react-router";

/**
 * The signed-in identity for this request, derived from verified JWT claims rather than a second
 * round trip to the Auth server. Anything richer (profile, role, timestamps) belongs in a query.
 */
export type SessionUser = { id: string; email: string | null };

export const userContext = createContext<SessionUser | null>(null);
