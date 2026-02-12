"use client";

import { EmployeeCommand } from "@/components/employeeMaster-command";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FolderLock, Group, Megaphone, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MultiSelectCommand } from "@/components/multiselect-command";
import { EscalationCommand } from "@/components/escalations-command";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUser } from "@/prisma-actions/user";
import { Spinner } from "@/components/ui/spinner";

type selectedEmployee = {
  employeeNumber: string
  firstName: string
  lastName: string
  emailAddress: string
  position: string
  fullName: string
} | null

export default function UserForm({ initialData, companies, groups, projects, roles }: any) {
  const router = useRouter()

  const [isPending, setIsPending] = useState(false)
  const employeePersonalData: selectedEmployee = initialData.appSuiteEmployeeMaster
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialData?.companyId ? initialData.companyId.toString() : "")
  const [genUsername, setGenUsername] = useState(initialData?.username || "")
  const [isEscalation, setIsEscalation] = useState<boolean>(initialData.isEscalation)
  const [isActive, setIsActive] = useState<boolean>(initialData.isActive)
  const [email, setEmail] = useState<string>(initialData.emailAddress)
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(
    initialData?.userRoles?.map((ur: any) => ur.role.id) || []
  )
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>(
    initialData?.userGroups?.map((g: any) => g.group.id) || []
  )
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>(
    initialData?.userProjects?.map((p: any) => p.project.id) || []
  )
  const [escalations, setEscalation] = useState({
    first: initialData?.escalation1User ? {
      id: initialData.escalation1User.id,
      fullName: initialData.escalation1User.appSuiteEmployeeMaster.fullName,
      employeeNumber: initialData.escalation1User.appSuiteEmployeeMaster.employeeNumber
    } : null,
    second: initialData?.escalation2User ? {
      id: initialData.escalation2User.id,
      fullName: initialData.escalation2User.appSuiteEmployeeMaster.fullName,
      employeeNumber: initialData.escalation1User.appSuiteEmployeeMaster.employeeNumber
    } : null,
    third: initialData?.escalation3User ? {
      id: initialData.escalation3User.id,
      fullName: initialData.escalation3User.appSuiteEmployeeMaster.fullName,
      employeeNumber: initialData.escalation1User.appSuiteEmployeeMaster.employeeNumber
    } : null,
    fourth: initialData?.escalation4User ? {
      id: initialData.escalation4User.id,
      fullName: initialData.escalation4User.appSuiteEmployeeMaster.fullName,
      employeeNumber: initialData.escalation1User.appSuiteEmployeeMaster.employeeNumber
    } : null
  })

  const handleEscalationSelect = (level: keyof typeof escalations, user: any) => {
    setEscalation((prev) => ({
      ...prev,
      [level]: user,
    }));
  };

  const handleSave = async () => {
    setIsPending(true)
    const formData = {
      username: genUsername,
      emailAddress: email,
      companyId: selectedCompanyId,
      roleIds: selectedRoleIds,
      groupIds: selectedGroupIds,
      projectIds: selectedProjectIds,
      escalations: escalations,
      isEscalation: isEscalation,
      userId: initialData.id,
      isActive: isActive,
    }

    const response = await updateUser(initialData.id, formData)

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
    <div className="@container/main pt-10 pb-6">
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
                    <Input value={`${employeePersonalData?.fullName} (${initialData.employeeNumber})`} className="bg-muted" readOnly />
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
                      value={employeePersonalData?.firstName}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                    <Input
                      id="lastname"
                      value={employeePersonalData?.lastName}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="position">Position</FieldLabel>
                    <Input
                      id="position"
                      value={employeePersonalData?.position}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <Input
                      id="email"
                      defaultValue={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                        value={selectedCompanyId}
                        onValueChange={(value) => setSelectedCompanyId(value)}
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
                          {companies.map((company: any) => (
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
                        records={roles}
                        selectedIds={selectedRoleIds}
                        onChange={setSelectedRoleIds} />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <Input id="username" value={genUsername} onChange={(e) => setGenUsername(e.target.value)} />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="addEmail">Escalation</FieldLabel>
                      <div className="flex gap-3 items-center">
                        <Checkbox
                          id="isEscalation"
                          checked={isEscalation}
                          onCheckedChange={(checked: boolean) => setIsEscalation(checked)}
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
                      checked={isActive}
                      onCheckedChange={(checked: boolean) => setIsActive(checked)}
                    />
                    <FieldDescription>{isActive ? "Active" : "Inactive"}</FieldDescription>
                  </div>
                </Field>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-green-500/10 text-green-500 border-green-500">
              <Group size={16} />
            </div>
            <Label className="text-lg">Groups & Projects</Label>
          </div>

          <Card className="shadow-none">
            <CardContent>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                <Field>
                  <FieldLabel htmlFor="group">User Group</FieldLabel>
                  <MultiSelectCommand
                    records={groups}
                    selectedIds={selectedGroupIds}
                    onChange={setSelectedGroupIds} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="project">Project</FieldLabel>
                  <MultiSelectCommand
                    records={projects}
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
          <Button onClick={handleSave} disabled={isPending}>
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
    </div>
  );
}