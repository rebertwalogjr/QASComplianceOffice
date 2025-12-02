"use client"

import { useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SelectValue } from "@radix-ui/react-select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import NavigationMenu from "./navigation-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { File, LucideBadgeInfo, MegaphoneIcon, TextSelection, User2 } from "lucide-react";

export default function NewQASForm() {

  const handleSectionChange = (section: string) => {
    // TODO: Scroll to the corresponding section
  }

  return (
    <div className="@container/main py-6 bg-muted">

      <div className="flex flex-col gap-4 md:px-40">

        <div className="flex items-center gap-2">
          <div className="rounded-md border p-2 bg-primary/10 text-primary border-primary">
            <File size={16} />
          </div>
          <Label className="text-lg">Findings</Label>
        </div>

        <Card className="shadow-none">
          {/* <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-md border p-2 bg-primary/10 text-primary border-primary">
                <File size={16} />
              </div>
              Findings
            </CardTitle>
          </CardHeader> */}
          <CardContent>
            <FieldSet>
              <FieldGroup>

                <Field>
                  <FieldLabel htmlFor="auditor">Auditor</FieldLabel>
                  <Input id="auditor" placeholder="Auditor Name" readOnly />
                </Field>

                <Field>
                  <FieldLabel htmlFor="company">Company</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company-a">Company A</SelectItem>
                      <SelectItem value="company-b">Company B</SelectItem>
                      <SelectItem value="company-c">Company C</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FieldError>Please select company.</FieldError> */}
                </Field>

                <Field>
                  <FieldLabel htmlFor="project">Project</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-a">Project A</SelectItem>
                      <SelectItem value="project-b">Project B</SelectItem>
                      <SelectItem value="project-c">Project C</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FieldError>Please select project.</FieldError> */}
                </Field>

                <Field>
                  <FieldLabel htmlFor="auditreportno">Audit Report No.</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audit report..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-a">Audit Report 1</SelectItem>
                      <SelectItem value="project-b">Audit Report 2</SelectItem>
                      <SelectItem value="project-c">Audit Report 3</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FieldError>Please select project.</FieldError> */}
                </Field>

                <Field>
                  <FieldLabel htmlFor="findingType">Type of Finding</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-a">Non-conformance</SelectItem>
                      <SelectItem value="project-b">Positive Observation</SelectItem>
                      <SelectItem value="project-c">Action Item</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FieldError>Please select project.</FieldError> */}
                </Field>

                <Field>
                  <FieldLabel htmlFor="fingingCategory">Finding Category</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-a">Non-conformance</SelectItem>
                      <SelectItem value="project-b">Positive Observation</SelectItem>
                      <SelectItem value="project-c">Action Item</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FieldError>Please select project.</FieldError> */}
                </Field>

                <Field>
                  <FieldLabel htmlFor="manager">Manager</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-a">Non-conformance</SelectItem>
                      <SelectItem value="project-b">Positive Observation</SelectItem>
                      <SelectItem value="project-c">Action Item</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FieldError>Please select project.</FieldError> */}
                </Field>

                <Field>
                  <FieldLabel htmlFor="teamleader">Team Leader</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team leader..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-a">Non-conformance</SelectItem>
                      <SelectItem value="project-b">Positive Observation</SelectItem>
                      <SelectItem value="project-c">Action Item</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FieldError>Please select project.</FieldError> */}
                </Field>

                <Field>
                  <FieldLabel htmlFor="forClosing">Request for Closing</FieldLabel>
                  <div className="flex items-center gap-3">
                    <Checkbox id="forClosing" />
                    <Label>For Closing</Label>
                  </div>
                </Field>

              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          <div className="rounded-md border p-2 bg-cyan-500/10 text-cyan-500 border-cyan-500">
            <TextSelection size={16} />
          </div>
          <Label className="text-lg">Audit Information</Label>
        </div>

        <Card className="shadow-none">
          {/* <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-md border p-2 bg-cyan-500/10 text-cyan-500 border-cyan-500">
                <TextSelection size={16} />
              </div>
              Audit Information
            </CardTitle>
          </CardHeader> */}
          <CardContent>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="teamleader">Audit Engagement</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team leader..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-a">Non-conformance</SelectItem>
                      <SelectItem value="project-b">Positive Observation</SelectItem>
                      <SelectItem value="project-c">Action Item</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FieldError>Please select project.</FieldError> */}
                </Field>

                <Field>
                  <FieldLabel htmlFor="auditFindingNumber">Audit Finding No.</FieldLabel>
                  <Input id="auditFindingNumber" placeholder="Audit Finding Number" readOnly />
                </Field>

                <Field>
                  <FieldLabel htmlFor="datetimeIssued">Date and time issued</FieldLabel>
                  <Input id="datetimeIssued" placeholder="11/19/25 14:50" readOnly />
                </Field>

                <Field>
                  <FieldLabel htmlFor="datetimeTarget">Date and time issued</FieldLabel>
                  <Input id="datetimeTarget" placeholder="11/19/25 14:50" readOnly />
                </Field>

                <Field>
                  <FieldLabel htmlFor="teamleader">Audit Rating</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select audit rating..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-a">Non-conformance</SelectItem>
                      <SelectItem value="project-b">Positive Observation</SelectItem>
                      <SelectItem value="project-c">Action Item</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FieldError>Please select project.</FieldError> */}
                </Field>

                <Field>
                  <FieldLabel htmlFor="depthead">Project Manager / Department Head</FieldLabel>
                  <Input id="depthead" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="responsiblePerson">Responsible Person</FieldLabel>
                  <Input id="responsiblePerson" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="responsibleDept">Responsible Department</FieldLabel>
                  <Input id="responsibleDept" />
                </Field>

                <Field>
                  <FieldLabel htmlFor="recurringProcess">Recurring Per Process</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FieldError>Please select project.</FieldError> */}
                </Field>

                <Field>
                  <FieldLabel htmlFor="recurringPerson">Recurring Per Person</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FieldError>Please select project.</FieldError> */}
                </Field>

              </FieldGroup>
            </FieldSet>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          <div className="rounded-md border p-2 bg-green-500/10 text-green-500 border-green-500">
            <LucideBadgeInfo size={16} />
          </div>
          <Label className="text-lg">Additional Details</Label>
        </div>

        <Card className="shadow-none">
          {/* <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-md border p-2 bg-green-500/10 text-green-500 border-green-500">
                <LucideBadgeInfo size={16} />
              </div>
              Additional Details
            </CardTitle>
          </CardHeader> */}
          <CardContent>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="detailsOfFinding">Details of Finding</FieldLabel>
                  <FieldDescription>Criteria:</FieldDescription>
                  <Textarea id="criteria" placeholder="Type here.." rows={4} />
                  <FieldDescription>Findings:</FieldDescription>
                  <Textarea id="findings" placeholder="Type here.." rows={4} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="detailsOfFinding">Recommendations</FieldLabel>
                  <Textarea id="recommendations" placeholder="Type here.." rows={4} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="attachments">Attachments</FieldLabel>
                  <Input id="attachments" />
                </Field>

              </FieldGroup>

            </FieldSet>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2">
          <div className="rounded-md border p-2 bg-orange-500/10 text-orange-500 border-orange-500">
            <MegaphoneIcon size={16} />
          </div>
          <Label className="text-lg">Recipient & Escalations</Label>
        </div>

        <Card className="shadow-none">
          {/* <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="rounded-md border p-2 bg-orange-500/10 text-orange-500 border-orange-500">
                <MegaphoneIcon size={16} />
              </div>
              Recipient & Escalations
            </CardTitle>
          </CardHeader> */}
          <CardContent>
            <FieldSet>
              <FieldGroup>

                <Field>
                  <FieldLabel htmlFor="teamleader">Recipient Group</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient group..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-a">Non-conformance</SelectItem>
                      <SelectItem value="project-b">Positive Observation</SelectItem>
                      <SelectItem value="project-c">Action Item</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FieldError>Please select project.</FieldError> */}
                </Field>

                <Field>
                  <FieldLabel htmlFor="teamleader">Issued To</FieldLabel>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-a">Non-conformance</SelectItem>
                      <SelectItem value="project-b">Positive Observation</SelectItem>
                      <SelectItem value="project-c">Action Item</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FieldError>Please select project.</FieldError> */}
                </Field>

                <Field>
                  <FieldLabel htmlFor="firstEscalation">First Escation</FieldLabel>
                  <Input id="firstEscalation" placeholder="Juan Dela Cruz" readOnly />
                </Field>

                <Field>
                  <FieldLabel htmlFor="secondEscalation">Second Escation</FieldLabel>
                  <Input id="firstEscalation" placeholder="Juan Dela Cruz" readOnly />
                </Field>

                <Field>
                  <FieldLabel htmlFor="thirdEscalation">Third Escation</FieldLabel>
                  <Input id="firstEscalation" placeholder="Juan Dela Cruz" readOnly />
                </Field>

                <Field>
                  <FieldLabel htmlFor="fourthEscalation">Fourth Escation</FieldLabel>
                  <Input id="firstEscalation" placeholder="Juan Dela Cruz" readOnly />
                </Field>

              </FieldGroup>
            </FieldSet>

          </CardContent>
        </Card>

        <FieldGroup>

          <div className="flex item-center gap-4 justify-end py-2">
            <Button variant="outline">Cancel</Button>
            <Button type="submit">Submit</Button>
          </div>

        </FieldGroup>

      </div>


    </div>
  )
}