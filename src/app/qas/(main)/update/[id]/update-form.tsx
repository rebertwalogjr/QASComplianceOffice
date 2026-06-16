"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { File as FileIcon, Group, LucideBadgeInfo, MegaphoneIcon, TextSelection } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"
import { Session } from "next-auth"

import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload, Attachment } from "@/components/FileUpload"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"


import { ActiveAuditReportPayload } from "@/server-actions/audit-report"
import { ActiveCompanyPayload } from "@/server-actions/company"
import { ActiveEngagementPayload } from "@/server-actions/engagement"
import { ActiveFindingCategoryPayload } from "@/server-actions/finding-category"
import { ActiveFindingTypePayload } from "@/server-actions/finding-type"
import { ActiveGroupPayload } from "@/server-actions/group"
import { ActiveProjectPayload } from "@/server-actions/project"
import { ActiveAuditRatingPayload } from "@/server-actions/rating"
import { UserBasicPayload } from "@/server-actions/user"
import { TransactionPayload, updateTransaction } from "@/server-actions/transaction"
import { deleteTempFolderBySessionId } from "@/server-actions/files"
import { addDate } from "@/lib/utils-server"
import { cn } from "@/lib/utils"

interface EntryFormProps {
  initialData: TransactionPayload | null
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
  session: Session | null
}

