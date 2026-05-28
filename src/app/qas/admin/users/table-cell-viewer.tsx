import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { LockIcon, X } from "lucide-react"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { UserBasicIncludePayload } from "@/server-actions/user"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Badge } from "@/components/ui/badge"

interface Props {
  item: UserBasicIncludePayload
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className={`text-foreground w-fit px-0 ml-1 text-left ${className}`}>
          {item.employeeNumber}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
          <DrawerTitle>Quick View</DrawerTitle>
          <DrawerDescription></DrawerDescription>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon-sm">
              <X />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <Separator />

        <div className="flex flex-col overflow-y-auto px-4 py-4 text-sm">
          <form onSubmit={(e) => e.preventDefault()}>
            <FieldGroup>
              <FieldSet>
                <FieldGroup>

                  <Field>
                    <FieldLabel htmlFor="seriesno">Employee Number</FieldLabel>
                    <Input id="seriesno" defaultValue={item.employeeNumber} readOnly className="bg-muted/30 border-transparent shadow-none" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="firstname">First Name</FieldLabel>
                    <Input id="firstname" defaultValue={item.appSuiteEmployeeMaster.firstName} readOnly className="bg-muted/30 border-transparent shadow-none" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                    <Input id="lastname" defaultValue={item.appSuiteEmployeeMaster.lastName} readOnly className="bg-muted/30 border-transparent shadow-none" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input id="username" defaultValue={item.username} readOnly className="bg-muted/30 border-transparent shadow-none" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" defaultValue={item.emailAddress || "--"} readOnly className="bg-muted/30 border-transparent shadow-none" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="company">Company</FieldLabel>
                    <Input id="company" defaultValue={item.company?.name || "--"} readOnly className="bg-muted/30 border-transparent shadow-none" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="accesslevel">Access Level</FieldLabel>
                    {/* <Input id="accesslevel" defaultValue={item.accessId || "--"} disabled className="disabled:opacity-70" /> */}
                    <div className="flex flex-wrap justify-start gap-2 bg-muted/30 p-2 rounded-md border-transparent shadow-none">
                      {item.userRoles.filter((i) => i.isActive).map((r) => (
                        <Badge key={r.role.id} variant="outline">
                          {r.role.name}
                        </Badge>
                      ))}
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Input id="status" defaultValue={item.isActive ? "Active" : "Inactive"} readOnly className="bg-muted/30 border-transparent shadow-none" />
                  </Field>

                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        </div>

        <DrawerFooter>
          <Button asChild>
            <Link href={`/qas/admin/users/${item.id}`}>Update</Link>
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}