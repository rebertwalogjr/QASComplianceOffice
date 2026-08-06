"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import ThemeQuickChangeButton from "./theme-quick-change-button"
import { Separator } from "./ui/separator"
import { SidebarTrigger } from "./ui/sidebar"

export default function PageHeader({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile()

  return (
    <header className="sticky bg-background top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1 text-foreground" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4 transition-opacity ease-in-out duration-300"
        />
        {children}
        {!isMobile && (
          <div className="flex items-center">
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 transition-opacity ease-in-out duration-300"
            />
            <ThemeQuickChangeButton />
          </div>
        )}
      </div>
    </header>
  )
}