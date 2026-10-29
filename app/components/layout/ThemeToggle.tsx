import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { getTheme, setTheme, type Theme } from "~/lib/theme";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(getTheme());
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setThemeState(newTheme);
  }, [theme]);

  // SSR and the first client render agree here, so this is not a hydration mismatch -
  // it is the pre-hydration shape. Marking it disabled means a click before React is
  // live is visibly inert instead of silently swallowed (Playwright also waits it out).
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="Toggle theme" disabled>
        <Sun className="size-icon-sm" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="size-icon-sm" />
      ) : (
        <Moon className="size-icon-sm" />
      )}
    </Button>
  );
}
