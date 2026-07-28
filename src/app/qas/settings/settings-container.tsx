"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Brush, KeyRoundIcon, User } from "lucide-react"
import PersonalDetailsContainer from "./components/profile"
import ChangePasswordPage from "./components/change-password"
import { Separator } from "@/components/ui/separator"
import ThemeSelector from "@/components/theme-selector"
import { updateUserTheme } from "@/server-actions/theme"
import { UserDetailsPayload } from "@/server-actions/profile"

export default function SettingsContainer({ userData }: { userData: UserDetailsPayload | null }) {
  const [activeSection, setActiveSection] = useState<"password" | "profile" | null>(null)

  const toggleSection = (section: "password" | "profile") => {
    setActiveSection((prev) => (prev === section ? null : section))
  }

  return (
    <div className="flex flex-col gap-6 w-2xl">

      <div className="border rounded-md">

        {/* Change password section */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-6 w-full">
            <KeyRoundIcon className="size-6 text-foreground" />
            <div className="flex gap-4 items-center justify-between w-full">
              <div className="flex flex-col gap-2">
                <Label>Password</Label>
                <Label className="text-xs font-normal">Configured</Label>
              </div>
              <Button
                variant="outline"
                className="p-2 ml-auto"
                onClick={() => toggleSection("password")}
              >
                {activeSection === "password" ? "Cancel" : "Change Password"}
              </Button>
            </div>
          </div>
          {activeSection === "password" && (
            <ChangePasswordPage />
          )}
        </div>

        <Separator />

        {/* Change personal info section */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-6 w-full">
            <User className="size-6 text-foreground" />
            <div className="flex gap-4 items-center justify-between w-full">
              <div className="flex flex-col gap-2">
                <Label>Profile</Label>
                <Label className="text-xs font-normal">Personal Details</Label>
              </div>
              <Button
                variant="outline"
                className="p-2 ml-auto"
                onClick={() => toggleSection("profile")}
              >
                {activeSection === "profile" ? "Cancel" : "Edit"}
              </Button>
            </div>
          </div>
          {activeSection === "profile" && (
            <PersonalDetailsContainer userData={userData} />
          )}
        </div>

        <Separator />

        {/* Appearance section */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-6 w-full">
            <Brush className="size-6 text-foreground" />
            <div className="flex gap-4 items-center justify-between w-full">
              <div className="flex flex-col gap-2">
                <Label>Appearance</Label>
                <Label className="text-xs font-normal">Change theme</Label>
              </div>
              <ThemeSelector
                defaultTheme={userData?.theme}
                onThemeChange={async (newTheme) => {
                  await updateUserTheme(newTheme)
                }}
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}