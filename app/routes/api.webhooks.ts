import { data } from "react-router";
import type { ActionFunctionArgs } from "react-router";

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return data({ error: "Method Not Allowed" }, { status: 405 });
  }

  try {
    // Verify webhook signature
    const signature = request.headers.get("x-webhook-signature");
    if (!signature) {
      return data({ error: "Missing signature" }, { status: 400 });
    }

    const bodyText = await request.text();

    // Verify signature using Cloudflare env secret
    // const secret = context.cloudflare.env.WEBHOOK_SECRET;
    // const isValid = verifySignature(bodyText, signature, secret);

    const payload = JSON.parse(bodyText);

    // Process webhook based on event type
    switch (payload.type) {
      case "payment.completed":
        // Handle payment
        break;
      case "user.created":
        // Handle new user
        break;
      default:
        console.log("Unhandled webhook type:", payload.type);
    }

    return data({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return data({ error: "Internal error" }, { status: 500 });
  }
}
