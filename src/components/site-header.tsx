"use client"

import { usePathname } from 'next/navigation'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Button } from './ui/button'

export function SiteHeader() {
  const pathname = usePathname()

  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: { label: string; href: string }[] = []

    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/')
      
      if (segment === 'qas') {
        //breadcrumbs.push({ label: '', href })
      } else if (!isNaN(Number(segment))) {
        // If segment is a number (series ID)
        breadcrumbs.push({ label: segment, href })
      } else {
        breadcrumbs.push({ label: segment.charAt(0).toUpperCase() + segment.slice(1), href })
      }
    })
    
    return breadcrumbs
  } 

  const breadcrumbs = generateBreadcrumbs()
  
  return (
    <header className="fixed w-full bg-background top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
          />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/qas">
                QAS Master List
              </BreadcrumbLink>
            </BreadcrumbItem>

            {/* <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>QAS Master List</BreadcrumbPage>
            </BreadcrumbItem> */}

            {breadcrumbs.map((breadcrumb, index) => (
              <div key={index} className="flex items-center gap-2">
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.href}>
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
            
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}