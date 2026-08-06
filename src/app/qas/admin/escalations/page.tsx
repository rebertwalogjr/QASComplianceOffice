import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getEscalations } from "@/server-actions/escalations"
import PageHeader from "@/components/page-header"
import EscalationPageHeaderContent from "./page-header-content"

export default async function EscalationPage() {

  const escalationRes = await getEscalations()

  const users = escalationRes.data ?? []

  const error = escalationRes.error

  return (
    <div className="@container/main flex flex-col">
      <PageHeader>
        <EscalationPageHeaderContent />
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
            data={users}
          />
        </div>
      )}
    </div>
  )
}