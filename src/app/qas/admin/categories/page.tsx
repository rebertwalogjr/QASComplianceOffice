import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Label } from "@radix-ui/react-label";
import CreateDrawer from "./create-drawer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getFindingCategories } from "@/prisma-actions/finding-category";

export default async function FindingCategoryage() {
  const { data: categories, error } = await getFindingCategories();
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
            <Label className="text-md font-semibold text-foreground">Finding Category</Label>
            <CreateDrawer />
          </div>
          <div>
            <DataTable
              columns={columns}
              data={categories}
            />
          </div>
        </>
      )}
    </div>
  )
}