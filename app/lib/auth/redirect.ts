/**
 * Keeps a caller-supplied redirect on this origin. Anything absolute,
 * protocol-relative (`//host`), or backslash-obfuscated (`/\host`) falls back.
 */
export function safeRedirectTarget(
  raw: string | null,
  fallback = "/dashboard",
): string {
  if (!raw) return fallback;
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//") || raw.includes("\\")) return fallback;
  if (/[\r\n\0]/.test(raw)) return fallback;

  return raw;
}
