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
import AuditTrail from "../audit-trail"
import UpdateTrail from "../update-trail"
import ReviewTrail from "../review-trail"
import { notFound } from "next/navigation"

export default async function SeriesViewer(props: { params: Promise<{ seriesno: string }> }) {
  const params = await props.params

  // NOT-FOUND CATCHER
  if(params.seriesno === '404') return notFound()

  return (
    <div className="@container/ pt-2 flex">
      {/* <p>Viewing series number: {params.seriesno}</p> */}

      <div className="flex-2 min-w-0 min-h-0">
        {/* <div className="w-full border-10 border-red-200"> */}
          <SeriesTitle seriesno={params.seriesno} />
        {/* </div> */}
        <div className="">
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
              <AuditTrail />
            </SeriesTabsContent>
            <SeriesTabsContent value="update">
              <UpdateTrail />
            </SeriesTabsContent>
            <SeriesTabsContent value="review">
              <ReviewTrail />
            </SeriesTabsContent>
          </SeriesTabs>
        </div>

      </div>

      {/* COLUMN 2 – no scroll */}
      <div className="hidden shrink lg:flex lg:flex-col lg:flex-1 min-h-0 sticky top-16 overflow-hidden z-20 h-[calc(100vh-64px)]">
          <RightPanel />
      </div>

    </div>
  )
}