import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import groups from "@/dummy/qas-groups"
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";


export default function GroupsList() {
  return (
    <div className="@container/main flex flex-col">
      <div className="flex flex-row px-6 pt-6 justify-between items-center">
        <Label className="text-md font-semibold text-foreground">Group Management</Label>
        <Link href={`/qas/admin/group`}>
          <Button variant="default" size="sm" className="rounded-2xl">
            <PlusCircle className="fill-white text-primary" />
            Add Group
          </Button>
        </Link>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={groups}
        />
      </div>

    </div>
  )
}