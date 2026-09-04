import { S3Client } from "@aws-sdk/client-s3";
import type { Env } from "~/lib/env";

export function createR2Client(env: Env) {
  if (
    !env.CLOUDFLARE_ACCOUNT_ID ||
    !env.R2_ACCESS_KEY_ID ||
    !env.R2_SECRET_ACCESS_KEY
  ) {
    throw new Error("Missing Cloudflare R2 configuration");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  });
}
