import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getFindingCategories } from "@/server-actions/finding-category"
import PageHeader from "@/components/page-header"
import CategoriesPageHeaderContent from "./page-header-content"

export default async function FindingCategoryage() {
  const { data: categories, error } = await getFindingCategories()
  return (
    <div className="@container/main flex flex-col">
      <PageHeader>
        <CategoriesPageHeaderContent />
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
            data={categories}
          />
        </div>
      )}
    </div>
  )
}