import { cookies } from "next/headers"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import React, { Suspense } from "react"
import { SidebarWrapper } from "@/components/sidebar-wrapper"
import QASMasterListSiteHeaderContent from "./(main)/page-header-content"

export default async function QasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SidebarWrapper initialOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        {/* <SiteHeader>
          <QASMasterListSiteHeaderContent />
          </SiteHeader> */}
        <div className="flex flex-1 flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarWrapper>
  )
}