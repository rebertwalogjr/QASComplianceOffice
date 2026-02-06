"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Status } from "@/lib/common-types";
import { useLookups } from "@/context/lookups-context";
import { toast } from "sonner";
import { updateGroup } from "@/hooks/actions";
import { Spinner } from "@/components/ui/spinner";
import { Group } from "../../../../../generated/prisma/client";

interface Props {
  item: Group
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const { activeProjects } = useLookups();
  const [form, setForm] = React.useState({
    id: item.id,
    code: item.code,
    name: item.name,
    inCharge: item.inCharge,
    projectId: item.projectId,
    emailAddress: item.emailAddress,
    isActive: item.isActive ? "Active" : "Inactive",
    remarks: item.remarks,
  })

  const handleUpdate = () => {
    setIsEditing(true)
  }

  const handleSubmitUpdate = async () => {
    setIsPending(true)

    const data = new FormData()
    data.append("name", form.name)
    data.append("code", form.code)
    data.append("isActive", form.isActive === "Active" ? "true" : "false")
    data.append("projectId", item.projectId.toString())
    data.append("inCharge", form.inCharge)
    data.append("emailAddress", form.emailAddress)
    data.append("remarks", form.remarks || "")

    if (form.name.trim() === "" || form.code.trim() === "" || form.inCharge.trim() === "" || form.emailAddress.trim() === "") {
      toast.error("Please fill in all required fields.");
      setIsPending(false);
      return;
    }

    const response = await updateGroup(data, item.id)

    if (response.error) {
      toast.error(`Failed to update group: ${response.error}`)
    } else {
      toast.success("Group updated successfully!", { position: "top-center" })
      setIsEditing(false)
      setIsOpen(false)
    }
    setIsPending(false)
  }

  const handleCancel = () => {
    setForm({
      id: item.id,
      code: item.code,
      name: item.name,
      projectId: item.projectId,
      inCharge: item.inCharge,
      emailAddress: item.emailAddress,
      isActive: item.isActive ? "Active" : "Inactive",
      remarks: item.remarks,
    })
    setIsEditing(false)
  }

  const onInput = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const isStatus = (v: string): v is Status => v === "Active" || v === "Inactive"

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onOpenChange={setIsOpen} onClose={handleCancel}>
      <DrawerTrigger asChild>
        <Button variant="link" className={`text-foreground w-fit px-0 ml-1 text-left ${className}`}>
          {item.name}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
          <DrawerTitle>Quick View &amp; Action</DrawerTitle>
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
                    <FieldLabel htmlFor="groupCode">Group Code</FieldLabel>
                    <Input id="groupCode" value={form.code} onChange={onInput("code")} disabled={!isEditing} className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="groupName">Name</FieldLabel>
                    <Input id="groupName" value={form.name} onChange={onInput("name")} disabled={!isEditing} className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="project">Project / Department</FieldLabel>
                    <Select
                      value={form.projectId.toString()}
                      disabled={!isEditing}
                      onValueChange={(value) => { setForm((p) => ({ ...p, projectDepartmentId: parseInt(value) }))}}>
                      <SelectTrigger id="project">
                        <SelectValue placeholder="Select project or department..." />
                      </SelectTrigger>
                      <SelectContent>
                        { activeProjects?.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>{project.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="groupInCharge">In-Charge</FieldLabel>
                    <Input id="groupInCharge" value={form.inCharge} onChange={onInput("inCharge")} disabled={!isEditing} className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="groupInChargeEmail">In-Charge Email</FieldLabel>
                    <Input id="groupInChargeEmail" value={form.emailAddress} onChange={onInput("emailAddress")} disabled={!isEditing} className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Select
                      value={form.isActive}
                      onValueChange={(v) => {
                        if (!isEditing) return
                        if (!isStatus(v)) return
                        setForm((p) => ({ ...p, isActive: v }))
                      }}>
                      <SelectTrigger id="status" disabled={!isEditing} className="disabled:opacity-70">
                        <SelectValue placeholder="Select status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
                    <Textarea id="remarks" value={form.remarks || ""} onChange={onInput("remarks")} disabled={!isEditing} className="disabled:opacity-70" />
                  </Field>

                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        </div>

        <DrawerFooter>
          {!isEditing ? (
            <>
              <Button onClick={handleUpdate}>Update</Button>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </>
          ) : (
            <>
              <Button onClick={handleSubmitUpdate} disabled={isPending}>
                {isPending ? (
                  <>
                    Saving
                    <Spinner className="mr-2" />
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button onClick={handleCancel} variant="outline" disabled={isPending}>Cancel</Button>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
