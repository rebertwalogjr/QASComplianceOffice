import { Button } from "@/components/ui/button";
import { Transaction } from "./columns";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  item: Transaction;
}

export default function TableCellViewer({ item }: Props) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 ml-4 text-left">
          {item.id}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Quick Action</DrawerTitle>
          {/* <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription> */}
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">

            <div className="flex flex-col gap-3">
              <Label htmlFor="seriesno">Series No.</Label>
              <Input id="seriesno" defaultValue={item.id} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="auditno">Audit Finding No.</Label>
              <Input id="auditno" defaultValue={item.auditNo} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="company">Company</Label>
              <Input id="company" defaultValue={item.company} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="project">Project</Label>
              <Input id="project" defaultValue={item.project} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="status">Status</Label>
              <Input id="status" defaultValue={item.status} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="rating">Rating</Label>
              <Input id="rating" defaultValue={item.rating} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="engagement">Engagement</Label>
              <Input id="engagement" defaultValue={item.engagement} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="category">Category</Label>
              <Input id="category" defaultValue={item.category} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="details">Details</Label>
              <Input id="details" defaultValue={item.details} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="approvedDate">Date Approved</Label>
              <Input id="approvedDate" defaultValue={item.approvedDate} readOnly />
            </div>

          </form>
        </div>

        <DrawerFooter>
          <Button>View</Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}