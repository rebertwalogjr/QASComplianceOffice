import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import CreateDrawer from "./create-drawer";
import { Label } from "@/components/ui/label";
import { getAuditRatings } from "@/prisma-actions/rating";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getActiveCompanies } from "@/prisma-actions/company";
import { LookupsProvider } from "@/context/lookups-context";

export default async function RatingsPage() {
  const [ratingRes, activeCompaniesRes] = await Promise.all([getAuditRatings(), getActiveCompanies()]);

  const activeCompanies = activeCompaniesRes.data ?? []
  const error = ratingRes.error || activeCompaniesRes.error

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
            <Label className="text-md font-semibold text-foreground">Audit Ratings</Label>
            <CreateDrawer companies={activeCompaniesRes.data} />
          </div>
          <div>
            <LookupsProvider data={{ activeCompanies }}>
              <DataTable
                columns={columns}
                data={ratingRes.data}
              />
            </LookupsProvider>
          </div>
        </>
      )}
    </div>
  )
}