export default function UpdateForm({ options }: { options: EntryFormProps }) {
  const router = useRouter()
  const isMobile = useIsMobile()

  const jobSchema = z.object({
    jobTransactionId: z.string(),
    companyId: z.string().min(1, "Please select a company"),
    projectId: z.string().min(1, "Please select a project"),
    auditEngagementId: z.string().min(1, "Please select an engagement"),
    typeOfFindingId: z.string().min(1, "Please select a finding type"),
    findingCategoryId: z.string().min(1, "Please select a finding category"),
    complianceOfficerId: z.string(),
    supervisorId: z.string().min(1, "Supervisor is required"),
    auditReportId: z.string().min(1, "Please select audit report"),
    issuedOn: z.string(),
    targetDate: z.string(),
    auditRatingId: z.string().min(1, "Please select audit rating"),
    projectManagerDepartmentHead: z.string().min(1, "Project Manager / Department is required"),
    responsibleDepartment: z.string().min(1, "Reponsible department is required"),
    responsiblePerson: z.string().min(1, "Responsible person is required"),
    recurringPerProcess: z.string().min(1, "Recurring process is required"),
    recurringPerPerson: z.string().min(1, "Recurring person is required"),
    recipientGroupId: z.string().min(1, "Please select recipient group"),
    recipientId: z.string().min(1, "Please select a recipient"),
    problemCriteria: z.string().min(1, "Please provide details"),
    problemFindings: z.string().min(1, "Please provide details"),
    recommendations: z.string().min(1, "Please provide details"),
  })

  type JobFormValues = z.infer<typeof jobSchema>

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting }, } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobTransactionId: options.initialData?.id.toString(),
      companyId: options.initialData?.companyId.toString(),
      projectId: options.initialData?.projectId.toString(),
      auditEngagementId: options.initialData?.auditEngagementId.toString(),
      typeOfFindingId: options.initialData?.typeOfFindingId.toString(),
      findingCategoryId: options.initialData?.findingCategoryId.toString(),
      complianceOfficerId: options.initialData?.complianceOfficerId.toString(),
      supervisorId: options.initialData?.supervisorId.toString(),
      auditReportId: options.initialData?.auditReportId.toString(),
      issuedOn: options.initialData?.issuedOn?.toDateString(),
      targetDate: options.initialData?.targetDate?.toDateString(),
      auditRatingId: options.initialData?.auditRatingId.toString(),
      projectManagerDepartmentHead: options.initialData?.projectManagerDepartmentHead?.toString(),
      responsibleDepartment: options.initialData?.responsibleDepartment?.toString(),
      responsiblePerson: options.initialData?.responsiblePerson?.toString(),
      recurringPerProcess: options.initialData?.recurringPerPerson ? "yes" : "no",
      recurringPerPerson: options.initialData?.recurringPerPerson ? "yes" : "no",
      recipientGroupId: options.initialData?.recipientGroupId?.toString(),
      recipientId: options.initialData?.recipientId?.toString(),
      problemCriteria: options.initialData?.problemCriteria?.toString(),
      problemFindings: options.initialData?.problemFindings?.toString(),
      recommendations: options.initialData?.recommendations?.toString(),
    }
  })

  const [sessionId, setSessionId] = useState<string>("")
  const [attachments, setAttachments] = useState<Attachment[]>([])

  const selectedCompanyId = watch("companyId")
  const selectedProjectId = watch("projectId")
  const selectedRecipientId = watch("recipientId")
  const selectedEngagementId = watch("auditEngagementId")

  useEffect(() => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      setSessionId(crypto.randomUUID())
    } else {
      const fallbackId = (Math.random().toString(36).substring(2) + Date.now().toString(36))
      setSessionId(fallbackId)
    }
    calculateSmartDate()
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

  const onSubmit = async (values: JobFormValues) => {

    const formData = new FormData()

    const activeAttachmentIds = attachments.filter((f) => f.isDbRecord && !f.isMarkedForDeletion).map((f) => f.id) //optional
    const deletedAttachmentIds = attachments.filter((f) => f.isDbRecord && f.isMarkedForDeletion).map((f) => f.id)

    const extendedPayload = {
      ...values,
      activeAttachmentIds,
      deletedAttachmentIds
    }


    formData.append("payload", JSON.stringify(extendedPayload))
    formData.append("sessionId", sessionId)

    attachments.forEach((fileItem) => {
      if (!fileItem.isDbRecord && fileItem.file) {
        formData.append("attachments", fileItem.file)
      }
    })

    const response = await updateTransaction(formData)

    if (response.error) {
      toast.error("Error: " + response.error)
    } else {
      toast.success("Transaction updated successfully!", { position: "top-center" });
      router.refresh()
      router.push(`/qas/${response.data.id}`)
    }
  }

  const handleCancel = async () => {
    try {
      await deleteTempFolderBySessionId(sessionId)
      setTimeout(() => {
        router.push(`/qas/${options.initialData?.id}`);
        router.refresh();
      }, 100);
    } catch (error) {
      toast.error("Failed to clean up temporary files.")
    }
  }

  const calculateSmartDate = async () => {
    // if (datetimeIssued) {
    //   const smartDate = await addDate(datetimeIssued, 2);
    //   setValue("targetDate", smartDate.toDateString());
    // }
  }

  if (!sessionId) return null

  return (
    <form className={cn(`flex flex-col gap-4 ${isMobile ? "px-4" : "px-20"} lg:px-40`)} onSubmit={handleSubmit(onSubmit)}>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="flex flex-col gap-4">

          <div className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-primary/10 text-primary border-primary">
              <FileIcon size={16} />
            </div>
            <Label className="text-lg">Findings</Label>
          </div>

          <Card className="shadow-none">
            <CardContent>
              <FieldSet>
                <FieldGroup>

                  <Field>
                    <Input {...register("jobTransactionId")} value={options.initialData?.id} hidden readOnly />
                  </Field>

                  <Field>
                    <FieldLabel>Compliance Secretariat</FieldLabel>
                    <Input value={`${options.session?.user.name} (${options.session?.user.employeeNumber})`} disabled />
                  </Field>

                  <Field>
                    <FieldLabel>Company</FieldLabel>
                    <Input value={options.initialData?.company.name} disabled />
                  </Field>

                  <Field>
                    <FieldLabel>Project</FieldLabel>
                    <Input value={options.initialData?.project.name} disabled />
                  </Field>

                  <Field>
                    <FieldLabel>Type of Finding</FieldLabel>
                    <Controller
                      name="typeOfFindingId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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
                      )}
                    />
                    {errors.typeOfFindingId && <p className="text-xs text-destructive mt-1">{errors.typeOfFindingId.message}</p>}
                  </Field>

                  <Field>
                    <FieldLabel>Finding Category</FieldLabel>
                    <Controller
                      name="findingCategoryId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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
                      )}
                    />
                    {errors.findingCategoryId && <p className="text-xs text-destructive mt-1">{errors.findingCategoryId.message}</p>}
                  </Field>

                  <Field>
                    <FieldLabel>Compliance Officer</FieldLabel>
                    <Input value={options.initialData?.complianceOfficer.appSuiteEmployeeMaster.fullName} disabled />
                  </Field>

                  <Field>
                    <FieldLabel>Supervisor</FieldLabel>
                    <Input value={options.initialData?.supervisor.appSuiteEmployeeMaster.fullName} disabled />
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
                    <FieldLabel>Audit Engagement</FieldLabel>
                    <Controller
                      name="auditEngagementId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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

                      )}
                    />
                    {errors.auditEngagementId && <p className="text-xs text-destructive mt-1">{errors.auditEngagementId.message}</p>}
                  </Field>

                  <Field>
                    <FieldLabel>Audit Report No.</FieldLabel>
                    <Controller
                      name="auditReportId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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
                      )}
                    />
                    {errors.auditReportId && <p className="text-xs text-destructive mt-1">{errors.auditReportId.message}</p>}
                  </Field>

                  {/* <Field>
                    <FieldLabel htmlFor="auditFindingNumber">Audit Finding No.</FieldLabel>
                    <Input name="auditFindingNumber" placeholder="Audit Finding Number" readOnly />
                  </Field> */}

                  <Field>
                    <FieldLabel>Date and time issued</FieldLabel>
                    {/* <Input name="datetimeIssued" placeholder={datetimeIssued?.toDateString()} readOnly /> */}
                    <Input {...register("issuedOn")} readOnly />
                    {errors.issuedOn && <p className="text-xs text-destructive mt-1">{errors.issuedOn.message}</p>}
                  </Field>

                  <Field>
                    <FieldLabel>Target Date</FieldLabel>
                    {/* <Input name="datetimeTarget" placeholder={targetDate?.toDateString()} readOnly /> */}
                    <Input {...register("targetDate")} readOnly />
                    {errors.targetDate && <p className="text-xs text-destructive mt-1">{errors.targetDate.message}</p>}
                  </Field>

                  <Field>
                    <FieldLabel>Audit Rating</FieldLabel>
                    <Controller
                      name="auditRatingId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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
                      )}
                    />
                    {errors.auditRatingId && <p className="text-xs text-destructive mt-1">{errors.auditRatingId.message}</p>}
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
                    <FieldLabel>Recipient Group</FieldLabel>
                    <Controller
                      name="recipientGroupId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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
                      )}
                    />
                    {errors.recipientGroupId && <p className="text-xs text-destructive mt-1">{errors.recipientGroupId.message}</p>}
                  </Field>

                  <Field>
                    <FieldLabel>Issued To</FieldLabel>
                    <Controller
                      name="recipientId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                      )}
                    />
                    {errors.recipientId && <p className="text-xs text-destructive mt-1">{errors.recipientId.message}</p>}
                  </Field>

                  <Field>
                    <FieldLabel>First Escation</FieldLabel>
                    <Input
                      name="firstEscalation"
                      placeholder="N/A"
                      value={activeRecipient?.escalation1User ? `${activeRecipient?.escalation1User?.appSuiteEmployeeMaster.fullName} (${activeRecipient?.escalation1User?.appSuiteEmployeeMaster.employeeNumber}) ` : "N/A"}
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel>Second Escation</FieldLabel>
                    <Input
                      name="secondEscalation"
                      placeholder="N/A"
                      value={activeRecipient?.escalation2User ? `${activeRecipient?.escalation2User?.appSuiteEmployeeMaster.fullName} (${activeRecipient?.escalation2User?.appSuiteEmployeeMaster.employeeNumber}) ` : "N/A"}
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel>Third Escation</FieldLabel>
                    <Input
                      name="thirdEscalation"
                      placeholder="N/A"
                      value={activeRecipient?.escalation3User ? `${activeRecipient?.escalation3User?.appSuiteEmployeeMaster.fullName} (${activeRecipient?.escalation3User?.appSuiteEmployeeMaster.employeeNumber}) ` : "N/A"}
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel>Fourth Escation</FieldLabel>
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
                    <FieldLabel>Project Manager / Department Head</FieldLabel>
                    <Input {...register("projectManagerDepartmentHead")} />
                    {errors.projectManagerDepartmentHead && <p className="text-xs text-destructive mt-1">{errors.projectManagerDepartmentHead.message}</p>}
                  </Field>

                  <Field>
                    <FieldLabel>Responsible Person</FieldLabel>
                    <Input {...register("responsiblePerson")} />
                    {errors.responsiblePerson && <p className="text-xs text-destructive mt-1">{errors.responsiblePerson.message}</p>}
                  </Field>

                  <Field>
                    <FieldLabel>Responsible Department</FieldLabel>
                    <Input {...register("responsibleDepartment")} />
                    {errors.responsibleDepartment && <p className="text-xs text-destructive mt-1">{errors.responsibleDepartment.message}</p>}
                  </Field>

                  <Field>
                    <FieldLabel>Recurring Per Process</FieldLabel>
                    <Controller
                      name="recurringPerProcess"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select item..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.recurringPerProcess && <p className="text-xs text-destructive mt-1">{errors.recurringPerProcess.message}</p>}
                  </Field>

                  <Field>
                    <FieldLabel>Recurring Per Person</FieldLabel>
                    <Controller
                      name="recurringPerPerson"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select item..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.recurringPerPerson && <p className="text-xs text-destructive mt-1">{errors.recurringPerPerson.message}</p>}
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
                <FieldLabel>Details of Finding</FieldLabel>
                <FieldDescription>Criteria:</FieldDescription>
                <Textarea {...register("problemCriteria")} placeholder="Type here.." rows={4} />
                {errors.problemCriteria && <p className="text-xs text-destructive mt-1">{errors.problemCriteria.message}</p>}
                <FieldDescription>Findings:</FieldDescription>
                <Textarea {...register("problemFindings")} placeholder="Type here.." rows={4} />
                {errors.problemFindings && <p className="text-xs text-destructive mt-1">{errors.problemFindings.message}</p>}
              </Field>

              <Field>
                <FieldLabel>Recommendations</FieldLabel>
                <Textarea {...register("recommendations")} placeholder="Type here.." rows={4} />
                {errors.recommendations && <p className="text-xs text-destructive mt-1">{errors.recommendations.message}</p>}
              </Field>

              <Field>
                <FieldLabel>Attachments</FieldLabel>
                <FileUpload
                  sessionId={sessionId}
                  onFilesChange={setAttachments}
                  initialAttachments={options.initialData?.attachments.filter(att => att.isActive)}
                />
              </Field>

            </FieldGroup>

          </FieldSet>
        </CardContent>
      </Card>

      <FieldGroup>

        <div className="flex items-center gap-4 justify-end py-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                This will cancel the modification of this record and permanently delete all uploaded attachments from the temporary server.
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant="outline">No</Button>
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isSubmitting ? "Cleaning up..." : "Proceed"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
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