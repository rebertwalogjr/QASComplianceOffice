import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import CreateDrawer from "./create-drawer";
import { getGroups, getProjects, getActiveProjects } from "@/hooks/actions";
import { LookupsProvider } from "@/context/lookups-context";

export default async function GroupsPage() {
  const [groups, projects, activeProjects] = await Promise.all([getGroups(), getProjects(), getActiveProjects()]);

  return (
    <div className="@container/main flex flex-col">
      <div className="flex flex-row px-6 pt-6 justify-between items-center">
        <Label className="text-md font-semibold text-foreground">Group Management</Label>
        <CreateDrawer projects={activeProjects} />
      </div>
      <div>
        <LookupsProvider data={{ groups, projects, activeProjects }}>
          <DataTable
            columns={columns}
            data={groups}
          />
        </LookupsProvider>
      </div>

    </div>
  )
}