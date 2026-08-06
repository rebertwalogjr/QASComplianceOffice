import { Label } from "@/components/ui/label"
import CreateDrawer from "./create-drawer"
import { ActiveCompanyPayload } from "@/server-actions/company"

export default function RatingPageHeaderContent({ companies }: { companies: ActiveCompanyPayload[] | null }) {
  return (
    <div className="flex gap-2 justify-between items-center w-full">
      <Label className="text-md">Ratings</Label>
      <CreateDrawer companies={companies} />
    </div>
  )
}