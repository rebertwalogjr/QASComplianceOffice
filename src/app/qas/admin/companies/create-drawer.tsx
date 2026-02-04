"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createCompany } from "@/hooks/actions";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlusCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function CreateDrawer() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", code: "" });

  const handleSubmit = async () => {
    const data = new FormData()
    
    setIsPending(true)
    
    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error("Please fill in all required fields.");
      setIsPending(false)
      return
    }

    data.append("name", formData.name)
    data.append("code", formData.code)

    const result = await createCompany(data)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Company created successfully!", { position: "top-center" });
      setFormData({ name: "", code: "" })
      setIsOpen(false)
    }
    setIsPending(false)
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm" className="rounded-2xl">
          <PlusCircle className="fill-white text-primary" />
          Add Company
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
          <DrawerTitle>Add New Company</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon-sm">
              <X />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <Separator />

        <div className="flex flex-col gap-4 overflow-y-auto px-4 py-4 text-sm">
          <FieldGroup>
            <FieldSet>
              <FieldGroup>

                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="code">Code</FieldLabel>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                </Field>

              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </div>

        <DrawerFooter>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                Saving
                <Spinner className="mr-2" />
              </>
            ) : (
              "Save"
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" disabled={isPending}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}