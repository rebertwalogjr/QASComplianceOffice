import { Button } from "@/components/ui/button";
import User from "@/lib/user";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { X } from "lucide-react";

interface Props {
  item: User
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className={`text-foreground w-fit px-0 ml-4 text-left ${ className }`}>
          {item.empId}
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
              <Label htmlFor="seriesno">Employee ID</Label>
              <Input id="seriesno" defaultValue={item.empId} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="auditno">First Name</Label>
              <Input id="auditno" defaultValue={item.firstname} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="company">Last Name</Label>
              <Input id="company" defaultValue={item.lastname} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="project">Username</Label>
              <Input id="project" defaultValue={item.username} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="status">Status</Label>
              <Input id="status" defaultValue={item.status} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="rating">Email</Label>
              <Input id="rating" defaultValue={item.email} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="engagement">Company</Label>
              <Input id="engagement" defaultValue={item.company} readOnly />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="category">User Access</Label>
              <Input id="category" readOnly />
            </div>

            

          </form>
        </div>

        <DrawerFooter>
          <Button asChild>
            <Link href={`/qas/admin/user/${item.id}`}>Update</Link>
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}