"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlusCircle, X } from "lucide-react";
import { toast } from "sonner";
import { createGroup } from "@/hooks/actions";
import { Spinner } from "@/components/ui/spinner";
import { Project } from "../../../../../generated/prisma/client";

interface CreateDrawerProps {
  projects: Project[]
}

export default function CreateDrawer({ projects }: CreateDrawerProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", code: "", projectId: "", remarks: "", inCharge: "", emailAddress: "" });

  const handleSubmit = async () => {
    setIsPending(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("code", formData.code);
    data.append("projectId", formData.projectId);
    data.append("remarks", formData.remarks);
    data.append("inCharge", formData.inCharge);
    data.append("emailAddress", formData.emailAddress);

    if (!formData.name.trim() || !formData.code.trim() || !formData.projectId.trim() || !formData.inCharge.trim() || !formData.emailAddress.trim()) {
      toast.error("Please fill in all required fields.");
      setIsPending(false);
      return;
    }

    const response = await createGroup(data);

    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Group created successfully!", { position: "top-center" });
      setFormData({ name: "", code: "", projectId: "", remarks: "", inCharge: "", emailAddress: "" });
      setIsOpen(false);
    }
    setIsPending(false);
  }

  const handleClose = () => {
    setFormData({ name: "", code: "", projectId: "", remarks: "", inCharge: "", emailAddress: "" });
      setIsOpen(false);
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onOpenChange={setIsOpen} onClose={handleClose}>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm" className="rounded-2xl">
          <PlusCircle className="fill-white text-primary" />
          Add Group
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
          <DrawerTitle>Add New Group</DrawerTitle>
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
                  <FieldLabel htmlFor="groupName">Name</FieldLabel>
                  <Input id="groupName" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="groupCode">Code</FieldLabel>
                  <Input id="groupCode" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="project">Project / Department</FieldLabel>
                  <Select onValueChange={(value) => setFormData({ ...formData, projectId: value })} >
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select project or department..." />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>{project.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="groupInCharge">In-Charge</FieldLabel>
                  <Input id="groupInCharge" value={formData.inCharge} onChange={(e) => setFormData({ ...formData, inCharge: e.target.value })} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="groupInChargeEmail">In-Charge Email</FieldLabel>
                  <Input id="groupInChargeEmail" value={formData.emailAddress} onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
                  <Textarea id="remarks" value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} />
                </Field>

              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </div>

        <DrawerFooter>
          <Button onClick={handleSubmit} disabled={isPending}>
            { isPending ? (
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