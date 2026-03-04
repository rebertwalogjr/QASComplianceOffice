"use client"

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { File, Group, LucideBadgeInfo, MegaphoneIcon, TextSelection } from "lucide-react";

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUpload, FileWithPreview } from "@/components/FileUpload";
import { Spinner } from "@/components/ui/spinner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { ActiveCompanyPayload } from "@/server-actions/company";
import { ActiveProjectPayload } from "@/server-actions/project";
import { ActiveEngagementPayload } from "@/server-actions/engagement";
import { ActiveFindingTypePayload } from "@/server-actions/finding-type";
import { ActiveFindingCategoryPayload } from "@/server-actions/finding-category";
import { ActiveGroupPayload } from "@/server-actions/group";
import { UserBasicPayload } from "@/server-actions/user";
import { ActiveAuditRatingPayload } from "@/server-actions/rating";
import { ActiveAuditReportPayload } from "@/server-actions/audit-report";
import { createTransaction } from "@/server-actions/transaction";
import { deleteTempFolderBySessionId } from "@/server-actions/files";

interface EntryFormProps {
  companies: ActiveCompanyPayload[] | null
  projects: ActiveProjectPayload[] | null
  engagements: ActiveEngagementPayload[] | null
  findings: ActiveFindingTypePayload[] | null
  categories: ActiveFindingCategoryPayload[] | null
  groups: ActiveGroupPayload[] | null
  officers: UserBasicPayload[] | null
  supervisors: UserBasicPayload[] | null
  recipients: UserBasicPayload[] | null
  ratings: ActiveAuditRatingPayload[] | null
  reports: ActiveAuditReportPayload[] | null
}

