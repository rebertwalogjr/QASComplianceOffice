"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createProject } from "@/hooks/actions";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlusCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Company } from "../../../../../generated/prisma/client";

interface CreateDrawerProps {
  companies: Company[]
}

export default function CreateDrawer({ companies }: CreateDrawerProps) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", code: "", company: "", remarks: "" })

  const handleSubmit = async () => {
    const data = new FormData()

    setIsPending(true)

    if (!formData.name.trim() || !formData.code.trim()) {
      toast.error("Please fill in all required fields.");
      setIsPending(false)
      return
    }

    if (!formData.company) {
      toast.error("Please select a company first.");
      setIsPending(false)
      return
    }

    data.append("name", formData.name)
    data.append("code", formData.code)
    data.append("companyId", formData.company)
    data.append("remarks", formData.remarks)

    const result = await createProject(data)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Project created successfully!", { position: "top-center" });
      setFormData({ name: "", code: "", company: "", remarks: "" })
      setIsOpen(false)
    }
    setIsPending(false)
  }

  const handleClose = () => {
    setFormData({ name: "", code: "", company: "", remarks: "" })
    setIsOpen(false)
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onOpenChange={setIsOpen} onClose={handleClose}>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm" className="rounded-2xl">
          <PlusCircle className="fill-white text-primary" />
          Add Project
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
          <DrawerTitle>Add New Project</DrawerTitle>
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
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="code">Code</FieldLabel>
                  <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="company">Company</FieldLabel>
                  <Select
                    value={formData.company}
                    onValueChange={(value) => setFormData({ ...formData, company: value })}
                  >
                    <SelectTrigger id="company">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
                  <Textarea id="remarks"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} />
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