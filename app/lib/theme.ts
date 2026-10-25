export type Theme = "light" | "dark" | "system";

const THEME_KEY = "theme";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem(THEME_KEY) as Theme) || "system";
}

export function setTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function applyTheme(theme: Theme): void {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", isDark);
}

/**
 * Applies the stored theme and follows the OS while set to "system".
 * Returns the teardown, so a mount effect can drop the listener on unmount.
 */
export function initTheme(): () => void {
  applyTheme(getTheme());

  const dark = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (getTheme() === "system") applyTheme("system");
  };

  dark.addEventListener("change", onChange);

  return () => dark.removeEventListener("change", onChange);
}
