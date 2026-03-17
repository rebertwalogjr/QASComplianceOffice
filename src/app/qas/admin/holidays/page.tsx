import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import CreateDrawer from "./create-drawer";
import { getHolidays } from "@/server-actions/holiday";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default async function FindingTypePage() {
  const { data: holidays, error } = await getHolidays()

  return (
    <div className="@container/main flex flex-col">
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
        <>
          <div className="flex flex-row px-6 pt-6 justify-between items-center">
            <Label className="text-md font-semibold text-foreground">Holidays</Label>
            <CreateDrawer />
          </div>
          <div className="m-4">
            <DataTable
              columns={columns}
              data={holidays}
            />
          </div>
        </>
      )}

    </div>
  )
}