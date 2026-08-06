import { Label } from "@/components/ui/label"
import CreateDrawer from "./create-drawer"

export default function HolidayPageHeaderContent() {
  return (
    <div className="flex gap-2 justify-between items-center w-full">
      <Label className="text-md">Holidays</Label>
      <CreateDrawer />
    </div>
  )
}