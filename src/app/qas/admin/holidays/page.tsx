import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { getHolidays } from "@/server-actions/holiday"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import PageHeader from "@/components/page-header"
import HolidayPageHeaderContent from "./page-header-content"

export default async function FindingTypePage() {
  const { data: holidays, error } = await getHolidays()

  return (
    <div className="@container/main flex flex-col">
      <PageHeader>
        <HolidayPageHeaderContent />
      </PageHeader>
      {error ? (
        <div className="mt-6 mx-4">
          <Alert variant="destructive" className="bg-red-50 border-destructive">
            <AlertCircle />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div>
          <DataTable
            columns={columns}
            data={holidays}
          />
        </div>
      )}

    </div>
  )
}