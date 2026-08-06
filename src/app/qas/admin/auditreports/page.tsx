import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { LookupsProvider } from "@/context/lookups-context"
import { getAuditReports } from "@/server-actions/audit-report"
import { getActiveCompanies } from "@/server-actions/company"
import { getActiveProjects } from "@/server-actions/project"
import { getActiveAuditEngagements } from "@/server-actions/engagement"
import PageHeader from "@/components/page-header"
import AuditReportPageHeaderContent from "./page-header-content"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default async function AuditReportsPage() {
  const [auditReportsRes, activeCompaniesRes, activeProjectsRes, activeAuditEngagementsRes] = await Promise.all([
    getAuditReports(), getActiveCompanies(), getActiveProjects(), getActiveAuditEngagements()])

  const auditReports = auditReportsRes.data ?? []
  const activeCompanies = activeCompaniesRes.data ?? []
  const activeProjects = activeProjectsRes.data ?? []
  const activeAuditEngagements = activeAuditEngagementsRes.data ?? []

  const error = auditReportsRes.error || activeCompaniesRes.error || activeProjectsRes.error || activeAuditEngagementsRes.error

  return (
    <div className="@container/main flex flex-col">
      <PageHeader>
        <AuditReportPageHeaderContent
          companies={activeCompanies}
          projects={activeProjects}
          auditEngagements={activeAuditEngagements}
        />
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
          <LookupsProvider data={{ auditReports, activeCompanies, activeProjects, activeAuditEngagements }}>
            <DataTable
              columns={columns}
              data={auditReports}
            />
          </LookupsProvider>
        </div>
      )}

    </div>
  )
}