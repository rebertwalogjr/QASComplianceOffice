"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FolderLock, Group as GroupIcon, Megaphone, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";

import { MultiSelectCommand } from "@/components/multiselect-command";
import { EscalationCommand } from "@/components/escalations-command";

import { updateUser, UserInfoPayload } from "@/server-actions/user";
import { ActiveCompanyPayload } from "@/server-actions/company";
import { ActiveProjectPayload } from "@/server-actions/project";
import { ActiveGroupPayload } from "@/server-actions/group";
import { ActiveRolePayload } from "@/server-actions/role";


interface UserFormProps {
  initialData: UserInfoPayload
  companies: ActiveCompanyPayload[] | null
  groups: ActiveGroupPayload[] | null
  projects: ActiveProjectPayload[] | null
  roles: ActiveRolePayload[] | null
}

export default function UserForm({ initialData, companies, groups, projects, roles }: UserFormProps) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)
  const isEscalationRef = useRef<HTMLButtonElement>(null)

  const [formData, setFormData] = useState({
    username: initialData.username || "",
    emailAddress: initialData.emailAddress || "",
    companyId: initialData.companyId?.toString() || "",
    isActive: initialData.isActive ?? true,
    isEscalation: initialData.isEscalation ?? false
  })

  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(
    initialData?.userRoles?.map((ur: any) => ur.role.id) || []
  )

  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>(
    initialData?.userGroups?.map((g: any) => g.group.id) || []
  )

  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>(
    initialData?.userProjects?.map((p: any) => p.project.id) || []
  )

  const mapEscalation = (esc: any) => esc ? {
    id: esc.id,
    fullName: esc.appSuiteEmployeeMaster.fullName,
    employeeNumber: esc.appSuiteEmployeeMaster.employeeNumber
  } : null;

  const [escalations, setEscalations] = useState({
    first: mapEscalation(initialData.escalation1User),
    second: mapEscalation(initialData.escalation2User),
    third: mapEscalation(initialData.escalation3User),
    fourth: mapEscalation(initialData.escalation4User),
  });

  const handleEscalationSelect = (level: keyof typeof escalations, user: any) => {
    setEscalations((prev) => ({ ...prev, [level]: user, }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    
    const submissionData = {
      ...formData,
      roleIds: selectedRoleIds,
      groupIds: selectedGroupIds,
      projectIds: selectedProjectIds,
      escalations,
      userId: initialData?.id,
    }

    const response = await updateUser(initialData.id, submissionData)

    if (response.error) {
      toast.error("Error: " + response.error)
    } else {
      toast.success("User updated successfully!");
      router.push("/qas/admin/users")
      router.refresh()
    }
    setIsPending(false)
  }

  return (
    <form onSubmit={handleSubmit} className="@container/main pt-10 pb-6">
      <div className="flex flex-col gap-8 px-3 md:px-32">

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
          <div className="flex flex-col gap-4">

            <div className="flex items-center gap-2">
              <div className="rounded-md border p-2 bg-primary/10 text-primary border-primary">
                <UserIcon size={16} />
              </div>
              <Label className="text-lg">Personal Information</Label>
            </div>

            <Card className="shadow-none">
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Select Employee</FieldLabel>
                    <Input value={`${initialData.appSuiteEmployeeMaster?.fullName} (${initialData?.employeeNumber})`} className="bg-muted" readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="empId">Employee Id</FieldLabel>
                    <Input
                      id="empId"
                      value={initialData?.employeeNumber}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="firtname">First Name</FieldLabel>
                    <Input
                      id="firtname"
                      value={initialData.appSuiteEmployeeMaster?.firstName}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                    <Input
                      id="lastname"
                      value={initialData.appSuiteEmployeeMaster?.lastName}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="position">Position</FieldLabel>
                    <Input
                      id="position"
                      value={initialData.appSuiteEmployeeMaster?.position ?? ""}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <Input
                      id="email"
                      defaultValue={formData.emailAddress}
                      onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value})}
                    />
                  </Field>

                </FieldGroup>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4">

            <div className="flex items-center gap-2">
              <div className="rounded-md border p-2 bg-cyan-500/10 text-cyan-500 border-cyan-500">
                <FolderLock size={16} />
              </div>
              <Label className="text-lg">Access Information</Label>
            </div>

            {/* Access Information Card  */}

            <Card className="shadow-none">
              <CardContent>
                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="company">Company</FieldLabel>
                      <Select
                        required
                        value={formData.companyId}
                        onValueChange={(value) => setFormData({ ...formData, companyId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company..." />
                        </SelectTrigger>
                        <SelectContent 
                        className="w-[calc(100vw-24px)] md:w-full p-0"
                        align="start"
                        position="popper"
                        sideOffset={4}
                        >
                          {companies?.map((company: any) => (
                            <SelectItem key={company.id} value={company.id.toString()}>
                              <span className="truncate inline-block max-w-[80vw] md:max-w-none">
                                {company.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="userlevel">User Level</FieldLabel>
                      <MultiSelectCommand
                        records={roles ?? []}
                        selectedIds={selectedRoleIds}
                        onChange={setSelectedRoleIds} />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <Input id="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value})} />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="addEmail">Escalation</FieldLabel>
                      <div className="flex gap-3 items-center">
                        <Checkbox
                          id="isEscalation"
                          checked={formData.isEscalation}
                          onCheckedChange={(checked: boolean) => setFormData({ ...formData, isEscalation: checked})}
                        />
                        <FieldDescription>Add to Escalation?</FieldDescription>
                      </div>
                    </Field>

                  </FieldGroup>

                </FieldSet>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardContent>
                <Field>
                  <FieldLabel>Ticking this will change the user status.</FieldLabel>
                  <div className="flex gap-3 items-center">
                    <Checkbox
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked})}
                    />
                    <FieldDescription>{formData.isActive ? "Active" : "Inactive"}</FieldDescription>
                  </div>
                </Field>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-green-500/10 text-green-500 border-green-500">
              <GroupIcon size={16} />
            </div>
            <Label className="text-lg">Groups & Projects</Label>
          </div>

          <Card className="shadow-none">
            <CardContent>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                <Field>
                  <FieldLabel htmlFor="group">User Group</FieldLabel>
                  <MultiSelectCommand
                    records={groups ?? []}
                    selectedIds={selectedGroupIds}
                    onChange={setSelectedGroupIds} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="project">Project</FieldLabel>
                  <MultiSelectCommand
                    records={projects ?? []}
                    selectedIds={selectedProjectIds}
                    onChange={setSelectedProjectIds} />
                </Field>
              </div>
            </CardContent>
          </Card>

        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-orange-500/10 text-orange-500 border-orange-500">
              <Megaphone size={16} />
            </div>
            <Label className="text-lg">Set Escalation</Label>
          </div>

          {/* Set Escalation Card */}
          <Card className="shadow-none">
            <CardContent>
              <FieldSet>
                <FieldGroup>

                  <Field>
                    <FieldLabel htmlFor="escalation">First Escalation</FieldLabel>
                    <EscalationCommand
                      defaultValue={escalations.first}
                      onSelect={(user) => handleEscalationSelect("first", user)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="escalation">Second Escalation</FieldLabel>
                    <EscalationCommand
                      defaultValue={escalations.second}
                      onSelect={(user) => handleEscalationSelect("second", user)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="escalation">Third Escalation</FieldLabel>
                    <EscalationCommand
                      defaultValue={escalations.third}
                      onSelect={(user) => handleEscalationSelect("third", user)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="escalation">Fourth Escalation</FieldLabel>
                    <EscalationCommand
                      defaultValue={escalations.fourth}
                      onSelect={(user) => handleEscalationSelect("fourth", user)}
                    />
                  </Field>

                </FieldGroup>

              </FieldSet>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" disabled={isPending} asChild><Link href="/qas/admin/users">Cancel</Link></Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                Saving
                <Spinner className="mr-2" />
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}