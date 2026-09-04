import { Toaster as Sonner, ToasterProps } from "sonner"
import { getTheme } from "~/lib/theme"
import { useEffect, useState } from "react"

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const current = getTheme()
    if (current === "dark" || current === "system") {
      setTheme(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    } else {
      setTheme(current)
    }

    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="bottom-right"
      style={
        {
          "--normal-bg": "var(--color-layout-foreground)",
          "--normal-border": "var(--color-layout-border)",
          "--normal-text": "var(--color-fc-heading)",
          "--success-bg": "var(--color-primary)",
          "--success-border": "var(--color-primary)",
          "--success-text": "#ffffff",
          "--error-bg": "var(--color-destructive)",
          "--error-border": "var(--color-destructive)",
          "--error-text": "#ffffff",
          "--warning-bg": "#f59e0b",
          "--warning-border": "#f59e0b",
          "--warning-text": "#ffffff",
          "--info-bg": "var(--color-primary)",
          "--info-border": "var(--color-primary)",
          "--info-text": "#ffffff",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
