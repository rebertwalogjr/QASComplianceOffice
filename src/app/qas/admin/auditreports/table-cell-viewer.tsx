"use client"

import { useState, useMemo, useEffect } from "react"
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
import { Status } from "@/lib/common-types"
import { AuditReport } from "../../../../../generated/prisma/client"
import { useLookups } from "@/context/lookups-context"
import { updateAuditReport } from "@/server-actions/audit-report"
import { Spinner } from "@/components/ui/spinner"

const auditNumberUpdateSchema = z.object({
  name: z.string().min(1),
  companyId: z.string().min(1, "Please select a company"),
  projectId: z.string().min(1, "Please select a project"),
  engagementId: z.string().min(1, "Please select an engagement"),
  isActive: z.string(),
})

type AuditNumberUpdateValues = z.infer<typeof auditNumberUpdateSchema>

interface Props {
  item: AuditReport
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile()
  const { activeProjects, activeCompanies, activeAuditEngagements } = useLookups()
  const [isEditing, setIsEditing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting, isDirty }, } = useForm<AuditNumberUpdateValues>({
    resolver: zodResolver(auditNumberUpdateSchema),
    values: {
      name: item.name,
      companyId: item.companyId.toString(),
      projectId: item.projectId.toString(),
      engagementId: item.auditEngagementId.toString(),
      isActive: item.isActive ? "Active" : "Inactive",
    }
  })

  const selectedCompanyId = watch("companyId")
  const selectedProjectId = watch("projectId")

  useEffect(() => {
    if (selectedProjectId) {
      const year = new Date().getFullYear().toString()
      const month = (new Date().getUTCMonth() + 1).toString()
      const company = activeCompanies?.find(c => c.id.toString() === selectedCompanyId)
      const project = activeProjects?.find(p => p.id.toString() === selectedProjectId)

      if (company && project) {
        const generatedName = `${company.code}-${project.code}-${year}-${month}`
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
    return activeProjects?.filter(p => p.companyId.toString() === selectedCompanyId);
  }, [selectedCompanyId, activeProjects]);

  const filteredEngagements = useMemo(() => {
    if (!selectedCompanyId) return [];
    return activeAuditEngagements?.filter(e => e.companyId.toString() === selectedCompanyId);
  }, [selectedCompanyId, activeAuditEngagements]);


  const handleUpdate = () => {
    setIsEditing(true)
  }

  const onSubmit = async (values: AuditNumberUpdateValues) => {
    const formData = new FormData()
    formData.append("id", item.id.toString())
    formData.append("name", values.name)
    formData.append("companyId", values.companyId.toString())
    formData.append("projectId", values.projectId.toString())
    formData.append("auditEngagementId", values.engagementId.toString())
    formData.append("isActive", (values.isActive === "Active").toString())

    const response = await updateAuditReport(formData)

    if (response.error) {
      toast.error(`Failed to update audit report: ${response.error}`)
    } else {
      toast.success("Audit Report updated successfully!", { position: "top-center" })
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
            <DrawerTitle>{isEditing ? "Edit Audit Report" : "Audit Report Details"}</DrawerTitle>
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
                    <FieldLabel htmlFor="name">Audit Report No.</FieldLabel>
                    <Input
                      {...register("name")}
                      readOnly
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

                  {/* Project Field */}
                  <Field>
                    <FieldLabel htmlFor="project">Project / Department</FieldLabel>
                    <Controller
                      name="projectId"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange} >
                          <SelectTrigger id="project" className={!isEditing ? "bg-muted/30 border-transparent shadow-none pointer-events-none cursor-default" : ""}>
                            <SelectValue placeholder={selectedCompanyId ? "Select a project" : "Select a company first."} />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredProjects?.map((project) => (
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
                          <SelectTrigger id="engagement" className={!isEditing ? "bg-muted/30 border-transparent shadow-none pointer-events-none cursor-default" : ""}>
                            <SelectValue placeholder={selectedCompanyId ? "Select a engagement" : "Select a company first."} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {filteredEngagements?.map((auditEngagement) => (
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