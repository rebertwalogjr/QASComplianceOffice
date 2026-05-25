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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Loader2, X } from "lucide-react"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Status } from "@/lib/common-types"
import { Spinner } from "@/components/ui/spinner"
import { FindingCategory } from "../../../../../generated/prisma/client"
import { updateFindingCategory } from "@/server-actions/finding-category"

const findingCategoryUpdateSchema = z.object({
  name: z.string().min(1, "Finding Category name is required"),
  isActive: z.string(),
})

type FindingCategoryUpdateValues = z.infer<typeof findingCategoryUpdateSchema>

interface Props {
  item: FindingCategory
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isDirty }, } = useForm<FindingCategoryUpdateValues>({
    resolver: zodResolver(findingCategoryUpdateSchema),
    values: {
      name: item.name,
      isActive: item.isActive ? "Active" : "Inactive"
    }
  })

  const onSubmit = async (values: FindingCategoryUpdateValues) => {
    const formData = new FormData()
    formData.append("id", item.id.toString())
    formData.append("name", values.name)
    formData.append("isActive", (values.isActive === "Active").toString())

    const response = await updateFindingCategory(formData)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success("Finding category updated successfully!", { position: "top-center" })
      reset()
      setIsEditing(false)
      setIsOpen(false)
    }
  }

  const onCancel = () => {
    reset()
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
            <DrawerTitle>{isEditing ? "Edit Finding Category" : "Finding Category Details"}</DrawerTitle>
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

                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input
                      {...register("name")}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted/30 border-transparent shadow-none" : ""}
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                  </Field>

                  {/* Status Field */}
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
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