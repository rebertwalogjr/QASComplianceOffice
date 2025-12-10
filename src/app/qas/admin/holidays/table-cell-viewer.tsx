"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { HolidayType, Status } from "@/lib/common-types";
import Holiday from "@/lib/holiday";
import { DatePicker } from "@/components/datepicker";

interface Props {
  item: Holiday
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile();

  const [isEditing, setIsEditing] = React.useState(false)

  const [form, setForm] = React.useState({
    id: item.id,
    name: item.name,
    holidayType: item.holidayType,
    date: item.date,
    status: item.status,
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
      name: item.name,
      holidayType: item.holidayType,
      date: item.date,
      status: item.status,
    })
    setIsEditing(false)
  }

  const onInput = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const isStatus = (v: string): v is Status => v === "Active" || v === "Inactive"

  const isType = (v: string): v is HolidayType => v === "Regular" || v === "Special"

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
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
                    <FieldLabel htmlFor="id">Id</FieldLabel>
                    <Input id="id" value={form.id} disabled className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input id="name" value={form.name} onChange={onInput("name")} disabled={!isEditing} className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="status">Type</FieldLabel>
                    <Select
                      value={form.holidayType}
                      onValueChange={(v) => {
                        if (!isEditing) return
                        if (!isType(v)) return
                        setForm((p) => ({ ...p, holidayType: v }))
                      }}>
                      <SelectTrigger id="holidayType" disabled={!isEditing} className="disabled:opacity-70">
                        <SelectValue placeholder="Select status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Special">Special</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="date">Date</FieldLabel>
                    <DatePicker defaultDate={item.date} disabled={!isEditing} className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Select
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