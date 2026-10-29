import { useState, useEffect } from "react";
import { Palette, X, RotateCcw, Sun, Moon, Check } from "lucide-react";
import { siteThemeConfig } from "~/config/theme";
import { THEME_PRESETS, type ThemePresetId } from "~/lib/theme-presets";
import { getTheme, setTheme, type Theme } from "~/lib/theme";

export function ThemeDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<ThemePresetId>(
    siteThemeConfig.preset,
  );
  const [accentEnabled, setAccentEnabled] = useState(
    siteThemeConfig.enableAccent,
  );
  const [mode, setMode] = useState<Theme>("system");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedBrand = localStorage.getItem(
      "dev-brand",
    ) as ThemePresetId | null;
    const storedAccent = localStorage.getItem("dev-accent");
    if (storedBrand) {
      setCurrentBrand(storedBrand);
      document.documentElement.setAttribute("data-brand", storedBrand);
    }
    if (storedAccent !== null) {
      const isAcc = storedAccent === "true";
      setAccentEnabled(isAcc);
      document.documentElement.setAttribute("data-accent", storedAccent);
    }
    setMode(getTheme());
  }, []);

  const handleSelectPreset = (id: ThemePresetId) => {
    setCurrentBrand(id);
    localStorage.setItem("dev-brand", id);
    document.documentElement.setAttribute("data-brand", id);
  };

  const handleToggleAccent = (enabled: boolean) => {
    setAccentEnabled(enabled);
    localStorage.setItem("dev-accent", enabled ? "true" : "false");
    document.documentElement.setAttribute(
      "data-accent",
      enabled ? "true" : "false",
    );
  };

  const handleSetMode = (newMode: Theme) => {
    setMode(newMode);
    setTheme(newMode);
  };

  const handleReset = () => {
    localStorage.removeItem("dev-brand");
    localStorage.removeItem("dev-accent");
    setCurrentBrand(siteThemeConfig.preset);
    setAccentEnabled(siteThemeConfig.enableAccent);
    document.documentElement.setAttribute(
      "data-brand",
      siteThemeConfig.preset,
    );
    document.documentElement.setAttribute(
      "data-accent",
      siteThemeConfig.enableAccent ? "true" : "false",
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans print:hidden">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Open Developer Presets Dock"
          className="flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-body-xs font-semibold text-foreground shadow-pop transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Palette className="size-4 text-link" />
          <span>Presets Dock</span>
        </button>
      ) : (
        <div className="w-80 rounded-xl border border-border bg-card p-4 shadow-pop animate-in fade-in zoom-in-95 duration-fast text-foreground">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Palette className="size-4 text-link" />
              <span className="text-body-sm font-bold text-foreground">
                Developer Presets Dock
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 text-foreground-muted hover:text-foreground hover:bg-background-subtle transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Presets List */}
          <div className="space-y-2 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted block">
              Global Brand Preset
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {THEME_PRESETS.map((preset) => {
                const isSelected = currentBrand === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id as ThemePresetId)}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-body-xs font-medium border text-left transition-colors ${
                      isSelected
                        ? "border-primary bg-primary-subtle text-primary font-semibold"
                        : "border-border bg-background-subtle text-foreground-muted hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    <span className="truncate">{preset.name}</span>
                    {isSelected && <Check className="size-3 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accent Toggle */}
          <div className="space-y-2 border-t border-border pt-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-body-xs font-semibold text-foreground block">
                  Chromatic Brand Accent
                </span>
                <span className="text-[11px] text-foreground-muted block leading-tight">
                  {accentEnabled
                    ? "Opt-in 10% punctuation enabled"
                    : "Single-Primary (aliased to primary)"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleAccent(!accentEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  accentEnabled ? "bg-primary" : "bg-neutral-300 dark:bg-neutral-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-fast ${
                    accentEnabled ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Light / Dark Mode Toggle */}
          <div className="space-y-2 border-t border-border pt-3 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground-muted block">
              Color Scheme
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => handleSetMode("light")}
                className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-body-xs font-medium border transition-colors ${
                  mode === "light"
                    ? "border-primary bg-primary-subtle text-primary font-semibold"
                    : "border-border bg-background-subtle text-foreground-muted hover:text-foreground"
                }`}
              >
                <Sun className="size-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetMode("dark")}
                className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-body-xs font-medium border transition-colors ${
                  mode === "dark"
                    ? "border-primary bg-primary-subtle text-primary font-semibold"
                    : "border-border bg-background-subtle text-foreground-muted hover:text-foreground"
                }`}
              >
                <Moon className="size-3.5" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetMode("system")}
                className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-body-xs font-medium border transition-colors ${
                  mode === "system"
                    ? "border-primary bg-primary-subtle text-primary font-semibold"
                    : "border-border bg-background-subtle text-foreground-muted hover:text-foreground"
                }`}
              >
                <span>Auto</span>
              </button>
            </div>
          </div>

          {/* Footer Reset */}
          <div className="border-t border-border pt-3 flex items-center justify-between text-[11px]">
            <span className="text-foreground-muted">Dev Environment</span>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-foreground-muted hover:text-foreground transition-colors"
            >
              <RotateCcw className="size-3" />
              <span>Reset to config</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
