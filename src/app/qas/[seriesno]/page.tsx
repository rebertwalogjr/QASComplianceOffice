import StatusBadge from "@/components/status-badge"
import { Label } from "@/components/ui/label"
import { EllipsisVertical, FileText } from "lucide-react"
import FormView from "./form-view"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AuditTrail from "./audit-trail"

export default async function SeriesViewer(props: { params: Promise<{ seriesno: string }> }) {
  const params = await props.params

  return (
    <div className="@container/main flex flex-1 pt-2">
      {/* <p>Viewing series number: {params.seriesno}</p> */}

      <div className="flex flex-col flex-1">

        <div className="sticky top-16 bg-background z-10 border-b">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex gap-2">
              <h1 className="text-md font-semibold">Series - #{params.seriesno}</h1>
              <StatusBadge status="open" />
            </div>
            <div className="hidden lg:flex gap-2">
              <Button size="sm" className="font-normal">Update</Button>
              <Button size="sm" className="font-normal">Submit</Button>
            </div>
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size="icon-sm" variant="ghost">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Submit</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* <div className="flex w-full h-full overflow-hidden bg-muted p-2 md:p-4 gap-4"> */}
        {/* <div className="flex-2 min-h-0 overflow-auto"> */}
        {/* <FormView /> */}
        {/* <AuditTrail /> */}
        {/* </div> */}
        {/* <div className="flex-1 overflow-auto"> */}
        {/* <AuditTrail /> */}
        {/* </div> */}
        {/* </div> */}

        {/* <div className="bg-red-300 text-sidebar-foreground  flex flex-row h-full w-full">
          <div className="flex min-h-0 flex-1 flex-col gap-2 bg-amber-200">
            <div className="flex w-full min-h-0 overflow-y-auto p-2">
              <AuditTrail />
            </div>
            \
          </div>
          <div className="flex h-full flex-1 flex-col gap-2 overflow-auto bg-amber-400">
            hello
          </div>
        </div> */}

        <div className="flex h-[calc(100vh-122px)]">

          {/* COLUMN 1 – scrollable */}
          <div className="flex flex-col flex-2 min-h-0 gap-2 overflow-y-auto">
              <FormView />
          </div>

          {/* COLUMN 2 – no scroll */}
          <div className="hidden lg:flex lg:flex-col lg:flex-1  min-h-0 gap-2 bg-muted ">
            {/* put content here */}
            <div className="p-4">
              hello
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}