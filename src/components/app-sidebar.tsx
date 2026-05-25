"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, } from "@/components/ui/sidebar"
import { sidebarItems } from "@/lib/sidebar-items"
import { AccountSwitcher } from "./account-switcher"
import { Star } from "lucide-react"

export function AppSidebar() {
  const pathname = usePathname() || "/"
  const { data: session } = useSession()

  const isAdmin = session?.user.userRoles.includes(1005)
  const isAuditor = session?.user.userRoles.includes(1001)

  const renderLink = (item: { title: string; url: string; icon: any }) => {
    const isExactMatch = pathname === item.url
    const isSubPath = pathname.startsWith(`${item.url}`)

    const reservedSubPaths = ["/qas/admin", "/qas/new", "/qas/export", "/qas/settings"]
    const isReservedPath = item.url === "/qas" && reservedSubPaths.some(path => pathname.startsWith(path))
    const isActive = (isExactMatch || isSubPath) && !isReservedPath

    const base = "flex items-center gap-3 px-3 py-2 rounded-md transition-colors"
    const active = "bg-background text-primary font-medium"
    const inactive = "text-white"

    return (
      <Link
        href={item.url}
        aria-current={isActive ? "page" : undefined}
        className={`${base} ${isActive ? active : inactive}`}
      >
        <item.icon className="size-4" />
        <span>{item.title}</span>
      </Link>
    )
  }

  return (
    <Sidebar collapsible="offcanvas">

      {/* SIDEBAR HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="#">
                {/* <Star className="size-5!" /> */}
                <span className="text-base font-semibold">QAS Compliance Office</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* SIDEBAR MENU */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.mainMenu
              .filter((item) => {
                if (item.title === "QA Entry") return isAuditor
                return true
              })
              .map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {renderLink(item)}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted">Admin Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.adminMenu.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      {renderLink(item)}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

      </SidebarContent>

      {/* SIDEBAR FOOTER */}
      <SidebarFooter>
        <AccountSwitcher />
      </SidebarFooter>

    </Sidebar>
  )
}