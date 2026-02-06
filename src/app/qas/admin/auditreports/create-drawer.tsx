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
import { createAuditReport } from "@/hooks/actions";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Company, Project, AuditEngagement } from "../../../../../generated/prisma/client";

interface CreateDrawerProps {
  companies: Company[]
  projects: Project[]
  auditEngagements: AuditEngagement[]
}

export default function CreateDrawer({ companies, projects, auditEngagements }: CreateDrawerProps) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", companyId: "", projectDepartmentId: "", auditEngagementId: "" });

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
    data.append("projectDepartmentId", formData.projectDepartmentId)
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
                    <FieldLabel htmlFor="company">Company</FieldLabel>
                    <Select
                      value={formData.companyId}
                      onValueChange={(value) => setFormData({ ...formData, companyId: value })}
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
                    >
                      <SelectTrigger id="project">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.id.toString()}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="name">Audit Number</FieldLabel>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="engagement">Engagement</FieldLabel>
                    <Select
                      value={formData.auditEngagementId}
                      onValueChange={(value) => setFormData({ ...formData, auditEngagementId: value })}
                    >
                      <SelectTrigger id="engagement">
                        <SelectValue placeholder="Select a audit engagement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {auditEngagements.map((auditEngagement) => (
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