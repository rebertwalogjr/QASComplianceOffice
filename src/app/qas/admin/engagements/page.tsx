import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import CreateDrawer from "./create-drawer";
import { getActiveCompanies, getAuditEngagements, getCompanies } from "@/hooks/actions";
import { LookupsProvider } from "@/context/lookups-context";

export default async function FindingTypePage() {
  const [auditEngagement, companies, activeCompanies] = await Promise.all([getAuditEngagements(), getCompanies(), getActiveCompanies()]);

  return (
    <div className="@container/main flex flex-col">
      <div className="flex flex-row px-6 pt-6 justify-between items-center">
        <Label className="text-md font-semibold text-foreground">Audit Engagements</Label>
        <CreateDrawer companies={activeCompanies} />
      </div>
      <div>
        <LookupsProvider data={{ auditEngagement, companies, activeCompanies }}>
          <DataTable
            columns={columns}
            data={auditEngagement}
          />
        </LookupsProvider>
      </div>

    </div>
  )
}