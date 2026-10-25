import { env } from "cloudflare:workers";
import { createRequestHandler } from "react-router";
import { createAdminClient } from "~/lib/supabase/admin";

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  async fetch(request: Request) {
    return requestHandler(request);
  },

  // Cloudflare Cron Trigger
  async scheduled(
    controller: ScheduledController,
    _env: Env,
    ctx: ExecutionContext,
  ) {
    console.log(`[Cron] Triggered: ${controller.cron}`);

    ctx.waitUntil(handleCronJob(controller.cron));
  },
} satisfies ExportedHandler<Env>;

async function handleCronJob(cron: string) {
  // Skip if credentials not configured
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
    console.log("[Cron] Supabase credentials not configured, skipping");
    return;
  }

  const supabase = createAdminClient();

  try {
    switch (cron) {
      case "0 * * * *": // Every hour
        await processHourlyTasks(supabase);
        break;
      case "0 0 * * *": // Daily at midnight
        await processDailyTasks(supabase);
        break;
      default:
        console.log(`[Cron] Unhandled cron schedule: ${cron}`);
    }
  } catch (error) {
    console.error("[Cron] Error:", error);
  }
}

type AdminClient = ReturnType<typeof createAdminClient>;

async function processHourlyTasks(_supabase: AdminClient) {
  // Example: Process expired items
  // const { data, error } = await supabase.rpc("zt_process_expired_items");
  // if (error) {
  //   console.error("[Cron] RPC error:", error);
  //   return;
  // }
  // console.log(`[Cron] Processed ${data?.length ?? 0} items`);
  console.log("[Cron] Running hourly tasks...");
}

async function processDailyTasks(_supabase: AdminClient) {
  // Example: Generate daily reports
  console.log("[Cron] Running daily tasks...");
}
