import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlarmCheck, FolderLock, Megaphone, User } from "lucide-react";
import Link from "next/link";
import React from "react";

type UserFormProps = {
  mode: "create" | "edit"
  id?: string
}

export default function UserForm({mode, id} : UserFormProps) {
  return (
    <div className="@container/main py-6 bg-muted">
      <div className="flex flex-col gap-4 md:px-40">

        <div className="flex items-center gap-2">
          <div className="rounded-md border p-2 bg-primary/10 text-primary border-primary">
            <User size={16} />
          </div>
          <Label className="text-lg">Personal Information</Label>
        </div>

        {/* User Information */}
        <Card className="shadow-none">
          <CardContent>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="employee">Employee</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emp-a">Juan</SelectItem>
                      <SelectItem value="emp-b">Pedro</SelectItem>
                      <SelectItem value="emp-c">Alvaro</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="empId">Employee Id</FieldLabel>
                  <Input id="empId" readOnly />
                </Field>

                <Field>
                  <FieldLabel htmlFor="firtname">First Name</FieldLabel>
                  <Input id="firtname" readOnly />
                </Field>

                <Field>
                  <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                  <Input id="lastname" readOnly />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <Input id="email" readOnly />
                </Field>

                <Field>
                  <FieldLabel htmlFor="position">Position</FieldLabel>
                  <Input id="position" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="addEmail">Email Address (optional)</FieldLabel>
                  <Input id="addEmail" />
                </Field>

              </FieldGroup>

            </FieldSet>
          </CardContent>
        </Card>

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
                      <SelectItem value="comp-a">Company A</SelectItem>
                      <SelectItem value="comp-b">Company B</SelectItem>
                      <SelectItem value="comp-c">Company C</SelectItem>
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
                  <Input id="username" readOnly />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input id="password" readOnly />
                </Field>

                <Field>
                  <FieldLabel htmlFor="group">User Group</FieldLabel>
                  <Input id="group" readOnly />
                </Field>

                <Field>
                  <FieldLabel htmlFor="project">Project</FieldLabel>
                  <Input id="project" />
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
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select first escalation..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="escalation-a">Juan</SelectItem>
                      <SelectItem value="escalation-b">Pedro</SelectItem>
                      <SelectItem value="escalation-c">Alvaro C</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="escalation">Second Escalation</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select second escalation..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="escalation-a">Juan</SelectItem>
                      <SelectItem value="escalation-b">Pedro</SelectItem>
                      <SelectItem value="escalation-c">Alvaro C</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="escalation">Third Escalation</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select third escalation..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="escalation-a">Juan</SelectItem>
                      <SelectItem value="escalation-b">Pedro</SelectItem>
                      <SelectItem value="escalation-c">Alvaro C</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="escalation">Fourth Escalation</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fourth escalation..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="escalation-a">Juan</SelectItem>
                      <SelectItem value="escalation-b">Pedro</SelectItem>
                      <SelectItem value="escalation-c">Alvaro C</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

              </FieldGroup>

            </FieldSet>
          </CardContent>
        </Card>

        <FieldGroup>
          <div className="flex item-center gap-4 justify-end py-2">
            <Button variant="outline">
              <Link href={`/qas/admin/users`}>Cancel</Link>
            </Button>
            <Button type="submit">Save User</Button>
          </div>
        </FieldGroup>

      </div>
    </div>
  );
}