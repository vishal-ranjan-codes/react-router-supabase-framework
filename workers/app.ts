import { createRequestHandler } from "react-router";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build")
);

interface CloudflareEnv {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  [key: string]: unknown;
}

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext) {
    return requestHandler(request);
  },

  // Cloudflare Cron Trigger
  async scheduled(
    controller: ScheduledController,
    env: CloudflareEnv,
    ctx: ExecutionContext
  ) {
    console.log(`[Cron] Triggered: ${controller.cron}`);

    ctx.waitUntil(handleCronJob(controller, env));
  },
} satisfies ExportedHandler<CloudflareEnv>;

async function handleCronJob(
  controller: ScheduledController,
  env: CloudflareEnv
) {
  // Skip if credentials not configured
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log("[Cron] Supabase credentials not configured, skipping");
    return;
  }

  // Dynamic import to avoid issues when Supabase is not configured
  const { createClient } = await import("@supabase/supabase-js");
  
  const supabase = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  try {
    switch (controller.cron) {
      case "0 * * * *": // Every hour
        await processHourlyTasks();
        break;
      case "0 0 * * *": // Daily at midnight
        await processDailyTasks();
        break;
      default:
        console.log(`[Cron] Unhandled cron schedule: ${controller.cron}`);
    }
  } catch (error) {
    console.error("[Cron] Error:", error);
  }
}

async function processHourlyTasks() {
  // Example: Process expired items
  // const { data, error } = await supabase.rpc("zt_process_expired_items");
  // if (error) {
  //   console.error("[Cron] RPC error:", error);
  //   return;
  // }
  // console.log(`[Cron] Processed ${data?.length ?? 0} items`);
  console.log("[Cron] Running hourly tasks...");
}

async function processDailyTasks() {
  // Example: Generate daily reports
  console.log("[Cron] Running daily tasks...");
}
