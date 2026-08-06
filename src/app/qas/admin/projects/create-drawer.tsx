"use client"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"
import { createProject } from "@/server-actions/project"
import { ActiveCompanyPayload } from "@/server-actions/company"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, PlusCircle, X } from "lucide-react"

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  code: z.string().min(1, "Project code is required"),
  companyId: z.string().min(1, "Please select a company"),
  remarks: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface CreateDrawerProps {
  companies: ActiveCompanyPayload[] | null
}

export default function CreateDrawer({ companies }: CreateDrawerProps) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting }, } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      code: "",
      companyId: "",
      remarks: "",
    }
  })

  const onSubmit = async (values: ProjectFormValues) => {
    const formData = new FormData()

    formData.append("name", values.name)
    formData.append("code", values.code)
    formData.append("companyId", values.companyId)
    formData.append("remarks", values.remarks ?? "")

    const result = await createProject(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Project created successfully!", { position: "top-center" });
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
        <Button variant="outline" size={isMobile ? "icon-sm" : "sm"}>
          <PlusCircle />
          {!isMobile ? "Add Project" : ""}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
            <DrawerTitle>Add New Project</DrawerTitle>
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
                  <div className="flex flex-col gap-5">

                    {/* Code Field */}
                    <Field>
                      <FieldLabel htmlFor="code">Project Code</FieldLabel>
                      <Input
                        id="code"
                        placeholder="MC"
                        {...register("code")}
                      />
                      {errors.code && <p className="text-xs text-destructive mt-1">{errors.code.message}</p>}
                    </Field>

                    {/* Name Field */}
                    <Field>
                      <FieldLabel htmlFor="name">Project Name</FieldLabel>
                      <Input
                        id="name"
                        placeholder="e.g. Moncello Crest"
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
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="company">
                              <SelectValue placeholder="Select company..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {companies?.map((company) => (
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
                      <Textarea id="remarks"
                        placeholder="Remarks or comments here..."
                        {...register("remarks")}
                      />
                      {errors.remarks && <p className="text-xs text-destructive mt-1">{errors.remarks.message}</p>}
                    </Field>

                  </div>
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