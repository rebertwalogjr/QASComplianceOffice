import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Label } from "@radix-ui/react-label"
// import CreateDrawer from "./create-drawer";
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getTemplates } from "@/server-actions/template"
import PageHeader from "@/components/page-header"
import TemplatePageHeaderContent from "./page-header-content"

export default async function CompaniesPage() {
  const { data: templates, error } = await getTemplates()

  return (
    <div className="@container/main flex flex-col">
      <PageHeader>
        <TemplatePageHeaderContent />
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
        <DataTable
          columns={columns}
          data={templates}
        />
      )}

    </div>
  )
}