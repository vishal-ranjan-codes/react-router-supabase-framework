import { env } from "cloudflare:workers";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { createR2Client } from "~/lib/r2/client";
import { attachmentDisposition, isValidObjectKey } from "~/lib/r2/keys";
import { requireAuth } from "~/middleware/chains";
import type { Route } from "./+types/api.download.$key";

export const middleware: Route.MiddlewareFunction[] = requireAuth;

export async function loader({ params }: Route.LoaderArgs) {
  const { key } = params;

  if (!isValidObjectKey(key)) {
    return new Response("Invalid file key", { status: 400 });
  }

  const r2 = createR2Client(env);

  try {
    const command = new GetObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: `uploads/${key}`,
    });

    const response = await r2.send(command);
    const body = await response.Body!.transformToByteArray();

    return new Response(body as unknown as BodyInit, {
      headers: {
        "Content-Type": response.ContentType ?? "application/octet-stream",
        "Content-Disposition": attachmentDisposition(key),
      },
    });
  } catch (error) {
    console.error("R2 download error:", error);
    return new Response("File not found", { status: 404 });
  }
}
