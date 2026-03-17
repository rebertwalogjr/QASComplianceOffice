"use client"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, PlusCircle, X } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { createGroup } from "@/server-actions/group"
import { ActiveProjectPayload } from "@/server-actions/project"

const groupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  code: z.string().min(1, "Group code is required"),
  projectId: z.string().min(1, "Please select a project"),
  remarks: z.string().optional(),
  inCharge: z.string().min(1, "In-Charge is required"),
  emailAddress: z.string().min(1, "Email is required"),
})

type GroupFormValues = z.infer<typeof groupSchema>

interface CreateDrawerProps {
  projects: ActiveProjectPayload[]
}

export default function CreateDrawer({ projects }: CreateDrawerProps) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting }, } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      code: "",
      projectId: "",
      remarks: "",
      inCharge: "",
      emailAddress: "",
    }
  })

  const onSubmit = async (values: GroupFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("code", values.code);
    formData.append("projectId", values.projectId);
    formData.append("remarks", values.remarks ?? "");
    formData.append("inCharge", values.inCharge);
    formData.append("emailAddress", values.emailAddress);

    const response = await createGroup(formData);

    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Group created successfully!", { position: "top-center" })
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
          <PlusCircle className="fill-white text-primary" />
          Add Group
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
            <DrawerTitle>Add New Group</DrawerTitle>
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
                    <FieldLabel htmlFor="groupName">Name</FieldLabel>
                    <Input
                      id="name"
                      placeholder="e.g. Information Technology Department"
                      {...register("name")}
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                  </Field>

                  {/* Code Field */}
                  <Field>
                    <FieldLabel htmlFor="groupCode">Code</FieldLabel>
                    <Input
                      id="code"
                      placeholder="e.g. ITD"
                      {...register("code")}
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
                        <Select value={field.value} onValueChange={field.onChange} >
                          <SelectTrigger id="project">
                            <SelectValue placeholder="Select project or department..." />
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map((project) => (
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
                    <Input id="inCharge"
                      placeholder="e.g. Juan Dela Cruz"
                      {...register("inCharge")}
                    />
                    {errors.inCharge && <p className="text-xs text-destructive mt-1">{errors.inCharge.message}</p>}
                  </Field>

                  {/* In-Charge Email Address Field */}
                  <Field>
                    <FieldLabel htmlFor="groupInChargeEmail">In-Charge Email</FieldLabel>
                    <Input id="emailAddress"
                      placeholder="e.g. jdelacruz@email.com"
                      {...register("emailAddress")}
                    />
                    {errors.emailAddress && <p className="text-xs text-destructive mt-1">{errors.emailAddress.message}</p>}
                  </Field>

                  {/* Remarks Field */}
                  <Field>
                    <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
                    <Textarea id="remarks"
                      placeholder="Remarks or comments here..."
                      {...register("remarks")} />
                  </Field>

                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </div>

          <DrawerFooter className="border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Project
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