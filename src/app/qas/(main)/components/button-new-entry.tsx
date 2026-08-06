"use client"

import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function NewEntryButton() {
  const isMobile = useIsMobile()

  return (
    <Link href={`/qas/new`}>
      <Button variant="outline" size={isMobile ? "icon-sm" : "sm"} className="">
        <PlusCircle/>
        {!isMobile ? "New Entry" : ""}
      </Button>
    </Link>
  )
}