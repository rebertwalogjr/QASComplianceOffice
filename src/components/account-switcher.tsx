"use client"

import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

import { ChevronsUpDown, LogOut, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, } from '@/components/ui/sidebar'
import { Button } from "./ui/button"

export function AccountSwitcher() {
  const { isMobile } = useSidebar()
  const { data: session, status } = useSession()
  const displayName = status === "loading" 
  ? <div className="h-4 w-24 bg-muted animate-pulse rounded" /> 
  : ( session?.user.name || "Guest")

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {/* <activeTeam.logo className="size-4" /> */}
                <User className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{ displayName }</span>
                {/* <span className="truncate text-xs">{activeTeam.title}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >

            <Button variant="ghost"
              onClick={() => signOut({ callbackUrl: "/signin" })}
              >
              <LogOut className="size-4" />
              Logout
            </Button>

          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
