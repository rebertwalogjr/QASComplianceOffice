"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Brush, Edit2, KeyRoundIcon, LockIcon, MailIcon, SettingsIcon, User, UserSquareIcon, X } from "lucide-react"
import PersonalDetailsContainer from "./components/profile"
import ChangePasswordPage from "./components/change-password"
import { Separator } from "@/components/ui/separator"
import ThemeSelector from "@/components/theme-selector"
import { updateUserTheme } from "@/server-actions/theme"
import { UserDetailsPayload } from "@/server-actions/profile"
import UsernameClientUpdateSection from "./components/username-client"
import EmailClientUpdateSection from "./components/email-client"
import { useIsMobile } from "@/hooks/use-mobile"

export default function SettingsContainer({ userData }: { userData: UserDetailsPayload | null }) {
  const isMobile = useIsMobile()
  const [activeSection, setActiveSection] = useState<"password" | "profile" | "username" | "email" | null>(null)

  const toggleSection = (section: "password" | "profile" | "username" | "email") => {
    setActiveSection((prev) => (prev === section ? null : section))
  }

  return (
    <div className="flex flex-col lg:w-2xl border rounded-2xl">

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
              size={isMobile ? "icon-sm" : "sm"}
            >
              {isMobile ?
                (activeSection === "password" ? <X /> : <Edit2 />) :
                (activeSection === "password" ? "Cancel" : "Change Password")
              }
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
              size={isMobile ? "icon-sm" : "sm"}
            >
              {isMobile ?
                (activeSection === "username" ? <X /> : <Edit2 />) :
                (activeSection === "username" ? "Cancel" : "Update Username")
              }
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
              <div className="flex items-center gap-2">
                <Label>Email </Label>
                <LockIcon size={12} />
              </div>
              <Label className="text-xs font-normal">{userData?.emailAddress}</Label>
            </div>
            <Button
              variant="outline"
              className="p-2 ml-auto"
              onClick={() => toggleSection("email")}
              size={isMobile ? "icon-sm" : "sm"}
            >
              {isMobile ?
                (activeSection === "email" ? <X /> : <Edit2 />) :
                (activeSection === "email" ? "Cancel" : "Update Email")
              }
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
              size={isMobile ? "icon-sm" : "sm"}
            >
              {isMobile ?
                (activeSection === "profile" ? <X /> : <Edit2 />) :
                (activeSection === "profile" ? "Cancel" : "Edit Profile")
              }
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
  )
}