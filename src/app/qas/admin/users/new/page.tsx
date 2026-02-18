import { getActiveCompanies } from "@/prisma-actions/company"
import UserForm from "./user-form"
import { getActiveGroups } from "@/prisma-actions/group"
import { getActiveProjects } from "@/prisma-actions/project"
import { getActiveRoles } from "@/prisma-actions/role"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default async function UserPage() {

  const [companiesRes, activeGroupRes, activeProjectRes, activeRolesRes] = await Promise.all([
    getActiveCompanies(),
    getActiveGroups(),
    getActiveProjects(),
    getActiveRoles()
  ])

  const error = companiesRes.error || activeGroupRes.error || activeProjectRes.error || activeRolesRes.error

  return (
    <div className="@container/main flex flex-col">
      {error ? (
        <div className="mt-6 mx-4" >
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
          <UserForm
            companies={companiesRes.data}
            groups={activeGroupRes.data}
            projects={activeProjectRes.data}
            roles={activeRolesRes.data}
          />
        </>
      )}
    </div>
  )
}