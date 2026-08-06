import { Label } from "@/components/ui/label"
import CreateDrawer from "./create-drawer"
import { ActiveCompanyPayload } from "@/server-actions/company"

export default function EngagementsPageHeaderContent({companies}: {companies: ActiveCompanyPayload[]}) {
  return (
    <div className="flex gap-2 justify-between items-center w-full">
      <Label className="text-md">Engagements</Label>
      <CreateDrawer companies={companies} />
    </div>
  )
}