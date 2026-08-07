import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import Link from "next/link"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { X } from "lucide-react"
import { EmailTemplate } from "../../../../../generated/prisma/client"
import { Textarea } from "@/components/ui/textarea"
import { HtmlViewer } from "@/components/html-viewer"

interface Props {
  item: EmailTemplate
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className={`text-foreground w-fit px-0 ml-1 text-left ${className}`}>
          {item.name}
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
          <FieldGroup>
            <FieldSet>
              <FieldGroup>

                <Field>
                  <FieldLabel htmlFor="seriesno">Name</FieldLabel>
                  <Input id="seriesno" defaultValue={item.name} readOnly className="bg-muted/30 border-transparent shadow-none" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="firstname">Subject</FieldLabel>
                  <Input id="firstname" defaultValue={item.subject ?? ""} readOnly className="bg-muted/30 border-transparent shadow-none" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="status">Description</FieldLabel>
                  <Input id="status" defaultValue={item.description ? "Active" : "Inactive"} readOnly className="bg-muted/30 border-transparent shadow-none" />
                </Field>

                <Field>
                  <FieldLabel>Content</FieldLabel>
                  <HtmlViewer content={item.content} className="bg-muted/30 border-transparent shadow-none" />
                  {/* <Textarea defaultValue={item.content} rows={30} readOnly className="bg-muted/30 border-transparent shadow-none" /> */}
                </Field>

              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </div>

        <DrawerFooter>
          <Button asChild>
            <Link href={`/qas/admin/templates/${item.id}`}>Update</Link>
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}