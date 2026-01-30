import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import CreateDrawer from "./create-drawer";
//import companies from "@/dummy/qas-company";
import { getCompanies } from "@/hooks/actions";

export default async function CompaniesPage() {
  const data = await getCompanies()

  return (
    <div className="@container/main flex flex-col">
      <div className="flex flex-row px-6 pt-6 justify-between items-center">
        <Label className="text-md font-semibold text-foreground">Companies</Label>
        <CreateDrawer />
      </div>
      <div>
        <DataTable
          columns={columns}
          data={data}
        />
      </div>

    </div>
  )
}