export default function EntryForm({ options }: { options: EntryFormProps }) {
  const router = useRouter()
  const [sessionId, setSessionId] = useState<string>("")
  const [isPending, setIsPending] = useState(false)
  const [attachments, setAttachments] = useState<FileWithPreview[]>([])

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("")
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>("")
  const [selectedEngagementId, setSelectedEngagementId] = useState<string>("")

  useEffect(() => {
    setSessionId(crypto.randomUUID())
  }, [])

  const filtered = useMemo(() => {
    if (!selectedCompanyId) return { projects: [], engagements: [], officers: [], supervisors: [] }
    const cid = Number(selectedCompanyId)
    return {
      projects: options.projects?.filter(p => p.companyId === cid) || [],
      engagements: options.engagements?.filter(e => e.companyId === cid) || [],
      officers: options.officers?.filter(o => o.company?.id === cid) || [],
      supervisors: options.supervisors?.filter(s => s.company?.id === cid) || [],
      ratings: options.ratings?.filter(r => r.companyId === cid) || []
    }
  }, [selectedCompanyId, options])

  const filteredRecipientGroup = useMemo(() => {
    if (!selectedProjectId) return { groups: [], recipients: [] }
    const pid = Number(selectedProjectId)
    return {
      groups: options.groups?.filter(g => g.projectId === pid) || [],
      // recipients: options.recipients?.filter(r => r.userProjects.some(up => up.projectId === pid)) || [],
      recipients: options.recipients?.filter(recipient =>
        recipient.userGroups.some(ug =>
          options.groups?.find(g => g.id === ug.groupId)?.projectId === pid)
      )
    }
  }, [selectedProjectId, options])

  const filteredReports = useMemo(() => {
    return options.reports?.filter(r => r.auditEngagementId.toString() === selectedEngagementId)
  }, [selectedEngagementId, options.reports])

  const activeRecipient = useMemo(() => {
    return options.recipients?.find(r => r.id.toString() === selectedRecipientId);
  }, [selectedRecipientId, options.recipients]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)

    formData.append("sessionId", sessionId)

    attachments.forEach((fileItem) => {
      formData.append("attachments", fileItem.file)
    })

    const response = await createTransaction(formData)

    if (response.error) {
      toast.error("Error: " + response.error)
    } else {
      toast.success("Transaction created successfully!");
      router.push("/qas")
      router.refresh()
    }

    setIsPending(false)
  }

  const handleCancel = async () => {
    try {
      setIsPending(true)
      await deleteTempFolderBySessionId(sessionId)
      setTimeout(() => {
        router.push("/qas");
        router.refresh();
      }, 100);
    } catch (error) {
      toast.error("Failed to clean up temporary files.")
    }
    setIsPending(false)
  }

  if (!sessionId) return null

  return (
    <form className="flex flex-col gap-4 md:px-40" onSubmit={handleSubmit}>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">

        <div className="flex flex-col gap-4">

          <div className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-primary/10 text-primary border-primary">
              <File size={16} />
            </div>
            <Label className="text-lg">Findings</Label>
          </div>

          <Card className="shadow-none">
            <CardContent>
              <FieldSet>
                <FieldGroup>

                  {/* <Field>
                    <FieldLabel htmlFor="complianceSecretariatId">Compliance Secretariat</FieldLabel>
                    <Input name="complianceSecretariat" placeholder="Rebert L. Walog Jr (9112154)" value="1002" readOnly />
                  </Field> */}

                  <Field>
                    <FieldLabel htmlFor="company">Company</FieldLabel>
                    <Select
                      name="company"
                      required
                      value={selectedCompanyId}
                      onValueChange={(value) => setSelectedCompanyId(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company..." />
                      </SelectTrigger>
                      <SelectContent>
                        {options.companies?.map((company) => (
                          <SelectItem key={company.id} value={company.id.toString()}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FieldError>Please select company.</FieldError> */}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="project">Project</FieldLabel>
                    <Select
                      name="project"
                      required
                      value={selectedProjectId}
                      onValueChange={(value) => setSelectedProjectId(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filtered.projects?.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FieldError>Please select project.</FieldError> */}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="findingType">Type of Finding</FieldLabel>
                    <Select name="findingType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item..." />
                      </SelectTrigger>
                      <SelectContent>
                        {options.findings?.map((finding) => (
                          <SelectItem key={finding.id} value={finding.id.toString()}>
                            {finding.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FieldError>Please select project.</FieldError> */}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="fingingCategory">Finding Category</FieldLabel>
                    <Select name="findingCategory" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item..." />
                      </SelectTrigger>
                      <SelectContent>
                        {options.categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FieldError>Please select project.</FieldError> */}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="manager">Compliance Officer</FieldLabel>
                    <Select name="complianceOfficer" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select compliance officer..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filtered.officers?.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()} >
                            {p.appSuiteEmployeeMaster.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FieldError>Please select project.</FieldError> */}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="supervisor">Supervisor</FieldLabel>
                    <Select name="supervisor" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supervisor..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filtered.supervisors?.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()} >
                            {p.appSuiteEmployeeMaster.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FieldError>Please select project.</FieldError> */}
                  </Field>

                </FieldGroup>
              </FieldSet>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-cyan-500/10 text-cyan-500 border-cyan-500">
              <TextSelection size={16} />
            </div>
            <Label className="text-lg">Audit Information</Label>
          </div>

          <Card className="shadow-none">
            <CardContent>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="auditEngagement">Audit Engagement</FieldLabel>
                    <Select
                      name="auditEngagement"
                      required
                      onValueChange={(value) => setSelectedEngagementId(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select engagement..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filtered.engagements?.map((engagement) => (
                          <SelectItem key={engagement.id} value={engagement.id.toString()}>
                            {engagement.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FieldError>Please select project.</FieldError> */}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="auditreportno">Audit Report No.</FieldLabel>
                    <Select name="auditReport" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audit report..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredReports?.map(r => (
                          <SelectItem key={r.id} value={r.id.toString()}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FieldError>Please select project.</FieldError> */}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="auditFindingNumber">Audit Finding No.</FieldLabel>
                    <Input name="auditFindingNumber" placeholder="Audit Finding Number" readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="datetimeIssued">Date and time issued</FieldLabel>
                    <Input name="datetimeIssued" placeholder="11/19/25 14:50" readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="datetimeTarget">Date and time issued</FieldLabel>
                    <Input name="datetimeTarget" placeholder="11/19/25 14:50" readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="auditRating">Audit Rating</FieldLabel>
                    <Select name="auditRating" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audit rating..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filtered.ratings?.map(r => (
                          <SelectItem key={r.id} value={r.id.toString()}>
                            {r.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FieldError>Please select project.</FieldError> */}
                  </Field>



                </FieldGroup>
              </FieldSet>
            </CardContent>
          </Card>
        </div>

      </div>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mt-4">
            <div className="rounded-md border p-2 bg-orange-500/10 text-orange-500 border-orange-500">
              <MegaphoneIcon size={16} />
            </div>
            <Label className="text-lg">Recipient & Escalation</Label>
          </div>

          <Card className="shadow-none">
            <CardContent>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="recipientGroup">Recipient Group</FieldLabel>
                    <Select name="recipientGroup" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient group..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredRecipientGroup.groups.map(g => (
                          <SelectItem key={g.id} value={g.id.toString()}>
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FieldError>Please select project.</FieldError> */}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="recipient">Issued To</FieldLabel>
                    <Select
                      name="recipient"
                      required
                      onValueChange={(value) => setSelectedRecipientId(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient..." />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredRecipientGroup.recipients?.map(r => (
                          <SelectItem key={r.id} value={r.id.toString()}>
                            {r.appSuiteEmployeeMaster.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FieldError>Please select project.</FieldError> */}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="firstEscalation">First Escation</FieldLabel>
                    <Input
                      name="firstEscalation"
                      placeholder="N/A"
                      value={activeRecipient?.escalation1User ? `${activeRecipient?.escalation1User?.appSuiteEmployeeMaster.fullName} (${activeRecipient?.escalation1User?.appSuiteEmployeeMaster.employeeNumber}) ` : "N/A"}
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="secondEscalation">Second Escation</FieldLabel>
                    <Input
                      name="secondEscalation"
                      placeholder="N/A"
                      value={activeRecipient?.escalation2User ? `${activeRecipient?.escalation2User?.appSuiteEmployeeMaster.fullName} (${activeRecipient?.escalation2User?.appSuiteEmployeeMaster.employeeNumber}) ` : "N/A"}
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="thirdEscalation">Third Escation</FieldLabel>
                    <Input
                      name="thirdEscalation"
                      placeholder="N/A"
                      value={activeRecipient?.escalation3User ? `${activeRecipient?.escalation3User?.appSuiteEmployeeMaster.fullName} (${activeRecipient?.escalation3User?.appSuiteEmployeeMaster.employeeNumber}) ` : "N/A"}
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="fourthEscalation">Fourth Escation</FieldLabel>
                    <Input
                      name="fourthEscalation"
                      placeholder="N/A"
                      value={activeRecipient?.escalation4User ? `${activeRecipient?.escalation4User?.appSuiteEmployeeMaster.fullName} (${activeRecipient?.escalation4User?.appSuiteEmployeeMaster.employeeNumber}) ` : "N/A"}
                      readOnly />
                  </Field>
                </FieldGroup>
              </FieldSet>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mt-4">
            <div className="rounded-md border p-2 bg-yellow-500/10 text-yellow-500 border-yellow-500">
              <Group size={16} />
            </div>
            <Label className="text-lg">Responsible Person</Label>
          </div>

          <Card className="shadow-none">
            <CardContent>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="projectHead">Project Manager / Department Head</FieldLabel>
                    <Input name="projectHead" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="responsiblePerson">Responsible Person</FieldLabel>
                    <Input name="responsiblePerson" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="responsibleDepartment">Responsible Department</FieldLabel>
                    <Input name="responsibleDepartment" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="recurringPerProcess">Recurring Per Process</FieldLabel>
                    <Select name="recurringPerProcess" required>
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
                    <FieldLabel htmlFor="recurringPerPerson">Recurring Per Person</FieldLabel>
                    <Select name="recurringPerPerson" required>
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
        </div>
      </div>


      <div className="flex items-center gap-2 mt-4">
        <div className="rounded-md border p-2 bg-green-500/10 text-green-500 border-green-500">
          <LucideBadgeInfo size={16} />
        </div>
        <Label className="text-lg">Additional Details</Label>
      </div>

      <Card className="shadow-none">
        <CardContent>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="detailsOfFinding">Details of Finding</FieldLabel>
                <FieldDescription>Criteria:</FieldDescription>
                <Textarea name="criteria" placeholder="Type here.." rows={4} />
                <FieldDescription>Findings:</FieldDescription>
                <Textarea name="findings" placeholder="Type here.." rows={4} />
              </Field>

              <Field>
                <FieldLabel htmlFor="detailsOfFinding">Recommendations</FieldLabel>
                <Textarea name="recommendations" placeholder="Type here.." rows={4} />
              </Field>

              <Field>
                <FieldLabel htmlFor="attachments">Attachments</FieldLabel>
                {/* <Input name="attachments" /> */}
                <FileUpload sessionId={sessionId} onFilesChange={setAttachments} />
              </Field>

            </FieldGroup>

          </FieldSet>
        </CardContent>
      </Card>

      <FieldGroup>

        <div className="flex items-center gap-4 justify-end py-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                This will cancel the creation of this record and permanently delete all uploaded attachments from the temporary server.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline">No</Button>
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isPending ? "Cleaning up..." : "Proceed"}
                </AlertDialogAction>
                {/* <Button
                  variant="default"
                  onClick={handleCancel}>
                  Yes
                </Button> */}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

      </FieldGroup>

    </form>
  )
}