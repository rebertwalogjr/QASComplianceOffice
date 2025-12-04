import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import users from "@/dummy/qas-users"


export default function UserManagement() {
  return (
    <div className="@container/main flex flex-col">
      <DataTable
        columns={columns}
        data={users}
      />

    </div>
  )
}