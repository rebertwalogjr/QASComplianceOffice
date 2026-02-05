import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import CreateDrawer from "./create-drawer";
import { getActiveCompanies, getActiveAuditEngagements, getActiveProjects, getAuditReports } from "@/hooks/actions";
import { LookupsProvider } from "@/context/lookups-context";

export default async function AuditReportsPage() {
  const [auditReports, activeCompanies, activeProjects, activeAuditEngagements] = await Promise.all([getAuditReports(), getActiveCompanies(), getActiveProjects(), getActiveAuditEngagements()]);
  return (
    <div className="@container/main flex flex-col">
      <div className="flex flex-row px-6 pt-6 justify-between items-center">
        <Label className="text-md font-semibold text-foreground">Audit Reports</Label>
        <CreateDrawer companies={activeCompanies} projects={activeProjects} auditEngagements={activeAuditEngagements}/>
      </div>
      <div>
        <LookupsProvider data={{auditReports, activeCompanies, activeProjects, activeAuditEngagements}}>
          <DataTable
            columns={columns}
            data={auditReports}
          />
        </LookupsProvider>
      </div>

    </div>
  )
}