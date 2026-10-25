import { data } from "react-router";
import { env } from "cloudflare:workers";
import { verifyWebhookSignature } from "~/lib/webhooks";
import type { Route } from "./+types/api.webhooks";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return data({ error: "Method Not Allowed" }, { status: 405 });
  }

  if (!env.WEBHOOK_SECRET) {
    return data(
      { error: "Webhook verification is not configured" },
      { status: 503 }
    );
  }

  const bodyText = await request.text();

  const verification = await verifyWebhookSignature({
    body: bodyText,
    header: request.headers.get("x-webhook-signature"),
    secret: env.WEBHOOK_SECRET,
  });

  if (!verification.valid) {
    console.warn("Webhook rejected:", verification.reason);
    return data({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: { type?: string } | null;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return data({ error: "Invalid JSON body" }, { status: 400 });
  }

  switch (payload?.type) {
    case "payment.completed":
      // Handle payment
      break;
    case "user.created":
      // Handle new user
      break;
    default:
      console.log("Unhandled webhook type:", payload?.type);
  }

  return data({ received: true });
}
