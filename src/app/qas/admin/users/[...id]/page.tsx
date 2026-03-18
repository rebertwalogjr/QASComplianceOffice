import { getActiveCompanies } from "@/server-actions/company"
import UserUpdateForm from "./user-form"
import { getUserById } from "@/server-actions/user"
import { getActiveGroups } from "@/server-actions/group"
import { getActiveProjects } from "@/server-actions/project"
import { getActiveRoles } from "@/server-actions/role"
import { notFound } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default async function UserPage({ params }: { params: Promise<{ id?: string[] }> }) {
  const resolvedParams = await params
  const slug = resolvedParams.id?.[0]
  const userId = Number(slug)

  if (isNaN(userId)) {
    notFound()
  }

  const [companiesRes, userToEditRes, activeGroupRes, activeProjectRes, activeRoleRes] = await Promise.all([
    getActiveCompanies(),
    getUserById(Number(userId)),
    getActiveGroups(),
    getActiveProjects(),
    getActiveRoles()
  ])

  if (!userToEditRes.data) {
    notFound()
  }

  const error = companiesRes.error || userToEditRes.error || activeGroupRes.error || activeGroupRes.error || activeRoleRes.error

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
          <UserUpdateForm
            initialData={userToEditRes.data}
            companies={companiesRes.data}
            groups={activeGroupRes.data}
            projects={activeProjectRes.data}
            roles={activeRoleRes.data}
          />
        </>
      )}
    </div>
  )
}