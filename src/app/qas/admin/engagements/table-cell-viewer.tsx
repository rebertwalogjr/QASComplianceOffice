"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Status } from "@/lib/common-types";
import { useLookups } from "@/context/lookups-context";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { AuditEngagement } from "../../../../../generated/prisma/client";
import { updateAuditEngagement } from "@/server-actions/engagement";

interface Props {
  item: AuditEngagement
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile();
  const { activeCompanies } = useLookups();
  const [isEditing, setIsEditing] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    id: item.id,
    name: item.name,
    companyId: item.companyId,
    isActive: item.isActive ? "Active" : "Inactive",
  })

  const handleUpdate = () => {
    setIsEditing(true)
  }

  const handleSubmitUpdate = async () => {
    setIsPending(true)

    const data = new FormData()
    data.append("name", form.name)
    data.append("companyId", form.companyId?.toString())
    data.append("isActive", form.isActive === "Active" ? "true" : "false")

    if (form.name.trim() === "" || !form.companyId) {
      toast.error("Please fill in all required fields.");
      setIsPending(false)
      return
    }

    const response = await updateAuditEngagement(data, item.id)

    if (response.error) {
      toast.error(`Failed to update engagement: ${response.error}`)
    } else {
      toast.success("Engagement updated successfully!", { position: "top-center" });
      setIsEditing(false)
      setIsOpen(false)
    }
    setIsPending(false)
  }

  const handleCancel = () => {
    setForm({
      id: item.id,
      name: item.name,
      companyId: item.companyId,
      isActive: item.isActive ? "Active" : "Inactive",
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
          <FieldGroup>
            <FieldSet>
              <FieldGroup>

                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input id="name" value={form.name} onChange={onInput("name")} disabled={!isEditing} className="disabled:opacity-70" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="company">Company</FieldLabel>
                  <Input id="company" value={form.companyId} onChange={onInput("companyId")} disabled={!isEditing} className="disabled:opacity-70" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="company">Company</FieldLabel>
                  {/* <Input id="company" value={companies.find(c => c.id === form.companyId)?.name || ""} disabled className="disabled:opacity-70" /> */}
                  <Select
                    value={form.companyId?.toString() || ""}
                    disabled={!isEditing}
                    onValueChange={(value) => setForm({ ...form, companyId: parseInt(value) })}
                  >
                    <SelectTrigger id="company">
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {activeCompanies?.map((company) => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="isActive">Status</FieldLabel>
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

              </FieldGroup>
            </FieldSet>
          </FieldGroup>
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