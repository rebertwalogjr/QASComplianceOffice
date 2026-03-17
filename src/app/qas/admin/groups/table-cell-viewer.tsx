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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Loader2, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Status } from "@/lib/common-types"
import { useLookups } from "@/context/lookups-context"
import { Spinner } from "@/components/ui/spinner"
import { Group } from "../../../../../generated/prisma/client"
import { updateGroup } from "@/server-actions/group"

const groupUpdateSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  code: z.string().min(1, "Group code is required"),
  projectId: z.string().min(1, "Please select a project"),
  remarks: z.string().optional(),
  inCharge: z.string().min(1, "In-Charge is required"),
  emailAddress: z.string().min(1, "Email is required"),
  isActive: z.string(),
})

type GroupUpdateValues = z.infer<typeof groupUpdateSchema>

interface Props {
  item: Group
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile();
  const [isEditing, setIsEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const { activeProjects } = useLookups()

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isDirty }, } = useForm<GroupUpdateValues>({
    resolver: zodResolver(groupUpdateSchema),
    values: {
      name: item.name,
      code: item.code,
      projectId: item.projectId.toString(),
      remarks: item.remarks ?? "",
      inCharge: item.inCharge,
      emailAddress: item.emailAddress,
      isActive: item.isActive ? "Active" : "Inactive"
    }
  })

  const onSubmit = async (values: GroupUpdateValues) => {
    const formData = new FormData()
    formData.append("id", item.id.toString())
    formData.append("name", values.name)
    formData.append("code", values.code)
    formData.append("isActive", (values.isActive === "Active").toString())
    formData.append("projectId", values.projectId.toString())
    formData.append("inCharge", values.inCharge)
    formData.append("emailAddress", values.emailAddress)
    formData.append("remarks", values.remarks || "")

    const response = await updateGroup(formData)

    if (response.error) {
      toast.error(`Failed to update group: ${response.error}`)
    } else {
      toast.success("Group updated successfully!", { position: "top-center" })
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
            <DrawerTitle>{isEditing ? "Edit Group" : "Group Details"}</DrawerTitle>
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

                  {/* Name Field */}
                  <Field>
                    <FieldLabel htmlFor="groupName">Name</FieldLabel>
                    <Input
                      {...register("name")}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted/30 border-transparent shadow-none" : ""}
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                  </Field>

                  {/* Code Field */}
                  <Field>
                    <FieldLabel htmlFor="groupCode">Code</FieldLabel>
                    <Input
                      {...register("code")}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted/30 border-transparent shadow-none" : ""}
                    />
                    {errors.code && <p className="text-xs text-destructive mt-1">{errors.code.message}</p>}
                  </Field>

                  {/* Project Field */}
                  <Field>
                    <FieldLabel htmlFor="project">Project / Department</FieldLabel>
                    <Controller
                      name="projectId"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="projectId" className={!isEditing ? "bg-muted/30 border-transparent shadow-none pointer-events-none cursor-default" : ""}>
                            <SelectValue placeholder="Select project or department..." />
                          </SelectTrigger>
                          <SelectContent>
                            {activeProjects?.map((project) => (
                              <SelectItem key={project.id} value={project.id.toString()}>{project.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.projectId && <p className="text-xs text-destructive mt-1">{errors.projectId.message}</p>}
                  </Field>

                  {/* In-Charge Field */}
                  <Field>
                    <FieldLabel htmlFor="inCharge">In-Charge</FieldLabel>
                    <Input
                      {...register("inCharge")}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted/30 border-transparent shadow-none" : ""}
                    />
                    {errors.inCharge && <p className="text-xs text-destructive mt-1">{errors.inCharge.message}</p>}
                  </Field>


                  {/* In-Charge Email Address Field */}
                  <Field>
                    <FieldLabel htmlFor="groupInChargeEmail">In-Charge Email</FieldLabel>
                    <Input
                      {...register("emailAddress")}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted/30 border-transparent shadow-none" : ""}
                    />
                    {errors.emailAddress && <p className="text-xs text-destructive mt-1">{errors.emailAddress.message}</p>}
                  </Field>

                  {/* Remarks Field */}
                  <Field>
                    <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
                    <Textarea
                      {...register("remarks")}
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted/30 border-transparent shadow-none resize-none" : ""}
                    />
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
