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
import { AppSuiteEmployeeMaster } from "../../../../../../generated/prisma/client";
import { generateUserName } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createUser } from "@/prisma-actions/user";
import { Spinner } from "@/components/ui/spinner";

type selectedEmployee = {
  employeeNumber: string
  firstName: string
  lastName: string
  emailAddress: string
  position: string
  fullName: string
} | null

export default function UserForm({ mode, companies, groups, projects, roles }: any) {
  const router = useRouter()

  const [isPending, setIsPending] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<selectedEmployee>(null)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("")
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([])
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>([])
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([])
  const [genUsername, setGenUsername] = useState("")
  const [email, setEmail] = useState<string>(selectedEmployee?.emailAddress || "")
  const [isEscalation, setIsEscalation] = useState<boolean>(false)
  const [escalations, setEscalation] = useState({
    first: null,
    second: null,
    third: null,
    fourth: null
  })

  const handleEmployeeSelect = (emp: selectedEmployee) => {
    setSelectedEmployee(emp)
    if (emp) {
      const username = generateUserName(emp.firstName, emp.lastName)
      setGenUsername(username)
    } else {
      setGenUsername("")
    }
  }

  const handleEscalationSelect = (level: keyof typeof escalations, user: any) => {
    setEscalation((prev) => ({
      ...prev,
      [level]: user,
    }))
  }

  const handleSubmit = async() => {
    setIsPending(true)
    const formData = {
      employeeNumber: selectedEmployee?.employeeNumber,
      username: genUsername,
      emailAddress: email,
      companyId: selectedCompanyId,
      roleIds: selectedRoleIds,
      groupIds: selectedGroupIds,
      projectIds: selectedProjectIds,
      escalations: escalations,
      isEscalation: isEscalation,
    }

    const response = await createUser(formData)

    if (response.error) {
      toast.error("Error: " + response.error)
    } else {
      toast.success("User created successfully!");
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
                    <EmployeeCommand onSelect={handleEmployeeSelect} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="empId">Employee Id</FieldLabel>
                    <Input
                      id="empId"
                      value={(selectedEmployee?.employeeNumber || "")}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="firtname">First Name</FieldLabel>
                    <Input
                      id="firtname"
                      value={(selectedEmployee?.firstName || "")}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                    <Input
                      id="lastname"
                      value={(selectedEmployee?.lastName || "")}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="position">Position</FieldLabel>
                    <Input
                      id="position"
                      value={(selectedEmployee?.position || "")}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <Input
                      id="email"
                      defaultValue={(selectedEmployee?.emailAddress || "")} 
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
                        value={selectedCompanyId?.toString()}
                        onValueChange={(value) => setSelectedCompanyId(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company..." />
                        </SelectTrigger>
                        <SelectContent
                         className="w-[calc(100vw-32px)] md:w-full p-0"
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
                    <EscalationCommand onSelect={(user) => handleEscalationSelect("first", user)} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="escalation">Second Escalation</FieldLabel>
                    <EscalationCommand onSelect={(user) => handleEscalationSelect("second", user)} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="escalation">Third Escalation</FieldLabel>
                    <EscalationCommand onSelect={(user) => handleEscalationSelect("third", user)} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="escalation">Fourth Escalation</FieldLabel>
                    <EscalationCommand onSelect={(user) => handleEscalationSelect("fourth", user)} />
                  </Field>

                </FieldGroup>

              </FieldSet>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" disabled={isPending} asChild><Link href="/qas/admin/users">Cancel</Link></Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            { isPending ? (
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