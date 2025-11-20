import { Separator } from "@/components/ui/separator"

export default async function SeriesViewer(props: { params: Promise<{ seriesno: string }> }) {
  const params = await props.params
  
  return (
    <div className="@container/main flex flex-1 bg-muted px-4 py-6">
      {/* <p>Viewing series number: {params.seriesno}</p> */}

      <div className="flex flex-col flex-1 bg-background rounded-md border">
        
        <div className="flex items-center h-14 border-b px-4">
          <h1 className="text-md font-semibold">Series - #{params.seriesno}</h1>
        </div>

        <div className="flex flex-1">
          <div className="flex flex-2 p-4 py-2">
            Details
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-1 bg-muted">
            Activity Trails
          </div>
        </div>

      </div>

    </div>
  )
}