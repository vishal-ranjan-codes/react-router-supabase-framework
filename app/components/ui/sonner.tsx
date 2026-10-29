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
          "--success-bg": "var(--success)",
          "--success-border": "var(--success)",
          "--success-text": "var(--success-foreground)",
          "--error-bg": "var(--destructive)",
          "--error-border": "var(--destructive)",
          "--error-text": "var(--destructive-foreground)",
          "--warning-bg": "var(--warning)",
          "--warning-border": "var(--warning)",
          "--warning-text": "var(--warning-foreground)",
          "--info-bg": "var(--info)",
          "--info-border": "var(--info)",
          "--info-text": "var(--info-foreground)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
