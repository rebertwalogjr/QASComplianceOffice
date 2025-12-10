import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import CreateDrawer from "./create-drawer";
import findingCategories from "@/dummy/qas-findingcategory";

export default function FindingCategoryage() {
  return (
    <div className="@container/main flex flex-col">
      <div className="flex flex-row px-6 pt-6 justify-between items-center">
        <Label className="text-md font-semibold text-foreground">Finding Category</Label>
        <CreateDrawer />
      </div>
      <div>
        <DataTable
          columns={columns}
          data={findingCategories}
        />
      </div>

    </div>
  )
}