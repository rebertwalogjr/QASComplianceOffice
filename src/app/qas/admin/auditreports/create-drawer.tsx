"use client"

import { useState, useMemo, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Loader2, PlusCircle, X } from "lucide-react"
import { createAuditReport } from "@/server-actions/audit-report"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ActiveCompanyPayload } from "@/server-actions/company"
import { ActiveProjectPayload } from "@/server-actions/project"
import { ActiveEngagementPayload } from "@/server-actions/engagement"

const auditNumberSchema = z.object({
  name: z.string().min(1),
  companyId: z.string().min(1, "Please select a company"),
  projectId: z.string().min(1, "Please select a project"),
  engagementId: z.string().min(1, "Please select an engagement")
})

type AuditNumberFormValues = z.infer<typeof auditNumberSchema>

interface CreateDrawerProps {
  companies: ActiveCompanyPayload[]
  projects: ActiveProjectPayload[]
  auditEngagements: ActiveEngagementPayload[]
}

export default function CreateDrawer({ companies, projects, auditEngagements }: CreateDrawerProps) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting }, } = useForm<AuditNumberFormValues>({
    resolver: zodResolver(auditNumberSchema),
    defaultValues: {
      name: "",
      companyId: "",
      projectId: "",
      engagementId: ""
    }
  })

  const selectedCompanyId = watch("companyId")
  const selectedProjectId = watch("projectId")

  useEffect(() => {
    if (selectedProjectId) {
      const year = new Date().getFullYear().toString()
      const company = companies.find(c => c.id.toString() === selectedCompanyId)
      const project = projects.find(p => p.id.toString() === selectedProjectId)

      if (company && project) {
        const generatedName = `${company.code}-${project.code}-${year}`
        setValue("name", generatedName, { shouldValidate: true })
      }
    } else {
      setValue("name", "")
    }
  }, [selectedProjectId, setValue])

  useEffect(() => {
    setValue("projectId", "");
    setValue("engagementId", "");
    setValue("name", "");
  }, [selectedCompanyId, setValue])

  const filteredProjects = useMemo(() => {
    if (!selectedCompanyId) return [];
    return projects.filter(p => p.companyId.toString() === selectedCompanyId);
  }, [selectedCompanyId, projects]);

  const filteredEngagements = useMemo(() => {
    if (!selectedCompanyId) return [];
    return auditEngagements.filter(e => e.companyId.toString() === selectedCompanyId);
  }, [selectedCompanyId, auditEngagements]);

  const onsubmit = async (values: AuditNumberFormValues) => {
    const formData = new FormData()

    formData.append("name", values.name)
    formData.append("companyId", values.companyId)
    formData.append("projectId", values.projectId)
    formData.append("auditEngagementId", values.engagementId)

    const response = await createAuditReport(formData)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success("Project created successfully!", { position: "top-center" });
      reset()
      setIsOpen(false)
    }
  }

  const handleClose = () => {
    reset()
    setIsOpen(false)
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
          Add New
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col h-full">
          <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
            <DrawerTitle>Add Audit Number</DrawerTitle>
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
                      <FieldLabel htmlFor="name">Audit Number</FieldLabel>
                      <Input id="name"
                        placeholder="----"
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

                    {/* Project Field */}
                    <Field>
                      <FieldLabel htmlFor="project">Project / Department</FieldLabel>
                      <Controller
                        name="projectId"
                        control={control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange} >
                            <SelectTrigger id="project">
                              <SelectValue placeholder={selectedCompanyId ? "Select a project" : "Select a company first."} />
                            </SelectTrigger>
                            <SelectContent>
                              {filteredProjects.map((project) => (
                                <SelectItem key={project.id} value={project.id.toString()}>{project.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.projectId && <p className="text-xs text-destructive mt-1">{errors.projectId.message}</p>}
                    </Field>

                    {/* Engagement Field */}
                    <Field>
                      <FieldLabel htmlFor="engagement">Engagement</FieldLabel>
                      <Controller
                        name="engagementId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger id="engagement">
                              <SelectValue placeholder={selectedCompanyId ? "Select a engagement" : "Select a company first."} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {filteredEngagements.map((auditEngagement) => (
                                  <SelectItem key={auditEngagement.id} value={auditEngagement.id.toString()}>
                                    {auditEngagement.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </Field>

                  </FieldGroup>
                </FieldSet>
              </FieldGroup>
          </div>

          <DrawerFooter className="border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Report
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