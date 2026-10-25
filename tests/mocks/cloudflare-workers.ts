/**
 * Test stand-in for the `cloudflare:workers` builtin, which only exists inside workerd.
 * Vitest aliases `cloudflare:workers` here (see vitest.config.ts). Mutate `env` in a test, then
 * clear it in `afterEach` - every server module under test reads its bindings from this object.
 */
export const env: Record<string, string> = {};
