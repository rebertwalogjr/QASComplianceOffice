import { Label } from "@/components/ui/label"
import CreateDrawer from "./create-drawer"
import { ActiveProjectPayload } from "@/server-actions/project"

export default function GroupPageHeaderContent({projects}: {projects: ActiveProjectPayload[]}) {
  return (
    <div className="flex gap-2 justify-between items-center w-full">
      <Label className="text-md">Group Management</Label>
      <CreateDrawer projects={projects} />
    </div>
  )
}