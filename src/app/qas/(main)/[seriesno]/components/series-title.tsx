"use client"

import HideOnScroll from "@/components/hide-on-scroll"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import FormView from "./form-view"
import SeriesNavigationMenu from "./series-navigation-menu"
import { Edit2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tooltip } from "@/components/ui/tooltip"

interface Props {
  seriesno: string
  creator: string
  createdOn: string
  canUpdate: boolean
}

export default function SeriesTitle({ seriesno, creator, createdOn, canUpdate = false }: Props) {
  const router = useRouter()

  const handleUpdate = () => {
    router.push(`/qas/update/${seriesno}`)
  }

  return (
    <div id="page-title" className="w-full">
      <HideOnScroll>
        <div id="series-title" className="flex justify-between p-4 md:p-8 h-16">
          <div className="flex items-start justify-center flex-col">
            <Label className="text-md">Series #{seriesno}</Label>
            <div className="flex gap-2">
              <Label className="text-sm">{creator}</Label>
              <Label className="text-muted-foreground text-xs">— {createdOn}</Label>
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="outline" className="" onClick={handleUpdate} hidden={!canUpdate}>
              <Edit2 className="size-3.5" />Update
            </Button>
          </div>
        </div>
      </HideOnScroll>
      {/* <SeriesNavigationMenu /> */}
    </div>
  )
}