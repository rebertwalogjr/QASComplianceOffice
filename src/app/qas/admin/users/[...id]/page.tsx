import { getActiveCompanies, getActiveGroups, getActiveProjects, getUserById } from "@/hooks/actions"
import UserForm from "./user-form"

export default async function UserPage({ params } : { params : Promise<{ id?: string[]}>}) {
  const resolvedParams = await params
  const slug = resolvedParams.id?.[0]
  const isCreate = slug === "new"
  const mode = isCreate ? "create" : "edit"
  const userId = isCreate ? null : Number(slug)

  const [companiesRes, userToEditRes, activeGroupRes, activeProjectRes] = await Promise.all([
    getActiveCompanies(), 
    userId ? getUserById(Number(userId)) : Promise.resolve({data: null, error: null}),
    getActiveGroups(),
    getActiveProjects()
  ])

  const error = companiesRes.error || userToEditRes.error || activeGroupRes.error

  return (
    <UserForm
      mode={mode}
      initialData={userToEditRes.data}
      companies={companiesRes.data}
      groups={activeGroupRes.data}
      projects={activeProjectRes.data}
    />
  )
}