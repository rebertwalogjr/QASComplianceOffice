import { getActiveCompanies } from "@/prisma-actions/company"
import UserForm from "./user-form"
import { getUserById } from "@/prisma-actions/user"
import { getActiveGroups } from "@/prisma-actions/group"
import { getActiveProjects } from "@/prisma-actions/project"
import { getActiveRoles } from "@/prisma-actions/role"

export default async function UserPage({ params } : { params : Promise<{ id?: string[]}>}) {
  const resolvedParams = await params
  const slug = resolvedParams.id?.[0]
  const userId = Number(slug)

  const [companiesRes, userToEditRes, activeGroupRes, activeProjectRes, activeRoleRes] = await Promise.all([
    getActiveCompanies(),
    getUserById(Number(userId)),
    getActiveGroups(),
    getActiveProjects(),
    getActiveRoles()
  ])

  const error = companiesRes.error || userToEditRes.error || activeGroupRes.error || activeGroupRes.error || activeRoleRes.error

  return (
    <UserForm
      initialData={userToEditRes.data}
      companies={companiesRes.data}
      groups={activeGroupRes.data}
      projects={activeProjectRes.data}
      roles={activeRoleRes.data}
    />
  )
}