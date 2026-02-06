import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import CreateDrawer from "./create-drawer";

export default function RatingsPage() {
  return (
    <div className="@container/main flex flex-col">
      <div className="flex flex-row px-6 pt-6 justify-between items-center">
        <Label className="text-md font-semibold text-foreground">Audit Ratings</Label>
        <CreateDrawer />
      </div>
      <div>
        {/* <DataTable
          columns={columns}
          data={auditRatings}
        /> */}
      </div>

    </div>
  )
}