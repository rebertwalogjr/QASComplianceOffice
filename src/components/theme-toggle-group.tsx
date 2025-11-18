"use client"

import { useTheme } from "next-themes"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Sun, Moon, Monitor } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggleGroup() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [value, setValue] = useState("system")

  // Sync selected button with current theme
  useEffect(() => {
    if (theme === "system") {
      setValue("system")
    } else {
      setValue(theme || "system")
    }
  }, [theme])

  const handleChange = (val: string) => {
    setValue(val)
    setTheme(val)
  }

  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={value}
      onValueChange={handleChange}
      className="border rounded-lg p-1 flex items-center bg-muted"
    >
      <ToggleGroupItem
        value="light"
        className="data-[state=on]:border data-[state=on]:border-primary data-[state=on]:bg-background px-3 py-2 rounded-md"
      >
        <Sun className="h-4 w-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="system"
        className="data-[state=on]:border data-[state=on]:border-primary data-[state=on]:bg-background px-3 py-2 rounded-md"
      >
        <Monitor className="h-4 w-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="dark"
        className="data-[state=on]:border data-[state=on]:border-primary data-[state=on]:bg-background px-3 py-2 rounded-md"
      >
        <Moon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}