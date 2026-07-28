"use client"

import { useTheme } from "next-themes"
import { useEffect, useState, useRef } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Monitor, Moon, Sun } from "lucide-react"

type ThemeSelectorProps = {
  defaultTheme?: string | null,
  onThemeChange?: (theme: string) => void
}

export default function ThemeSelector({ defaultTheme, onThemeChange }: ThemeSelectorProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isInitialSync = useRef(true)

  useEffect(() => {
    setMounted(true)
    if (isInitialSync.current) {
      if (defaultTheme) {
        setTheme(defaultTheme.toLowerCase())
      }
      isInitialSync.current = false
    }
  }, [defaultTheme, setTheme])

  if (!mounted) {
    return (
      <Select disabled>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Loading theme..." />
        </SelectTrigger>
      </Select>
    )
  }

  const handleValueChange = (newTheme: string) => {
    setTheme(newTheme)
    onThemeChange?.(newTheme)
  }

  return (
    <Select value={theme} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <Sun className="size-4" />
            <span className="font-normal">Light</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center gap-2">
            <Moon className="size-4" />
            <span className="font-normal">Dark</span>
          </div>
        </SelectItem>
        <SelectItem value="system">
          <div className="flex items-center gap-2">
            <Monitor className="size-4" />
            <span className="font-normal">System</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}