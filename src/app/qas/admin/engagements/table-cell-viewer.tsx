"use client"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Loader2, X } from "lucide-react"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { useLookups } from "@/context/lookups-context"
import { AuditEngagement } from "../../../../../generated/prisma/client"
import { updateAuditEngagement } from "@/server-actions/engagement"

const engagementUpdateSchema = z.object({
  name: z.string().min(1, "Engagement name is required"),
  companyId: z.string().min(1, "Please select a company"),
  isActive: z.string(),
})

type EngagementUpdateValues = z.infer<typeof engagementUpdateSchema>

interface Props {
  item: AuditEngagement
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const { activeCompanies } = useLookups()

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isDirty }, } = useForm<EngagementUpdateValues>({
    resolver: zodResolver(engagementUpdateSchema),
    values: {
      name: item.name,
      companyId: item.companyId.toString(),
      isActive: item.isActive ? "Active" : "Inactive",
    }
  })

  const onSubmit = async (values: EngagementUpdateValues) => {
    const formData = new FormData()
    formData.append("id", item.id.toString())
    formData.append("name", values.name)
    formData.append("companyId", values.companyId)
    formData.append("isActive", (values.isActive === "Active").toString())

    const response = await updateAuditEngagement(formData)

    if (response.error) {
      toast.error(`Failed to update engagement: ${response.error}`)
    } else {
      toast.success("Engagement updated successfully!", { position: "top-center" })
      reset()
      setIsEditing(false)
      setIsOpen(false)
    }
  }

  const onCancel = () => {
    reset
    setIsEditing(false)
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
            <DrawerTitle>{isEditing ? "Edit Audit Engagement" : "Audit Engagement Details"}</DrawerTitle>
            <DrawerDescription></DrawerDescription>
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
                    <Input
                      {...register("name")}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted/30 border-transparent shadow-none" : ""}
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
                          <SelectTrigger id="companyId" className={!isEditing ? "bg-muted/30 border-transparent shadow-none pointer-events-none cursor-default" : ""}>
                            <SelectValue placeholder="Select company..." />
                          </SelectTrigger>
                          <SelectContent>
                            {activeCompanies?.map((company) => (
                              <SelectItem key={company.id} value={company.id.toString()}>{company.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.companyId && <p className="text-xs text-destructive mt-1">{errors.companyId.message}</p>}
                  </Field>

                  {/* Status Field */}
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} >
                          <SelectTrigger className={!isEditing ? "bg-muted/30 border-transparent shadow-none pointer-events-none cursor-default" : ""}>
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
            </FieldGroup>
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