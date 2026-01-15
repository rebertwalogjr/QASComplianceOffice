import { Label } from "@/components/ui/label";

export default function ManageStatusPage() {
  return (
    <div className="@container/main flex flex-col">
      <div className="flex flex-row px-6 pt-6 justify-between items-center">
        <Label className="text-md font-semibold text-foreground">Status Update</Label>
      </div>
      <div className="p-6 text-sm text-foreground">
        Manage Status Page Content
      </div>
    </div>
  )
}