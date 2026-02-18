"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlusCircle, X } from "lucide-react";
import { toast } from "sonner";
import { createAuditReport } from "@/prisma-actions/audit-report";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActiveCompanyPayload } from "@/prisma-actions/company";
import { ActiveProjectPayload } from "@/prisma-actions/project";
import { ActiveEngagementPayload } from "@/prisma-actions/engagement";

interface CreateDrawerProps {
  companies: ActiveCompanyPayload[]
  projects: ActiveProjectPayload[]
  auditEngagements: ActiveEngagementPayload[]
}

export default function CreateDrawer({ companies, projects, auditEngagements }: CreateDrawerProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", companyId: "", projectDepartmentId: "", auditEngagementId: "" })

  const filteredProjects = React.useMemo(() => {
    if (!formData.companyId) return [];
    return projects.filter(p => p.companyId.toString() === formData.companyId);
  }, [formData.companyId, projects]);

  const filteredEngagements = React.useMemo(() => {
    if (!formData.companyId) return [];
    return auditEngagements.filter(e => e.companyId.toString() === formData.companyId);
  }, [formData.companyId, auditEngagements]);

  const handleSubmit = async () => {
    setIsPending(true)

    if (!formData.name.trim() || !formData.companyId.trim() || !formData.projectDepartmentId.trim() || !formData.auditEngagementId.trim()) {
      toast.error("Please fill in all required fields.");
      setIsPending(false)
      return
    }

    const data = new FormData()

    data.append("name", formData.name)
    data.append("companyId", formData.companyId)
    data.append("projectId", formData.projectDepartmentId)
    data.append("auditEngagementId", formData.auditEngagementId)

    const response = await createAuditReport(data)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success("Project created successfully!", { position: "top-center" });
      setFormData({ name: "", companyId: "", projectDepartmentId: "", auditEngagementId: "" })
      setIsOpen(false)
    }
    setIsPending(false)
  }

  const handleClose = () => {
    setFormData({ name: "", companyId: "", projectDepartmentId: "", auditEngagementId: "" })
    setIsOpen(false)
  }

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onOpenChange={setIsOpen} onClose={handleClose}>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm" className="rounded-2xl">
          <PlusCircle className="fill-white text-primary" />
          Add New
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
          <DrawerTitle>Add Audit Number</DrawerTitle>
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

                  <Field>
                    <FieldLabel htmlFor="name">Audit Number</FieldLabel>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="company">Company</FieldLabel>
                    <Select
                      value={formData.companyId}
                      onValueChange={(value) => setFormData({ ...formData, companyId: value, projectDepartmentId: "", auditEngagementId: "" })}
                    >
                      <SelectTrigger id="company">
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {companies.map((company) => (
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
                    <Select
                      value={formData.projectDepartmentId}
                      onValueChange={(value) => setFormData({ ...formData, projectDepartmentId: value })}
                      disabled={!formData.companyId}
                    >
                      <SelectTrigger id="project">
                        <SelectValue placeholder={formData.companyId ? "Select a project" : "Select a company first."} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {filteredProjects.map((project) => (
                            <SelectItem key={project.id} value={project.id.toString()}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="engagement">Engagement</FieldLabel>
                    <Select
                      value={formData.auditEngagementId}
                      onValueChange={(value) => setFormData({ ...formData, auditEngagementId: value })}
                      disabled={!formData.companyId}
                    >
                      <SelectTrigger id="engagement">
                        <SelectValue placeholder={formData.companyId ? "Select a engagement" : "Select a company first."} />
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
                  </Field>

                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        </div>

        <DrawerFooter>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                Saving
                <Spinner className="mr-2" />
              </>
            ) : (
              "Save"
            )}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" disabled={isPending}>Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}