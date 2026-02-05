import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import CreateDrawer from "./create-drawer";
import { getFindingTypes } from "@/hooks/actions";

export default async function FindingTypePage() {
  const findingType = await getFindingTypes();
  return (
    <div className="@container/main flex flex-col">
      <div className="flex flex-row px-6 pt-6 justify-between items-center">
        <Label className="text-md font-semibold text-foreground">Finding Type</Label>
        <CreateDrawer />
      </div>
      <div>
        <DataTable
          columns={columns}
          data={findingType}
        />
      </div>

    </div>
  )
}