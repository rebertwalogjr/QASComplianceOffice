import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { LookupsProvider } from "@/context/lookups-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getAuditEngagements } from "@/server-actions/engagement"
import { getActiveCompanies, getCompanies } from "@/server-actions/company"
import PageHeader from "@/components/page-header"
import EngagementsPageHeaderContent from "./page-header-content"

export default async function AuditEngagementPage() {

  const [auditEngagementRes, companiesRes, activeCompaniesRes] = await Promise.all([getAuditEngagements(), getCompanies(), getActiveCompanies()])

  const auditEngagements = auditEngagementRes.data ?? []
  const companies = companiesRes.data ?? []
  const activeCompanies = activeCompaniesRes.data ?? []
  const error = auditEngagementRes.error || companiesRes.error || activeCompaniesRes.error

  return (
    <div className="@container/main flex flex-col">
      <PageHeader>
        <EngagementsPageHeaderContent companies={activeCompanies} />
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
          <LookupsProvider data={{ companies, activeCompanies }}>
            <DataTable
              columns={columns}
              data={auditEngagements}
            />
          </LookupsProvider>
        </div>
      )}
    </div>
  )
}