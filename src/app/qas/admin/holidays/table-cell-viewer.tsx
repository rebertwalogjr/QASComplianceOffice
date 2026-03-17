"use client"

import { useState } from "react"
import { Holiday } from "../../../../../generated/prisma/client"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useIsMobile } from "@/hooks/use-mobile"
import { updateHoliday } from "@/server-actions/holiday"
import z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Loader2, X } from "lucide-react"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { DatePicker } from "@/components/datepicker"

const holidayUpdateSchema = z.object({
  name: z.string().min(1, "Holiday name is required"),
  type: z.string().min(1, "Please select a holiday type"),
  date: z.date({
    error: "Please select a date",
  }),
  isActive: z.string(),
})

type HolidayUpdateValues = z.infer<typeof holidayUpdateSchema>

interface Props {
  item: Holiday
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isDirty }, } = useForm<HolidayUpdateValues>({
    resolver: zodResolver(holidayUpdateSchema),
    values: {
      name: item.name,
      type: item.type,
      date: new Date(item.date),
      isActive: item.isActive ? "Active" : "Inactive"
    }
  })

  const onCancel = () => {
    reset()
    setIsEditing(false)
  }

  const onSubmit = async (values: HolidayUpdateValues) => {
    const formData = new FormData()
    formData.append("id", item.id.toString())
    formData.append("name", values.name)
    formData.append("type", values.type)
    formData.append("date", values.date.toISOString())
    formData.append("isActive", (values.isActive === "Active").toString())

    const response = await updateHoliday(formData)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success("Finding type created successfully!", { position: "top-center" })
      reset()
      setIsEditing(false)
      setIsOpen(false)
    }
  }

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        setIsEditing(false)
        if (!open) reset()
      }}
    >
      <DrawerTrigger asChild>
        <Button variant="link" className={`text-foreground w-fit px-0 ml-1 text-left ${className}`}>
          {item.name}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
            <DrawerTitle>{isEditing ? "Edit Holiday" : "Holiday Details"}</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon-sm">
                <X className="size-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <Separator />

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <FieldSet>
              <FieldGroup className="flex flex-col gap-5">

                {/* Name Field */}
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input 
                    {...register("name")} 
                    readOnly={!isEditing} 
                    className={!isEditing ? "bg-muted/30 border-transparent shadow-none" : ""} 
                  />
                  {errors.name && <p className="text-[10px] text-destructive mt-1">{errors.name.message}</p>}
                </Field>

                {/* Type Field */}
                <Field>
                  <FieldLabel>Type</FieldLabel>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={!isEditing ? "pointer-events-none bg-muted/30 border-transparent shadow-none cursor-default" : ""}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="special">Special</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                {/* Date Field */}
                <Field>
                  <FieldLabel>Date</FieldLabel>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <DatePicker 
                        defaultDate={field.value} 
                        onChange={field.onChange} 
                        readonly={!isEditing}
                        className={!isEditing ? "bg-muted/30 border-transparent shadow-none" : ""}
                      />
                    )}
                  />
                </Field>

                {/* Status Field */}
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={!isEditing ? "pointer-events-none bg-muted/30 border-transparent shadow-none cursor-default" : ""}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

              </FieldGroup>
            </FieldSet>
          </div>

          <DrawerFooter className="border-t gap-2">
            {!isEditing ? (
              <>
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Details
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </>
            ) : (
              <>
                <Button type="submit" disabled={isSubmitting || !isDirty}>
                  {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Save Changes
                </Button>
                <Button type="button" disabled={isSubmitting} variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </>
            )}
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}