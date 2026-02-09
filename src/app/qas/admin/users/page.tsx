import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Plus, PlusCircle } from "lucide-react";
import AddUser from "./add-user";
import Link from "next/link";
import { getCompanies, getUsers } from "@/hooks/actions";
import { get } from "http";


export default async function UsersPage() {

  const [usersRes, companyRes] = await Promise.all([getUsers(), getCompanies()])

  const users = usersRes.data ?? []
  const companies = companyRes.data ?? []

  return (
    <div className="@container/main flex flex-col">
      <div className="flex flex-row px-6 pt-6 justify-between items-center">
        <Label className="text-md font-semibold text-foreground">User Management</Label>
        <Link href={`/qas/admin/users/new`}>
          <Button variant="default" size="sm" className="rounded-2xl">
            <PlusCircle className="fill-white text-primary" />
            Add User
          </Button>
        </Link>
        {/* <AddUser /> */}
      </div>
      <div>
        <DataTable
          columns={columns}
          data={users}
        />
      </div>

    </div>
  )
}