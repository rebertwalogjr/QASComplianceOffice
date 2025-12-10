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
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";

interface Props {
  item: User
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className={`text-foreground w-fit px-0 ml-1 text-left ${className}`}>
          {item.empId}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
          <DrawerTitle>Quick View</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon-sm">
              <X />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <Separator />

        <div className="flex flex-col gap-4 overflow-y-auto px-4 py-4 text-sm">
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>

            <FieldGroup>
              <FieldSet>
                <FieldGroup>

                  <Field>
                    <FieldLabel htmlFor="seriesno">Id</FieldLabel>
                    <Input id="seriesno" defaultValue={item.empId} disabled className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="firstname">First Name</FieldLabel>
                    <Input id="firstname" defaultValue={item.firstname} disabled className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                    <Input id="lastname" defaultValue={item.lastname} disabled className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input id="username" defaultValue={item.username} disabled className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" defaultValue={item.email} disabled className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="company">Company</FieldLabel>
                    <Input id="company" defaultValue={item.company} disabled className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="accesslevel">Access Level</FieldLabel>
                    <Input id="accesslevel" defaultValue={item.accesslevel} disabled className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Input id="status" defaultValue={item.status} disabled className="disabled:opacity-70" />
                  </Field>

                </FieldGroup>
              </FieldSet>
            </FieldGroup>
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