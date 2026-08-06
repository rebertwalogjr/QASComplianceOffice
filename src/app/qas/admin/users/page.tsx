import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getUsers } from "@/server-actions/user"
import PageHeader from "@/components/page-header"
import UserPageHeaderContent from "./page-header-content"


export default async function UsersPage() {

  const usersRes = await getUsers()
  const users = usersRes.data ?? []
  const error = usersRes.error

  return (
    <div className="@container/main flex flex-col">
      <PageHeader>
        <UserPageHeaderContent />
      </PageHeader>
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
        <div>
          <DataTable
            columns={columns}
            data={users}
          />
        </div>
      )}
    </div>
  )
}