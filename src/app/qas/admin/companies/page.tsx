import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getCompanies } from "@/server-actions/company"
import PageHeader from "@/components/page-header"
import CompaniesPageHeaderContent from "./page-header-content"

export default async function CompaniesPage() {
  const { data: companies, error } = await getCompanies()

  return (
    <div className="@container/main flex flex-col">
      <PageHeader>
        <CompaniesPageHeaderContent />
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
            data={companies}
          />
        </div>
      )}

    </div>
  )
}