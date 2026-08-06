"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"

export default function UserPageHeaderContent() {
  const isMobile = useIsMobile()

  return (
    <div className="flex gap-2 justify-between items-center w-full">
      <Label className="text-md">User Management</Label>
      <Link href={`/qas/admin/users/new`}>
        <Button variant="outline" size={isMobile ? "icon-sm" : "sm"}>
          <PlusCircle />
          {!isMobile ? "Add User" : ""}
        </Button>
      </Link>
    </div>
  )
}