"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Status } from "@/lib/common-types";
import Company from "@/lib/company";
import { toast } from "sonner";
import { deleteCompany, updateCompany } from "@/hooks/actions";
import ActionDialog from "@/components/action-dialog";
import { DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  item: Company
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile()
  const [isPending, setIsPending] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)

  const [form, setForm] = React.useState({
    id: item.id,
    name: item.name,
    code: item.code,
    status: item.isActive ? "Active" : "Inactive",
  })

  const handleUpdate = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setForm({
      id: item.id,
      name: item.name,
      code: item.code,
      status: item.isActive ? "Active" : "Inactive",
    })
    setIsEditing(false)
  }

  const handleSubmitUpdate = async () => {
    setIsPending(true)

    const formData = new FormData()

    formData.append("name", form.name)
    formData.append("code", form.code)
    formData.append("isActive", form.status === "Active" ? "true" : "false")

    const result = await updateCompany(formData, item.id)

    if (result.error) {
      toast.error(`Failed to update project: ${result.error}`)
    } else {
      toast.success("Company updated successfully!", { position: "top-center" })
      setIsEditing(false)
      setIsOpen(false)
    }

    setIsPending(false)
  }

  const handleDelete = async () => {
    setIsPending(true)
    const result = await deleteCompany(item.id)

    if (result.error) {
      toast.error("Failed to delete company")
    } else {
      toast.success("Company deleted successfully!", { position: "top-center" })
      setIsOpen(false)
    }

    setIsPending(false)
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
          <FieldGroup>
            <FieldSet>
              <FieldGroup>

                {/* <Field>
                  <FieldLabel htmlFor="id">Id</FieldLabel>
                  <Input id="id" name="id" value={form.id} disabled className="disabled:opacity-70" />
                </Field> */}

                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input id="name" name="name" value={form.name} onChange={onInput("name")} disabled={!isEditing} className="disabled:opacity-70" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="code">Code</FieldLabel>
                  <Input id="code" name="code" value={form.code} onChange={onInput("code")} disabled={!isEditing} className="disabled:opacity-70" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select
                    name="isActive"
                    value={form.status}
                    onValueChange={(v) => {
                      if (!isEditing) return
                      if (!isStatus(v)) return
                      setForm((p) => ({ ...p, status: v }))
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

              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </div>

        <DrawerFooter>
          {!isEditing ? (
            <>
              <Button onClick={handleUpdate} disabled={isPending}>Update</Button>
              <DrawerClose asChild>
                <Button variant="outline" disabled={isPending}>Close</Button>
              </DrawerClose>
            </>
          ) : (
            <>
              {isEditing &&
                <ActionDialog
                  title="Delete company"
                  description="Are you sure? This action cannot be undone."
                  trigger={<Button variant="destructive" disabled={isPending}>Delete</Button>}
                  children={
                    <FieldGroup className="gap-4">
                      <Field>
                        <Label>Name</Label>
                        <Input value={item.name} readOnly />
                      </Field>
                      <Field>
                        <Label>Code</Label>
                        <Input value={item.code} readOnly />
                      </Field>
                    </FieldGroup>
                  }
                  footer={
                    <>
                      <DialogClose asChild>
                        <Button variant="secondary" disabled={isPending}>Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleDelete} disabled={isPending}>
                        {isPending ? (
                          <>
                            Deleting
                            <Spinner className="mr-2" />
                          </>
                        ) : "Delete"}
                      </Button>
                    </>
                  }
                >
                </ActionDialog>
              }
              <Separator className="my-2"></Separator>
              <Button onClick={handleSubmitUpdate} disabled={isPending}>
                {isPending ? (
                  <>
                    Saving
                    <Spinner className="mr-2" />
                  </>
                ) : "Save"}
              </Button>
              <Button onClick={handleCancel} variant="outline" disabled={isPending}>Cancel</Button>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}