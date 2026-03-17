"use client"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"
import { createHoliday } from "@/server-actions/holiday"

import { DatePicker } from "@/components/datepicker"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Loader2, PlusCircle, X } from "lucide-react"

const holidaySchema = z.object({
  name: z.string().min(1, "Holiday name is required"),
  type: z.string().min(1, "Please select a holiday type"),
  date: z.date({
    error: "Please select a date",
  })
})

type HolidayFormValues = z.infer<typeof holidaySchema>

export default function CreateDrawer() {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting }, } = useForm<HolidayFormValues>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      name: "",
      type: "",
      date: new Date(),
    }
  })

  const onSubmit = async (values: HolidayFormValues) => {
    const data = new FormData()
    data.append("name", values.name)
    data.append("type", values.type)
    data.append("date", values.date.toISOString())

    const response = await createHoliday(data)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success("Finding type created successfully!", { position: "top-center" })
      reset()
      setIsOpen(false)
    }
  }

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) reset()
      }}
    >
      <DrawerTrigger asChild>
        <Button variant="default" size="sm" className="rounded-2xl">
          <PlusCircle className="fill-white text-primary size-4" />
          Add Holiday
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
            <DrawerTitle>Add New Holiday</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon-sm">
                <X className="size-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <Separator />

          <div className="flex-1 overflow-y-auto px-4 py-4 text-sm">
            <FieldGroup>
              <FieldSet>
                <div className="flex flex-col gap-5">
                  {/* Name Field */}
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input 
                      id="name" 
                      placeholder="e.g. Christmas Day"
                      {...register("name")} 
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                  </Field>

                  {/* Type Field */}
                  <Field>
                    <FieldLabel htmlFor="type">Type</FieldLabel>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger id="type">
                            <SelectValue placeholder="Select type..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="regular">Regular</SelectItem>
                            <SelectItem value="special">Special</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.type && <p className="text-xs text-destructive mt-1">{errors.type.message}</p>}
                  </Field>

                  {/* Date Field */}
                  <Field>
                    <FieldLabel htmlFor="date">Date</FieldLabel>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker 
                          defaultDate={field.value} 
                          onChange={field.onChange} 
                        />
                      )}
                    />
                    {errors.date && <p className="text-xs text-destructive mt-1">{errors.date.message}</p>}
                  </Field>
                </div>
              </FieldSet>
            </FieldGroup>
          </div>

          <DrawerFooter className="border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Holiday
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}