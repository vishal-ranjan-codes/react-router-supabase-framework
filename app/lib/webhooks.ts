const encoder = new TextEncoder();

const MAX_SKEW_SECONDS = 300;

export type WebhookVerification =
  | { valid: true }
  | { valid: false; reason: string };

function fail(reason: string): WebhookVerification {
  return { valid: false, reason };
}

function signatureFromHex(hex: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[0-9a-fA-F]+$/.test(hex) || hex.length % 2 !== 0) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Verifies a `t=<unix-seconds>,v1=<hex>` signature header, where the signed
 * message is `${timestamp}.${rawBody}`.
 */
export async function verifyWebhookSignature(options: {
  body: string;
  header: string | null;
  secret: string;
  nowSeconds?: number;
}): Promise<WebhookVerification> {
  const { body, header, secret } = options;

  if (!header) return fail("missing signature header");

  const fields = new Map<string, string>();
  for (const part of header.split(",")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    const name = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    fields.set(name, value);
  }

  const timestamp = fields.get("t");
  const signature = fields.get("v1");

  if (!timestamp || !signature) return fail("signature header needs t= and v1=");
  if (!/^\d+$/.test(timestamp)) return fail("signature timestamp is not numeric");

  const nowSeconds = options.nowSeconds ?? Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - Number(timestamp)) > MAX_SKEW_SECONDS) {
    return fail("signature timestamp outside tolerance");
  }

  const expected = signatureFromHex(signature);
  if (!expected) return fail("signature is not hex-encoded");

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    expected,
    encoder.encode(`${timestamp}.${body}`)
  );

  return valid ? { valid: true } : fail("signature does not match body");
}
