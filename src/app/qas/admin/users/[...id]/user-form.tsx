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


export default function UserForm({ mode, initialData, companies, groups, projects }: any) {
  const isFormModeEdit = mode === "edit"
  const [selectedEmp, setSelectedEmp] = useState(initialData || "")
  const [selectedEsc1, setSelectedEsc1] = useState(initialData || "")
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>(
    initialData?.groups?.map((g: any) => g.id) || []
  );
  const [selectedProjectIds, setSelectedProjectIds] = useState<number[]>(
    initialData?.project?.map((g: any) => g.id) || []
  );

  const handleEmployeeSelect = (empNum: string) => {
    setSelectedEmp(empNum);
  };

  const handleEsclation1Select = (empNum: string) => {
    setSelectedEsc1(empNum)
  }

  return (
    <div className="@container/main pt-10 pb-6">
      <div className="flex flex-col gap-8 px-3 md:px-32">

        <div className="grid grid-cols-2 gap-8">
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
                    {isFormModeEdit ?
                      <Input value={`${initialData.appSuiteEmployeeMaster.fullName} (${initialData.employeeNumber})`} className="bg-muted" readOnly /> :
                      <EmployeeCommand onSelect={handleEmployeeSelect} />
                    }
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="empId">Employee Id</FieldLabel>
                    <Input
                      id="empId"
                      value={isFormModeEdit ? initialData?.employeeNumber : (selectedEmp?.employeeNumber || "")}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="firtname">First Name</FieldLabel>
                    <Input
                      id="firtname"
                      value={isFormModeEdit ? initialData.appSuiteEmployeeMaster?.firstName : (selectedEmp?.firstName || "")}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                    <Input
                      id="lastname"
                      value={isFormModeEdit ? initialData.appSuiteEmployeeMaster?.lastName : (selectedEmp?.lastName || "")}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="position">Position</FieldLabel>
                    <Input
                      id="position"
                      value={isFormModeEdit ? initialData?.position : (selectedEmp?.position || "")}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <Input
                      id="email"
                      defaultValue={isFormModeEdit ? initialData?.emailAddress : (selectedEmp?.emailAddress || "")} />
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
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company..." />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company: any) => (
                            <SelectItem key={company.id} value={company.id.toString()}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="userlevel">User Level</FieldLabel>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="level-a">Compliance Secretariat</SelectItem>
                          <SelectItem value="level-b">Compliance Officer</SelectItem>
                          <SelectItem value="level-c">Supervisor</SelectItem>
                          <SelectItem value="level-d">Recipient</SelectItem>
                          <SelectItem value="level-e">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <Input id="username" />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="addEmail">Escalation</FieldLabel>
                      <div className="flex gap-3 items-center">
                        <Checkbox />
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
              <div className="grid grid-cols-2 gap-8">
                <Field>
                  <FieldLabel htmlFor="group">User Group</FieldLabel>
                  <MultiSelectCommand
                    groups={groups}
                    selectedIds={selectedGroupIds}
                    onChange={setSelectedGroupIds} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="project">Project</FieldLabel>
                  <MultiSelectCommand
                    groups={projects}
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
                    <EscalationCommand onSelect={handleEsclation1Select} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="escalation">Second Escalation</FieldLabel>
                    <EscalationCommand onSelect={handleEsclation1Select} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="escalation">Third Escalation</FieldLabel>
                    <EscalationCommand onSelect={handleEsclation1Select} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="escalation">Fourth Escalation</FieldLabel>
                    <EscalationCommand onSelect={handleEsclation1Select} />
                  </Field>

                </FieldGroup>

              </FieldSet>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild><Link href="/qas/admin/users">Cancel</Link></Button>
          <Button type="submit">Save User</Button>
        </div>
      </div>
    </div>
  );
}