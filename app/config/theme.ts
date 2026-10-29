import type { ThemePresetId } from "~/lib/theme-presets";

export interface SiteThemeConfig {
  /**
   * Global brand theme preset applied across the entire framework.
   * Options: "tech-blue" | "signal" | "tidal" | "forest" | "terracotta" | "monochrome"
   */
  preset: ThemePresetId;

  /**
   * Whether to enable the chromatic brand accent.
   * - false (Default): Single-Primary brand system (clean SaaS, Stripe/Linear style).
   *   The `--brand-accent` CSS variables automatically alias to `--primary` tokens.
   * - true: Dual-Color 60-30-10 mode. Enables chromatic accent strictly for tiny
   *   punctuations (e.g., an 8px notification dot or small pill badge). Never on buttons.
   */
  enableAccent: boolean;
}

export const siteThemeConfig: SiteThemeConfig = {
  preset: "tech-blue",
  enableAccent: false,
};
