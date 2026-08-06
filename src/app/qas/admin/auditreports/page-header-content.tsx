import { Label } from "@/components/ui/label"
import CreateDrawer from "./create-drawer"
import { ActiveCompanyPayload } from "@/server-actions/company"
import { ActiveProjectPayload } from "@/server-actions/project"
import { ActiveEngagementPayload } from "@/server-actions/engagement"

interface CreateDrawerProps {
  companies: ActiveCompanyPayload[]
  projects: ActiveProjectPayload[]
  auditEngagements: ActiveEngagementPayload[]
}

export default function AuditReportPageHeaderContent({ companies, projects, auditEngagements }: CreateDrawerProps) {
  return (
    <div className="flex gap-2 justify-between items-center w-full">
      <Label className="text-md">Audit Reports</Label>
      <CreateDrawer companies={companies} projects={projects} auditEngagements={auditEngagements} />
    </div>
  )
}