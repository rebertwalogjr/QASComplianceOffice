import StatusBadge from "@/components/status-badge"
import { Label } from "@/components/ui/label"
import { EllipsisVertical, FileText } from "lucide-react"
import FormView from "./form-view"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import RightPanel from "./right-panel"
import { Separator } from "@/components/ui/separator"
import HideOnScroll from "@/components/hide-on-scroll"

export default async function SeriesViewer(props: { params: Promise<{ seriesno: string }> }) {
  const params = await props.params

  return (
    <div className="@container/main flex flex-row pt-2">
      {/* <p>Viewing series number: {params.seriesno}</p> */}

      <div className="flex-2 w-[75vw] min-w-0 min-h-0 overflow-y-auto"> {/* overflow-y-auto */}
        <div id="page-title" className="fixed top-16 border-b w-full bg-background">
          <HideOnScroll>
            <div id="series-title" className="p-4">
              <Label className="text-md">Series - #{params.seriesno}</Label>
            </div>
          </HideOnScroll>
          <div className="flex items-center px-4 h-12">
            <nav className="">
              <Button variant="ghost">Details</Button>
              <Button variant="ghost">Audit Trail</Button>
              <Button variant="ghost">Update Trail</Button>
              <Button variant="ghost">Review Trail</Button>
            </nav>
          </div>
        </div>
        <div className="pt-26">
          <FormView />
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