import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import CreateDrawer from "./create-drawer";
import { getActiveCompanies, getCompanies, getProjects } from "@/hooks/actions";
import { LookupsProvider } from "@/context/lookups-context";

export default async function ProjectsPage() {

  const [projects, companies, activeCompanies] = await Promise.all([getProjects(), getCompanies(), getActiveCompanies()]);

  return (
    <div className="@container/main flex flex-col">
      <div className="flex flex-row px-6 pt-6 justify-between items-center">
        <Label className="text-md font-semibold text-foreground">Projects</Label>
        <CreateDrawer companies={activeCompanies} />
      </div>
      <div>
        <LookupsProvider data={{ companies, projects, activeCompanies }}>
          <DataTable
            columns={columns}
            data={projects}
          />
        </LookupsProvider>
      </div>

    </div>
  )
}