import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getFindingTypes } from "@/server-actions/finding-type"
import PageHeader from "@/components/page-header"
import TypesPageHeaderContent from "./page-header-content"

export default async function FindingTypePage() {
  const { data: findingType, error } = await getFindingTypes()
  return (
    <div className="@container/main flex flex-col">
      <PageHeader>
        <TypesPageHeaderContent />
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
            data={findingType}
          />
        </div>
      )}
    </div>
  )
}