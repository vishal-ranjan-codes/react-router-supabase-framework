import { data } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { createR2Client } from "~/lib/r2/client";
import { supabaseMiddleware } from "~/middleware/supabase";
import { authMiddleware } from "~/middleware/auth";
import type { Route } from "./+types/api.upload";

export const middleware: Route.MiddlewareFunction[] = [
  supabaseMiddleware,
  authMiddleware,
];

export async function action({ request, context }: ActionFunctionArgs) {
  const env = (context as any).cloudflare?.env;
  if (!env) {
    return data({ error: "Cloudflare environment not available" }, { status: 500 });
  }
  
  const r2 = createR2Client(env);

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return data({ error: "No file provided" }, { status: 400 });
  }

  // Generate unique filename
  const key = `uploads/${Date.now()}-${file.name}`;

  try {
    const buffer = await file.arrayBuffer();

    await r2.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        Body: new Uint8Array(buffer),
        ContentType: file.type,
      })
    );

    return data({
      success: true,
      key,
      url: `https://${env.R2_PUBLIC_DOMAIN}/${key}`,
    });
  } catch (error) {
    console.error("R2 upload error:", error);
    return data({ error: "Upload failed" }, { status: 500 });
  }
}
