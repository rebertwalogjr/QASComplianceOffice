import { getActiveCompanies, getActiveGroups, getActiveProjects, getActiveRoles, getUserById } from "@/hooks/actions"
import UserForm from "./user-form"

export default async function UserPage({ params } : { params : Promise<{ id?: string[]}>}) {
  const resolvedParams = await params
  const slug = resolvedParams.id?.[0]
  const isCreate = slug === "new"
  const mode = isCreate ? "create" : "edit"
  const userId = isCreate ? null : Number(slug)

  const [companiesRes, activeGroupRes, activeProjectRes, activeRolesRes] = await Promise.all([
    getActiveCompanies(), 
    getActiveGroups(),
    getActiveProjects(),
    getActiveRoles()
  ])

  const error = companiesRes.error || activeGroupRes.error || activeProjectRes.error

  return (
    <UserForm
      mode={mode}
      companies={companiesRes.data}
      groups={activeGroupRes.data}
      projects={activeProjectRes.data}
      roles={activeRolesRes.data}
    />
  )
}