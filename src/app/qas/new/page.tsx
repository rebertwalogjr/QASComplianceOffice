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

export default function NewQASForm() {

  const handleSectionChange = (section: string) => {
    // TODO: Scroll to the corresponding section
  }

  return (
    <div className="@container/main flex h-full">
      {/* <div className="flex h-full"> */}

      {/* NAVIGATION */}
      <div className="flex flex-col p-8 w-xs gap-8">
        <NavigationMenu onSectionChange={handleSectionChange} />
      </div>

      <Separator orientation="vertical" className="mx-2" />

      {/* FORM */}
      <div className="p-2 flex-1">
        <ScrollArea className="h-[calc(100vh-72px)] p-4">
          <FieldGroup>
            <FieldSet>
              {/* <FieldLegend>Findings</FieldLegend>
              <FieldDescription>Complete all require fields.</FieldDescription> */}
              <h1 className="text-lg font-bold">Findings</h1>
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

            <FieldSeparator />

            <FieldSet>
              {/* <FieldLegend>Audit Info.</FieldLegend>
              <FieldDescription>Complete all require fields.</FieldDescription> */}
              <h1 className="text-lg font-bold">Audit Information</h1>
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

            <FieldSeparator />

            <FieldSet>
              {/* <FieldLegend>Additional Details</FieldLegend>
              <FieldDescription>Complete all require fields.</FieldDescription> */}
              <h1 className="text-lg font-bold">Additional Details</h1>
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

            <FieldSeparator />

            <FieldSet>
              {/* <FieldLegend>Responsible Person</FieldLegend>
              <FieldDescription>Complete all require fields.</FieldDescription> */}
              <h1 className="text-lg font-bold">Responsible Person</h1>
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
              </FieldGroup>
            </FieldSet>

            <FieldSeparator />

            <FieldSet>
              {/* <FieldLegend>Escalations</FieldLegend>
              <FieldDescription>Complete all require fields.</FieldDescription> */}
              <h1 className="text-lg font-bold">Escalations</h1>
              <FieldGroup>

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

            <div className="flex item-center gap-4 justify-end py-2">
              <Button variant="secondary">Cancel</Button>
              <Button type="submit">Submit</Button>
            </div>

          </FieldGroup>
        </ScrollArea>
      </div>

      <Separator orientation="vertical" className="mx-2" />

      {/* RIGHT PANEL */}
      <div className="flex flex-col p-6 w-sm gap-8">

      </div>

    </div>
    // </div>
  )
}