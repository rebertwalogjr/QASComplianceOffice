import HideOnScroll from "@/components/hide-on-scroll"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import FormView from "./form-view"
import SeriesNavigationMenu from "./series-navigation-menu"

interface Props {
  seriesno: string
  creator: string
  createdOn: string
}

export default function SeriesTitle({ seriesno, creator, createdOn }: Props) {

  return (
    <div id="page-title" className="w-full">
      <HideOnScroll>
        <div id="series-title" className="flex items-start justify-center p-4 md:p-8 flex-col h-16">
          <Label className="text-md">Series #{seriesno}</Label>
          <div className="flex gap-2">
            <Label className="text-sm">{creator}</Label>
            <Label className="text-muted-foreground text-xs">— {createdOn}</Label>
          </div>
        </div>
      </HideOnScroll>
      {/* <SeriesNavigationMenu /> */}
    </div>
  )
}