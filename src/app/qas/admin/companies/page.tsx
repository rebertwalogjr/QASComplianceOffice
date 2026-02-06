import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import CreateDrawer from "./create-drawer";
import { getCompanies } from "@/hooks/actions";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function CompaniesPage() {
  const { data: companies, error } = await getCompanies()

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
            <Label className="text-md font-semibold text-foreground">Companies</Label>
            <CreateDrawer />
          </div>
          <div>
            <DataTable
              columns={columns}
              data={companies}
            />
          </div>
        </>
      )}

    </div>
  )
}