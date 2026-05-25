import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import CreateDrawer from "./create-drawer";
import { LookupsProvider } from "@/context/lookups-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getGroups } from "@/server-actions/group";
import { getActiveProjects, getProjects } from "@/server-actions/project";

export default async function GroupsPage() {
  const [groupsRes, projectsRes, activeProjectsRes] = await Promise.all([getGroups(), getProjects(), getActiveProjects()]);

  const groups = groupsRes.data ?? []
  const projects = projectsRes.data ?? []
  const activeProjects = activeProjectsRes.data ?? []
  const error = groupsRes.error || projectsRes.error || activeProjectsRes.error

  const sortedProjects = [...activeProjects].sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="@container/main flex flex-col">
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
        <>
          <div className="flex flex-row px-6 pt-6 justify-between items-center">
            <Label className="text-md font-semibold text-foreground">Group Management</Label>
            <CreateDrawer projects={sortedProjects} />
          </div>
          <div>
            <LookupsProvider data={{ groups, projects, activeProjects }}>
              <DataTable
                columns={columns}
                data={groups}
              />
            </LookupsProvider>
          </div>
        </>
      )}

    </div>
  )
}