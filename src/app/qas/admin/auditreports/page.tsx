import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import CreateDrawer from "./create-drawer";
import { LookupsProvider } from "@/context/lookups-context";
import { getAuditReports } from "@/server-actions/audit-report";
import { getActiveCompanies } from "@/server-actions/company";
import { getActiveProjects } from "@/server-actions/project";
import { getActiveAuditEngagements } from "@/server-actions/engagement";

export default async function AuditReportsPage() {
  const [auditReportsRes, activeCompaniesRes, activeProjectsRes, activeAuditEngagementsRes] = await Promise.all([
    getAuditReports(), getActiveCompanies(), getActiveProjects(), getActiveAuditEngagements()]);

  const auditReports = auditReportsRes.data ?? []
  const activeCompanies = activeCompaniesRes.data ?? []
  const activeProjects = activeProjectsRes.data ?? []
  const activeAuditEngagements = activeAuditEngagementsRes.data ?? []

  return (
    <div className="@container/main flex flex-col">
      <div className="flex flex-row px-6 pt-6 justify-between items-center">
        <Label className="text-md font-semibold text-foreground">Audit Reports</Label>
        <CreateDrawer companies={activeCompanies} projects={activeProjects} auditEngagements={activeAuditEngagements} />
      </div>
      <div>
        <LookupsProvider data={{ auditReports, activeCompanies, activeProjects, activeAuditEngagements }}>
          <DataTable
            columns={columns}
            data={auditReports}
          />
        </LookupsProvider>
      </div>

    </div>
  )
}