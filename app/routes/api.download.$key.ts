import type { LoaderFunctionArgs } from "react-router";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { createR2Client } from "~/lib/r2/client";
import { supabaseMiddleware } from "~/middleware/supabase";
import { authMiddleware } from "~/middleware/auth";
import type { Route } from "./+types/api.download.$key";

export const middleware: Route.MiddlewareFunction[] = [
  supabaseMiddleware,
  authMiddleware,
];

export async function loader({ params, context }: LoaderFunctionArgs) {
  const env = (context as any).cloudflare?.env;
  if (!env) {
    return new Response("Cloudflare environment not available", { status: 500 });
  }
  
  const r2 = createR2Client(env);
  const { key } = params;

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
        "Content-Disposition": `attachment; filename="${key}"`,
      },
    });
  } catch (error) {
    console.error("R2 download error:", error);
    return new Response("File not found", { status: 404 });
  }
}
