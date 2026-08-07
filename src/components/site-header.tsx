"use client"

import { usePathname } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Label } from './ui/label'
import { sidebarItems } from '@/lib/sidebar-items'
import { useEffect, useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import ThemeQuickChangeButton from './theme-quick-change-button'

export function SiteHeader() {
  const isMobile = useIsMobile()

  const pathname = usePathname()
  const [showHeaderTitle, setShowHeaderTitle] = useState(false)

  const getPagetitle = () => {
    const segments = pathname.split('/').filter(Boolean)

    if (segments[0] === 'qas' && /^\d+$/.test(segments[1])) {
      return `Series #${segments[1]}`
    }

    const allItems = [...sidebarItems.mainMenu, ...sidebarItems.adminMenu]

    const matchedItem = allItems.find(item =>
      pathname === item.url || pathname.startsWith(item.url)
    )

    return matchedItem?.title || "QAS Compliance Office"
  }

  const pageTitle = getPagetitle()

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setShowHeaderTitle(!e.detail.visible)
    }
    window.addEventListener("seriesTitleVisibility", handler as EventListener)
    return () => window.removeEventListener("seriesTitleVisibility", handler as EventListener)
  }, [])


  return (
    <header className="sticky bg-background top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex justify-between pr-4 w-full">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger type='button' className="-ml-1 text-foreground" />
          <Separator
            orientation="vertical"
            className={`mr-2 data-[orientation=vertical]:h-4 transition-opacity ease-in-out duration-300 ${showHeaderTitle ? "opacity-100" : "opacity-0"}`}
          />
          <Label className={`absolute left-16 text-base text-foreground font-semibold transition-all ease-in-out duration-300 ${showHeaderTitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>{pageTitle}</Label>
        </div>
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