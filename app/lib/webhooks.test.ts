import { describe, it, expect } from "vitest";
import { verifyWebhookSignature } from "./webhooks";

const SECRET = "whsec_local_test_secret";
const NOW = 1_700_000_000;
const encoder = new TextEncoder();

async function sign(
  body: string,
  timestamp: number,
  secret = SECRET
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${timestamp}.${body}`)
  );
  const hex = [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `t=${timestamp},v1=${hex}`;
}

describe("verifyWebhookSignature", () => {
  it("accepts a signature over the timestamp and raw body", async () => {
    const body = JSON.stringify({ type: "payment.completed" });
    const header = await sign(body, NOW);

    const result = await verifyWebhookSignature({
      body,
      header,
      secret: SECRET,
      nowSeconds: NOW,
    });

    expect(result).toEqual({ valid: true });
  });

  it("accepts an upper-case hex signature", async () => {
    const body = "{}";
    const header = await sign(body, NOW);
    const upperCased = header.replace(
      /v1=(.+)$/,
      (_, hex: string) => `v1=${hex.toUpperCase()}`
    );

    const result = await verifyWebhookSignature({
      body,
      header: upperCased,
      secret: SECRET,
      nowSeconds: NOW,
    });

    expect(result.valid).toBe(true);
  });

  it("rejects a body that changed in transit", async () => {
    const header = await sign('{"type":"user.created"}', NOW);

    const result = await verifyWebhookSignature({
      body: '{"type":"payment.completed"}',
      header,
      secret: SECRET,
      nowSeconds: NOW,
    });

    expect(result.valid).toBe(false);
  });

  it("rejects a signature made with another secret", async () => {
    const body = "{}";
    const header = await sign(body, NOW, "whsec_other");

    const result = await verifyWebhookSignature({
      body,
      header,
      secret: SECRET,
      nowSeconds: NOW,
    });

    expect(result.valid).toBe(false);
  });

  it("rejects a timestamp outside the tolerance window", async () => {
    const body = "{}";
    const header = await sign(body, NOW - 301);

    const result = await verifyWebhookSignature({
      body,
      header,
      secret: SECRET,
      nowSeconds: NOW,
    });

    expect(result).toEqual({
      valid: false,
      reason: "signature timestamp outside tolerance",
    });
  });

  it("rejects a header missing t= or v1=", async () => {
    const result = await verifyWebhookSignature({
      body: "{}",
      header: "v1=abcd",
      secret: SECRET,
      nowSeconds: NOW,
    });

    expect(result).toEqual({
      valid: false,
      reason: "signature header needs t= and v1=",
    });
  });

  it("rejects a non-hex signature without throwing", async () => {
    const result = await verifyWebhookSignature({
      body: "{}",
      header: `t=${NOW},v1=zzzz`,
      secret: SECRET,
      nowSeconds: NOW,
    });

    expect(result).toEqual({
      valid: false,
      reason: "signature is not hex-encoded",
    });
  });

  it("reports a missing header", async () => {
    const result = await verifyWebhookSignature({
      body: "{}",
      header: null,
      secret: SECRET,
      nowSeconds: NOW,
    });

    expect(result).toEqual({ valid: false, reason: "missing signature header" });
  });
});
