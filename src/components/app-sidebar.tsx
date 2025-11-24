"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { AccountSwitcher } from "./account-switcher"
import { sidebarItems } from "@/lib/sidebar-items"
import React from "react"
import Link from "next/link"
import { Star } from "lucide-react"
import { usePathname } from "next/navigation"

export function AppSidebar() {
  const pathname = usePathname() || "/"

  const renderLink = (item: { title: string; url: string; icon: any}) => {
    const isActive = pathname === item.url || pathname.startsWith(item.url === "/" ? "/" : `${item.url}/`)

    const base = "flex items-center gap-3 px-3 py-2 rounded-md transition-colors"
    const active = "bg-foreground text-background font-medium"
    const inactive = "hover:bg-muted/50"

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
                <Star className="size-5!" />
                <span className="text-base font-semibold">QAS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* SIDEBAR MENU */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.mainMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {/* <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a> */}
                    {renderLink(item)}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.adminMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {/* <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a> */}
                    {renderLink(item)}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* SIDEBAR FOOTER */}
      <SidebarFooter>
        <AccountSwitcher accounts={sidebarItems.accounts} />
      </SidebarFooter>

    </Sidebar>
  )
}