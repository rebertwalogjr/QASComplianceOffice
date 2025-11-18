import { cookies } from "next/headers"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import React from "react"

export default async function QasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar/>
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col pt-14">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}