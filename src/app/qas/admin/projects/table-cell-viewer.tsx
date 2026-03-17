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
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Loader2, X } from "lucide-react"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { useLookups } from "@/context/lookups-context"
import { Project } from "../../../../../generated/prisma/client"
import { updateProject } from "@/server-actions/project"

const projectUpdateSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  code: z.string().min(1, "Project code is required"),
  companyId: z.string().min(1, "Please select a company"),
  remarks: z.string().optional(),
  isActive: z.string(),
})

type ProjectUpdateValues = z.infer<typeof projectUpdateSchema>

interface Props {
  item: Project
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { activeCompanies } = useLookups()

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isDirty }, } = useForm<ProjectUpdateValues>({
    resolver: zodResolver(projectUpdateSchema),
    values: {
      name: item.name,
      code: item.code,
      companyId: item.companyId.toString(),
      remarks: item.remarks ?? "",
      isActive: item.isActive ? "Active" : "Inactive"
    }
  })

  const handleUpdate = () => {
    setIsEditing(true)
  }

  const onSubmit = async (values: ProjectUpdateValues) => {
    const formData = new FormData()

    formData.append("name", values.name)
    formData.append("code", values.code)
    formData.append("isActive", values.isActive === "Active" ? "true" : "false")
    formData.append("companyId", values.companyId?.toString())
    formData.append("remarks", values.remarks || "")

    const result = await updateProject(formData, item.id)

    if (result.error) {
      toast.error(`Failed to update project: ${result.error}`)
    } else {
      toast.success("Project updated successfully!", { position: "top-center" })
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
            <DrawerTitle>{isEditing ? "Edit Project" : "Project Details"}</DrawerTitle>
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
                <FieldGroup>

                  <Field hidden>
                    <FieldLabel htmlFor="id">Id</FieldLabel>
                    <Input id="id" value={item.id} disabled className="disabled:opacity-70" />
                  </Field>

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

                  {/* Code Field */}
                  <Field>
                    <FieldLabel htmlFor="code">Code</FieldLabel>
                    <Input
                      {...register("code")}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted/30 border-transparent shadow-none" : ""}
                    />
                    {errors.code && <p className="text-xs text-destructive mt-1">{errors.code.message}</p>}
                  </Field>

                  {/* Company Field */}
                  <Field>
                    <FieldLabel htmlFor="company">Company</FieldLabel>
                    <Controller
                      name="companyId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger id="company" className={!isEditing ? "pointer-events-none cursor-default bg-muted/30 border-transparent shadow-none" : ""}>
                            <SelectValue placeholder="Select company..." />
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
                      )}
                    />
                    {errors.companyId && <p className="text-xs text-destructive mt-1">{errors.companyId.message}</p>}
                  </Field>

                  {/* Remarks Field */}
                  <Field>
                    <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
                    <Textarea
                      {...register("remarks")}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted/30 border-transparent shadow-none resize-none" : ""}
                    />
                    {errors.remarks && <p className="text-xs text-destructive mt-1">{errors.remarks.message}</p>}
                  </Field>

                  {/* Status Field */}
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={!isEditing ? "pointer-events-none cursor-default bg-muted/30 border-transparent shadow-none" : ""}>
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