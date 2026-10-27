import { useEffect, useState } from "react";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { getTheme } from "~/lib/theme";

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const current = getTheme();
    if (current === "dark" || current === "system") {
      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      );
    } else {
      setTheme(current);
    }

    const observer = new MutationObserver(() => {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light",
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="bottom-right"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-border": "var(--border)",
          "--normal-text": "var(--foreground)",
          "--success-bg": "var(--primary)",
          "--success-border": "var(--primary)",
          "--success-text": "#ffffff",
          "--error-bg": "var(--destructive)",
          "--error-border": "var(--destructive)",
          "--error-text": "#ffffff",
          "--warning-bg": "#f59e0b",
          "--warning-border": "#f59e0b",
          "--warning-text": "#ffffff",
          "--info-bg": "var(--primary)",
          "--info-border": "var(--primary)",
          "--info-text": "#ffffff",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
