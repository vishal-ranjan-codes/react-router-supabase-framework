import { data } from "react-router";

export async function loader() {
  return data({
    status: "healthy",
    timestamp: new Date().toISOString(),
    runtime: "cloudflare-workers",
    version: "1.0.0",
  });
}
