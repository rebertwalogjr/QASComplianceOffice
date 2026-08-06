import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { PencilIcon } from "lucide-react"

export default function EditUserPageHeaderContent({ data }: { data: string }) {
  return (
    <div className="flex gap-2 justify-between items-center w-full">
      <div className="flex gap-2">
        <Label className="text-md">{data}</Label>
        <Badge variant="outline" className="text-muted-foreground"><PencilIcon />Editing</Badge>
      </div>
    </div>
  )
}