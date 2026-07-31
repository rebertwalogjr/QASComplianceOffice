"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Brush, KeyRoundIcon, MailIcon, SettingsIcon, User, UserSquareIcon } from "lucide-react"
import PersonalDetailsContainer from "./components/profile"
import ChangePasswordPage from "./components/change-password"
import { Separator } from "@/components/ui/separator"
import ThemeSelector from "@/components/theme-selector"
import { updateUserTheme } from "@/server-actions/theme"
import { UserDetailsPayload } from "@/server-actions/profile"
import { useRouter } from "next/navigation"
import UsernameClientUpdateSection from "./components/username-client"
import EmailClientUpdateSection from "./components/email-client"
import { Badge } from "@/components/ui/badge"

export default function SettingsContainer({ userData }: { userData: UserDetailsPayload | null }) {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<"password" | "profile" | "username" | "email" | null>(null)

  const toggleSection = (section: "password" | "profile" | "username" | "email") => {
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

        {/* Username section */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-6 w-full">
            <UserSquareIcon className="size-6 text-foreground" />
            <div className="flex gap-4 items-center justify-between w-full">
              <div className="flex flex-col gap-2">
                <Label>Username</Label>
                <Label className="text-xs font-normal">{userData?.username}</Label>
              </div>
              <Button
                variant="outline"
                className="p-2 ml-auto"
                onClick={() => toggleSection("username")}
              >
                {activeSection === "username" ? "Cancel" : "Update Username"}
              </Button>
            </div>
          </div>
          {activeSection === "username" && (
            <UsernameClientUpdateSection
              username={userData?.username ?? ""}
              onSuccess={() => setActiveSection(null)}
            />
          )}
        </div>

        <Separator />

        {/* Email section */}
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-6 w-full">
            <MailIcon className="size-6 text-foreground" />
            <div className="flex gap-4 items-center justify-between w-full">
              <div className="flex flex-col gap-2">
                <Label>Email <Badge>In Development</Badge></Label>
                <Label className="text-xs font-normal">{userData?.emailAddress}</Label>
              </div>
              <Button
                variant="outline"
                className="p-2 ml-auto"
                onClick={() => toggleSection("email")}
                disabled
              >
                {activeSection === "email" ? "Cancel" : "Update Email"}
              </Button>
            </div>
          </div>
          {activeSection === "email" && (
            <EmailClientUpdateSection email={userData?.emailAddress ?? ""} />
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
                {activeSection === "profile" ? "Cancel" : "Edit Profile"}
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