import {
  index,
  layout,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  // Public Routes (Phase 1)
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("contact", "routes/contact.tsx"),
  route("design-system", "routes/design-system.tsx"),

  // Auth Routes (Phase 2)
  route("sign-in", "routes/sign-in.tsx"),
  route("sign-up", "routes/sign-up.tsx"),
  route("sign-out", "routes/sign-out.tsx"),
  route("auth/callback", "routes/auth.callback.ts"),
  route("auth/verify-otp", "routes/auth.verify-otp.tsx"),
  route("auth/reset-password", "routes/auth.reset-password.tsx"),

  // User Dashboard Routes (Phase 3)
  layout("routes/dashboard-layout.tsx", [
    route("dashboard", "routes/dashboard-home.tsx"),
    route("dashboard/settings", "routes/dashboard-settings.tsx"),
  ]),

  // Admin Dashboard Routes (Phase 3)
  layout("routes/admin-layout.tsx", [
    route("admin", "routes/admin-home.tsx"),
    route("admin/users", "routes/admin-users.tsx"),
  ]),

  // API Routes (Phase 4)
  route("api/health", "routes/api.health.ts"),
  route("api/user", "routes/api.user.ts"),
  route("api/upload", "routes/api.upload.ts"),
  route("api/download/:key", "routes/api.download.$key.ts"),
  route("api/webhooks", "routes/api.webhooks.ts"),
] satisfies RouteConfig;
