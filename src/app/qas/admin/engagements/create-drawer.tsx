"use client"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Loader2, PlusCircle, X } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createAuditEngagement } from "@/server-actions/engagement"
import { ActiveCompanyPayload } from "@/server-actions/company"

const engagementSchema = z.object({
  name: z.string().min(1, "Engagement name is required"),
  companyId: z.string().min(1, "Please select a company"),
})

type EngagementFormValues = z.infer<typeof engagementSchema>

interface CreateDrawerProps {
  companies: ActiveCompanyPayload[]
}

export default function CreateDrawer({ companies }: CreateDrawerProps) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting }, } = useForm<EngagementFormValues>({
    resolver: zodResolver(engagementSchema),
    defaultValues: {
      name: "",
      companyId: ""
    }
  })

  const onSubmit = async (values: EngagementFormValues) => {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("companyId", values.companyId)

    const response = await createAuditEngagement(formData)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success("Engagement created successfully!", { position: "top-center" });
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
      }}>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm" className="rounded-2xl">
          <PlusCircle className="fill-white text-primary" />
          Add Engagement
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
            <DrawerTitle>Add New Engagement</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon-sm">
                <X className="size-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <Separator />

          <div className="flex flex-col gap-4 overflow-y-auto px-4 py-4 text-sm">
            <FieldGroup>
              <FieldSet>
                <FieldGroup>

                  {/* Name Field */}
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input id="name"
                      placeholder="e.g. Audit"
                      {...register("name")}
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                  </Field>

                  {/* Company Field */}
                  <Field>
                    <FieldLabel htmlFor="company">Company</FieldLabel>
                    <Controller
                      name="companyId"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange} >
                          <SelectTrigger id="companyId">
                            <SelectValue placeholder="Select company..." />
                          </SelectTrigger>
                          <SelectContent>
                            {companies.map((company) => (
                              <SelectItem key={company.id} value={company.id.toString()}>{company.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.companyId && <p className="text-xs text-destructive mt-1">{errors.companyId.message}</p>}
                  </Field>


                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </div>

          <DrawerFooter className="border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Engagement
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