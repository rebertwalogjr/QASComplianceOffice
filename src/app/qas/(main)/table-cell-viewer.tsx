import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { X } from "lucide-react";
import { TransactionBasicPaylod } from "@/prisma-actions/transaction";

interface Props {
  item: TransactionBasicPaylod
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className={`text-foreground w-fit px-0 ml-4 text-left ${ className }`}>
          {item.id}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
          <DrawerTitle>Quick Action</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon-sm">
              <X />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <Separator />

        <div className="flex flex-col gap-4 overflow-y-auto px-4 py-4 text-sm">
          <form className="flex flex-col gap-4">

            <div className="flex flex-col gap-3">
              <Label htmlFor="seriesno">Series No.</Label>
              <Input id="seriesno" defaultValue={item.id} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="auditno">Audit Finding No.</Label>
              <Input id="auditno" defaultValue={item.auditFindingNumber} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="company">Company</Label>
              <Input id="company" defaultValue={item.company.name} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="project">Project</Label>
              <Input id="project" defaultValue={item.project.name} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="status">Status</Label>
              <Input id="status" defaultValue={item.jobStatus ?? ""} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="rating">Rating</Label>
              <Input id="rating" defaultValue={item.auditRating.name} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="engagement">Engagement</Label>
              <Input id="engagement" defaultValue={item.auditEngagement.name} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="category">Category</Label>
              <Input id="category" defaultValue={item.findingCategory.name} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="details">Recipient</Label>
              <Input id="details" defaultValue={item.recipient?.appSuiteEmployeeMaster.fullName} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="approvedDate">Date Approved</Label>
              <Input id="approvedDate" defaultValue={item.approvedOn?.toDateString() ?? ""} readOnly />
            </div>

          </form>
        </div>

        <DrawerFooter>
          <Button asChild>
            <Link href={`/qas/${item.id}`}>View</Link>
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}