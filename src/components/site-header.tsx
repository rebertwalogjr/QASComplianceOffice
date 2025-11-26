"use client"

import { usePathname } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Button } from './ui/button'
import { Label } from './ui/label'
import { sidebarItems } from '@/lib/sidebar-items'
import { useEffect, useRef, useState } from 'react'

export function SiteHeader() {
  const pathname = usePathname()
  const [showHeaderTitle, setShowHeaderTitle] = useState(false)
  const pageTitleRef = useRef<HTMLDivElement | null>(null)

  const getPagetitle = () => {
    const segments = pathname.split('/').filter(Boolean)

    if (segments[0] === 'qas' && segments[1]) {
      return `Series - #${segments[1]}`
    }

    const allItems = [...sidebarItems.mainMenu, ...sidebarItems.adminMenu]

    const matchedItem = allItems.find(item =>
      pathname === item.url || pathname.startsWith(`{${item.url}}`)
    )

    return matchedItem?.title || "QAS Compliance Office"
  }

  const pageTitle = getPagetitle()

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setShowHeaderTitle(!e.detail.visible);
    }
    window.addEventListener("seriesTitleVisibility", handler as EventListener);
    return () => window.removeEventListener("seriesTitleVisibility", handler as EventListener);
  }, []);


  return (
    <header className="fixed w-full bg-background top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        { (
          <Label className={`absolute left-16 text-base font-semibold transition-all ease-in-out duration-300 ${ showHeaderTitle ? "opacity-100 tranlate-y-0" : "opacity-0 translate-y-4"}`}>{pageTitle}</Label>
        )}
      </div>
    </header>
  )
}