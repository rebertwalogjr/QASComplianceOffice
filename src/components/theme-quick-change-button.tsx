"use client"

import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "./ui/button"
import { updateUserTheme } from "@/server-actions/theme"

export default function ThemeQuickChangeButton() {
  const { theme, setTheme } = useTheme()

  const handleClick = async () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    await updateUserTheme(newTheme)
  }

  return (
    <Button size="icon-sm" variant="outline" onClick={handleClick}>
      {theme === 'light' ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}