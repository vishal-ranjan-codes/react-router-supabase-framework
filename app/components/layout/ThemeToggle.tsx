import { Moon, Sun } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { useEffect, useState, useCallback } from 'react'
import { getTheme, setTheme, type Theme } from '~/lib/theme'

export default function ThemeToggle() {
    const [theme, setThemeState] = useState<Theme>("system")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setThemeState(getTheme())
        setMounted(true)
    }, [])

    const toggleTheme = useCallback(() => {
        const newTheme: Theme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        setThemeState(newTheme)
    }, [theme])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="w-9 h-9">
                <Sun className="h-4 w-4" />
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-9 h-9"
        >
            {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
