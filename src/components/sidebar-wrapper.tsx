"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import React from "react"

export function SidebarWrapper({ 
  children, 
  initialOpen 
}: { 
  children: React.ReactNode, 
  initialOpen: boolean 
}) {
  return (
    <SidebarProvider defaultOpen={initialOpen}>
      {children}
    </SidebarProvider>
  )
}