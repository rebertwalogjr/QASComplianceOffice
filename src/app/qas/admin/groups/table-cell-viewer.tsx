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
import Group from "@/lib/group";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Status } from "@/lib/types";

interface Props {
  item: Group
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile();

  const [isEditing, setIsEditing] = React.useState(false)

  const [form, setForm] = React.useState({
    id: item.id,
    groupCode: item.groupCode,
    groupName: item.groupName,
    groupInCharge: item.groupInCharge,
    groupInChargeEmail: item.groupInChargeEmail,
    status: item.status,
    remarks: item.remarks,
  })

  const handleUpdate = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    setForm({
      id: item.id,
      groupCode: item.groupCode,
      groupName: item.groupName,
      groupInCharge: item.groupInCharge,
      groupInChargeEmail: item.groupInChargeEmail,
      status: item.status,
      remarks: item.remarks,
    })
    setIsEditing(false)
  }

  const onInput = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const isStatus = (v: string) : v is Status => v === "Active" || v === "Inactive"

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className={`text-foreground w-fit px-0 ml-4 text-left ${className}`}>
          {item.id}
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
                {/* <FieldLegend>Title</FieldLegend>
                <FieldDescription>Description</FieldDescription> */}
                <FieldGroup>

                  <Field>
                    <FieldLabel htmlFor="groupId">Group Id</FieldLabel>
                    <Input id="groupId" value={form.id} readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="groupCode">Group Code</FieldLabel>
                    <Input id="groupCode" value={form.groupCode} onChange={onInput("groupCode")} readOnly={!isEditing} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="groupName">Name</FieldLabel>
                    <Input id="groupName" value={form.groupName} onChange={onInput("groupName")} readOnly={!isEditing} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="groupInCharge">Group In-Charge</FieldLabel>
                    <Input id="groupInCharge" value={form.groupInCharge} onChange={onInput("groupInCharge")} readOnly={!isEditing} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="groupInChargeEmail">Email</FieldLabel>
                    <Input id="groupInChargeEmail" value={form.groupInChargeEmail} onChange={onInput("groupInChargeEmail")} readOnly={!isEditing} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Select 
                      value={form.status} 
                      onValueChange={(v) => {
                        if (!isEditing) return
                        if (!isStatus(v)) return
                        setForm((p) => ({ ...p, status: v}))
                      }}>
                      <SelectTrigger id="status" disabled={!isEditing}>
                        <SelectValue placeholder="Select status..."  />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
                    <Textarea id="remarks" value={form.remarks} onChange={onInput("remarks")} readOnly={!isEditing} />
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
              <Button onClick={handleSave}>Save</Button>
              <Button onClick={handleCancel} variant="outline">Cancel</Button>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}