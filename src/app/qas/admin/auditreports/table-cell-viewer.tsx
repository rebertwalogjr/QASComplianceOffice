"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { X } from "lucide-react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Status } from "@/lib/common-types";
import { AuditReport } from "../../../../../generated/prisma/client";
import { useLookups } from "@/context/lookups-context";
import { toast } from "sonner";
import { updateAuditReport } from "@/prisma-actions/audit-report";
import { Spinner } from "@/components/ui/spinner";

interface Props {
  item: AuditReport
  className?: string
}

export default function TableCellViewer({ item, className }: Props) {
  const isMobile = useIsMobile();
  const { activeProjects, activeCompanies, activeAuditEngagements } = useLookups();
  const [isEditing, setIsEditing] = React.useState(false)
  const [isPending, setIsPending] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    id: item.id,
    name: item.name,
    companyId: item.companyId,
    projectId: item.projectId,
    auditEngagementId: item.auditEngagementId,
    isActive: item.isActive ? "Active" : "Inactive",
  })

  const filteredProjects = React.useMemo(() => {
      if (!form.companyId) return [];
      return activeProjects?.filter(p => p.companyId === form.companyId);
    }, [form.companyId, activeProjects]);
  
    const filteredEngagements = React.useMemo(() => {
      if (!form.companyId) return [];
      return activeAuditEngagements?.filter(e => e.companyId === form.companyId);
    }, [form.companyId, activeAuditEngagements]);
  

  const handleUpdate = () => {
    setIsEditing(true)
  }

  const handleSubmitUpdate = async () => {
    setIsPending(true)

    if (!form.companyId || !form.projectId || !form.auditEngagementId) {
      toast.error("Please fill in all required fields.")
      setIsPending(false)
      return
    }

    const data = new FormData()
    data.append("name", form.name)
    data.append("companyId", form.companyId.toString())
    data.append("projectId", form.projectId.toString())
    data.append("auditEngagementId", form.auditEngagementId.toString())
    data.append("isActive", form.isActive === "Active" ? "true" : "false")

    const response = await updateAuditReport(data, item.id)

    if (response.error) {
      toast.error(`Failed to update audit report: ${response.error}`)
    } else {
      toast.success("Audit Report updated successfully!", { position: "top-center" })
      setIsEditing(false)
      setIsOpen(false)
    }
    setIsPending(false)
  }

  const handleCancel = () => {
    setForm({
      id: item.id,
      name: item.name,
      companyId: item.companyId,
      projectId: item.projectId,
      auditEngagementId: item.auditEngagementId,
      isActive: item.isActive ? "Active" : "Inactive",
    })
    setIsEditing(false)
  }

  const onInput = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const isStatus = (v: string): v is Status => v === "Active" || v === "Inactive"

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onOpenChange={setIsOpen} onClose={handleCancel}>
      <DrawerTrigger asChild>
        <Button variant="link" className={`text-foreground w-fit px-0 ml-1 text-left ${className}`}>
          {item.name}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
          <DrawerTitle>Quick View &amp; Action</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon-sm">
              <X />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <Separator />

        <div className="flex flex-col gap-4 overflow-y-auto px-4 py-4 text-sm">
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>

            <FieldGroup>
              <FieldSet>
                <FieldGroup>

                  {/* <Field>
                    <FieldLabel htmlFor="id">Id</FieldLabel>
                    <Input id="id" value={form.id} disabled className="disabled:opacity-70" />
                  </Field> */}

                  <Field>
                    <FieldLabel htmlFor="auditNumber">Audit Number</FieldLabel>
                    <Input id="auditNumber" value={form.name} onChange={onInput("name")} disabled={!isEditing} className="disabled:opacity-70" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="company">Company</FieldLabel>
                    {/* <Input id="company" value={form.companyId} onChange={onInput("companyId")} disabled={!isEditing} className="disabled:opacity-70" /> */}
                    <Select
                      disabled={!isEditing}
                      value={form.companyId.toString()}
                      onValueChange={(value) => setForm({ ...form, companyId: parseInt(value) })}
                    >
                      <SelectTrigger id="company">
                        <SelectValue placeholder="Select a company" />
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
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="project">Project</FieldLabel>
                    {/* <Input id="project" value={form.projectDepartmentId} onChange={onInput("projectDepartmentId")} disabled={!isEditing} className="disabled:opacity-70" /> */}
                    <Select
                      disabled={!isEditing}
                      value={form.projectId.toString()}
                      onValueChange={(value) => setForm({ ...form, projectId: parseInt(value) })}
                    >
                      <SelectTrigger id="project">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {filteredProjects?.map((projects) => (
                            <SelectItem key={projects.id} value={projects.id.toString()}>
                              {projects.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="auditEngagement">Audit Engagement</FieldLabel>
                    {/* <Input id="auditEngagement" value={form.auditEngagementId} onChange={onInput("auditEngagementId")} disabled={!isEditing} className="disabled:opacity-70" /> */}
                    <Select
                      disabled={!isEditing}
                      value={form.auditEngagementId.toString()}
                      onValueChange={(value) => setForm({ ...form, auditEngagementId: parseInt(value) })}
                    >
                      <SelectTrigger id="auditEngagement">
                        <SelectValue placeholder="Select a audit engagement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {filteredEngagements?.map((engagements) => (
                            <SelectItem key={engagements.id} value={engagements.id.toString()}>
                              {engagements.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Select
                      value={form.isActive}
                      onValueChange={(v) => {
                        if (!isEditing) return
                        if (!isStatus(v)) return
                        setForm((p) => ({ ...p, isActive: v }))
                      }}>
                      <SelectTrigger id="status" disabled={!isEditing} className="disabled:opacity-70">
                        <SelectValue placeholder="Select status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        </div>

        <DrawerFooter>
          {!isEditing ? (
            <>
              <Button onClick={handleUpdate}>Update</Button>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </>
          ) : (
            <>
              <Button onClick={handleSubmitUpdate} disabled={isPending}>
                {isPending ? (
                  <>
                    Saving
                    <Spinner className="mr-2" />
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button onClick={handleCancel} variant="outline" disabled={isPending}>Cancel</Button>
            </>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}