import { getActiveCompanies } from "@/prisma-actions/company"
import UserForm from "./user-form"
import { getActiveGroups } from "@/prisma-actions/group"
import { getActiveProjects } from "@/prisma-actions/project"
import { getActiveRoles } from "@/prisma-actions/role"

export default async function UserPage() {

  const [companiesRes, activeGroupRes, activeProjectRes, activeRolesRes] = await Promise.all([
    getActiveCompanies(), 
    getActiveGroups(),
    getActiveProjects(),
    getActiveRoles()
  ])

  const error = companiesRes.error || activeGroupRes.error || activeProjectRes.error || activeRolesRes.error

  return (
    <UserForm
      companies={companiesRes.data}
      groups={activeGroupRes.data}
      projects={activeProjectRes.data}
      roles={activeRolesRes.data}
    />
  )
}