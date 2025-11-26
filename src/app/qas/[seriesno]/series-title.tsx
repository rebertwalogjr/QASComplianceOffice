import HideOnScroll from "@/components/hide-on-scroll"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import FormView from "./form-view"
import SeriesNavigationMenu from "./series-navigation-menu"

interface Props {
  seriesno: string
}

export default function SeriesTitle({ seriesno }: Props) {

  return (
    <div id="page-title" className="fixed top-16 w-full bg-background">
      <HideOnScroll>
        <div id="series-title" className="flex items-start justify-center p-8 flex-col h-16">
          <Label className="text-md">Series - #{seriesno}</Label>
          <div className="flex gap-2">
            <Label className="text-sm">Juan Dela Cruz</Label>
            <Label className="text-muted-foreground">(Wed, Nov 2 9:47 AM)</Label>
          </div>
        </div>
      </HideOnScroll>
      {/* <SeriesNavigationMenu /> */}
    </div>
  )
}