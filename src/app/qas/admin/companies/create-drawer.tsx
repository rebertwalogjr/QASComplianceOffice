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
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export default function CreateDrawer() {
  const isMobile = useIsMobile();
  const { pending } = useFormStatus();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = async (formData: FormData) => {
    const result = await createCompany(formData);

    if (result.error) {
      toast.error("Failed to create company");
    } else {
      toast.success("Company created successfully!");
      setIsOpen(false);
    }
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
        <form className="flex flex-col gap-4" action={handleSubmit}>
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
                    <Input name="name" id="name" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="code">Code</FieldLabel>
                    <Input name="code" id="code" />
                  </Field>

                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </div>

          <DrawerFooter>
            <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save"}</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}