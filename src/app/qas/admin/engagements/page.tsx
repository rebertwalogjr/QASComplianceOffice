import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import CreateDrawer from "./create-drawer";
import auditEngagement from "@/dummy/d-engagement";

export default function FindingTypePage() {
  return (
    <div className="@container/main flex flex-col">
      <div className="flex flex-row px-6 pt-6 justify-between items-center">
        <Label className="text-md font-semibold text-foreground">Audit Engagements</Label>
        <CreateDrawer />
      </div>
      <div>
        <DataTable
          columns={columns}
          data={auditEngagement}
        />
      </div>

    </div>
  )
}