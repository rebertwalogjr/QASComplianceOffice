"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useIsMobile } from "@/hooks/use-mobile"
import { PlusIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function TemplatePageHeaderContent() {
  const isMobile = useIsMobile()
  const router = useRouter()

  return (
    <div className="flex gap-2 justify-between items-center w-full">
      <Label className="text-md">Email Templates</Label>
      <Button
        type="button"
        variant="outline"
        size={isMobile ? "icon-sm" : "sm"}
        onClick={() => router.push("/qas/admin/templates/create")}
      >
        {isMobile ?
          <PlusIcon /> :
          <><PlusIcon /> Add</>
        }
      </Button>
    </div>
  )
}