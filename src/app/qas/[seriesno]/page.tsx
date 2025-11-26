import StatusBadge from "@/components/status-badge"
import { Label } from "@/components/ui/label"
import { EllipsisVertical, FileText } from "lucide-react"
import FormView from "./form-view"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import RightPanel from "./right-panel"
import { Separator } from "@/components/ui/separator"
import HideOnScroll from "@/components/hide-on-scroll"
import SeriesTitle from "./series-title"
import SeriesNavigationMenu from "./series-navigation-menu"
import { SeriesTabs, SeriesTabsContent, SeriesTabsList, SeriesTabsTrigger } from "@/components/series-tabs"

export default async function SeriesViewer(props: { params: Promise<{ seriesno: string }> }) {
  const params = await props.params

  return (
    <div className="@container/main flex flex-row pt-2">
      {/* <p>Viewing series number: {params.seriesno}</p> */}

      <div className="flex-2 w-[75vw] min-w-0 min-h-0">
        <SeriesTitle seriesno={params.seriesno} />
        <div className="pt-16">
          {/* <div className="sticky top-16"> */}
            {/* <SeriesNavigationMenu /> */}
            <SeriesTabs defaultValue="details">
              <SeriesTabsList>
                <SeriesTabsTrigger value="details">Details</SeriesTabsTrigger>
                <SeriesTabsTrigger value="audit">Audit Trail</SeriesTabsTrigger>
                <SeriesTabsTrigger value="update">Update Trail</SeriesTabsTrigger>
                <SeriesTabsTrigger value="review">Review Trail</SeriesTabsTrigger>
              </SeriesTabsList>
              <SeriesTabsContent value="details">
                <FormView />
              </SeriesTabsContent>
              <SeriesTabsContent value="audit">
                <div>Audit Trail</div>
              </SeriesTabsContent>
              <SeriesTabsContent value="update">
                <div>Update Trail</div>
              </SeriesTabsContent>
              <SeriesTabsContent value="review">
                <div>Review Trail</div>
              </SeriesTabsContent>
            </SeriesTabs>
          {/* </div> */}
        </div>

      </div>

      {/* COLUMN 2 – no scroll */}
      <div className="hidden flex-1 shrink lg:flex lg:flex-col lg:flex-1 min-h-0 overflow-hidden z-20">
        <div className="fixed flex-1 top-16 right-0 w-121 h-[calc(100vh-64px)]">
          <RightPanel />
        </div>
      </div>

    </div>
  )
}