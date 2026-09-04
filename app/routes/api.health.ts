import { data } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  return data({
    status: "healthy",
    timestamp: new Date().toISOString(),
    runtime: "cloudflare-workers",
    version: "1.0.0",
  });
}
