import { env } from "cloudflare:workers";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { data } from "react-router";
import { createR2Client } from "~/lib/r2/client";
import { createUploadFileName } from "~/lib/r2/keys";
import { requireAuth } from "~/middleware/chains";
import type { Route } from "./+types/api.upload";

export const middleware: Route.MiddlewareFunction[] = requireAuth;

// The platform caps the request body (25 MB free / 100 MB paid), but that protects the
// transport, not the bucket. This is the app's own limit.
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export async function action({ request }: Route.ActionArgs) {
  const r2 = createR2Client(env);

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return data({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return data(
      { error: `File exceeds the ${MAX_UPLOAD_BYTES / 1024 / 1024} MB limit` },
      { status: 413 },
    );
  }

  // The client's file.name is attacker-controlled; the stored name is derived
  // from the mime type alone.
  const fileName = createUploadFileName(file.type);
  if (!fileName) {
    return data(
      { error: `Unsupported file type: ${file.type}` },
      { status: 415 },
    );
  }

  const objectKey = `uploads/${fileName}`;

  try {
    const buffer = await file.arrayBuffer();

    await r2.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: objectKey,
        Body: new Uint8Array(buffer),
        ContentType: file.type,
      }),
    );

    return data({
      success: true,
      key: fileName,
      url: env.R2_PUBLIC_DOMAIN
        ? `https://${env.R2_PUBLIC_DOMAIN}/${objectKey}`
        : null,
    });
  } catch (error) {
    console.error("R2 upload error:", error);
    return data({ error: "Upload failed" }, { status: 500 });
  }
}
