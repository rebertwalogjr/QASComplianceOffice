"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { File, Group, LucideBadgeInfo, MegaphoneIcon, TextSelection } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"
import { Session } from "next-auth"

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileUpload, Attachment } from "@/components/FileUpload"
import { Spinner } from "@/components/ui/spinner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { ActiveCompanyPayload } from "@/server-actions/company"
import { ActiveProjectPayload } from "@/server-actions/project"
import { ActiveEngagementPayload } from "@/server-actions/engagement"
import { ActiveFindingTypePayload } from "@/server-actions/finding-type"
import { ActiveFindingCategoryPayload } from "@/server-actions/finding-category"
import { ActiveGroupPayload } from "@/server-actions/group"
import { UserBasicPayload } from "@/server-actions/user"
import { ActiveAuditRatingPayload } from "@/server-actions/rating"
import { ActiveAuditReportPayload } from "@/server-actions/audit-report"
import { createTransaction } from "@/server-actions/transaction"
import { deleteTempFolderBySessionId } from "@/server-actions/files"
import { cn, toUTCMidnight } from "@/lib/utils"
import { addDate } from "@/lib/utils-server"
import { triggerDatabaseMail } from "@/lib/mail-service"

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
  session: Session | null
}

export default function EntryForm({ options }: { options: EntryFormProps }) {
  const router = useRouter()
  const isMobile = useIsMobile()

  const jobSchema = z.object({
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

  const datetimeIssued = toUTCMidnight(new Date())
  const tempTargetDate = new Date(datetimeIssued?.getTime() || Date.now())
  tempTargetDate.setDate(tempTargetDate.getDate() + 2)
  const targetDate = toUTCMidnight(tempTargetDate)

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting }, } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      companyId: "",
      projectId: "",
      auditEngagementId: "",
      typeOfFindingId: "",
      findingCategoryId: "",
      complianceOfficerId: "",
      supervisorId: "",
      auditReportId: "",
      issuedOn: datetimeIssued?.toDateString(),
      // targetDate: targetDate?.toDateString(),
      targetDate: "",
      auditRatingId: "",
      projectManagerDepartmentHead: "",
      responsibleDepartment: "",
      responsiblePerson: "",
      recurringPerProcess: "",
      recurringPerPerson: "",
      recipientGroupId: "",
      recipientId: "",
      problemCriteria: "",
      problemFindings: "",
      recommendations: "",
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
    const year = new Date().getFullYear()
    const month = (new Date().getUTCMonth() + 1)
    return options.reports?.filter(r => r.auditEngagementId.toString() === selectedEngagementId && r.effectiveYear === year && r.effectiveMonth === month)
  }, [selectedEngagementId, options.reports])

  const activeRecipient = useMemo(() => {
    return options.recipients?.find(r => r.id.toString() === selectedRecipientId);
  }, [selectedRecipientId, options.recipients]);

  const notValidAttachment = useMemo(() => {
    return (attachments.length === 0)
  }, [attachments])

  const onSubmit = async (values: JobFormValues) => {
    if(notValidAttachment) return 

    const formData = new FormData()
    formData.append("payload", JSON.stringify(values))
    formData.append("sessionId", sessionId)

    attachments.forEach((fileItem) => {
      if(!fileItem.isDbRecord && fileItem.file) {
        formData.append("attachments", fileItem.file)
      }
    })

    const response = await createTransaction(formData)

    if (response.error) {
      toast.error("Error: " + response.error)
    } else {
      toast.success("Transaction created successfully!", { position: "top-center" });
      router.refresh()
      router.push(`/qas/${response.data.id}`)
    }
  }

  const handleCancel = async () => {
    try {
      await deleteTempFolderBySessionId(sessionId)
      setTimeout(() => {
        router.push("/qas");
        router.refresh();
      }, 100);
    } catch (error) {
      toast.error("Failed to clean up temporary files.")
    }
  }

  const calculateSmartDate = async () => {
    if (datetimeIssued) {
      const smartDate = await addDate(datetimeIssued, 2);
      setValue("targetDate", smartDate.toDateString());
    }
  }

  if (!sessionId) return null

  return (
    <form className={cn(`flex flex-col gap-4 ${isMobile ? "px-4" : "px-20"} lg:px-40`)} onSubmit={handleSubmit(onSubmit)}>

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

                  <Field>
                    <FieldLabel>Compliance Secretariat</FieldLabel>
                    <Input value={`${options.session?.user.name} (${options.session?.user.employeeNumber})`} readOnly />
                  </Field>

                  <Field>
                    <FieldLabel>Company</FieldLabel>
                    <Controller
                      name="companyId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                      )}
                    />
                    {errors.companyId && <p className="text-xs text-destructive mt-1">{errors.companyId.message}</p>}
                  </Field>

                  <Field>
                    <FieldLabel>Project</FieldLabel>
                    <Controller
                      name="projectId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                      )}
                    />
                    {errors.projectId && <p className="text-xs text-destructive mt-1">{errors.projectId.message}</p>}
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
                    <Controller
                      name="complianceOfficerId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select compliance officer..." />
                          </SelectTrigger>
                          <SelectContent>
                            {filtered.officers?.map((p) => (
                              <SelectItem key={p.id} value={p.id.toString()} >
                                {`${p.fullName} (${p.employeeNumber})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.complianceOfficerId && <p className="text-xs text-destructive mt-1">{errors.complianceOfficerId.message}</p>}
                  </Field>

                  <Field>
                    <FieldLabel>Supervisor</FieldLabel>
                    <Controller
                      name="supervisorId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select supervisor..." />
                          </SelectTrigger>
                          <SelectContent>
                            {filtered.supervisors?.map((p) => (
                              <SelectItem key={p.id} value={p.id.toString()} >
                                {`${p.fullName} (${p.employeeNumber})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.supervisorId && <p className="text-xs text-destructive mt-1">{errors.supervisorId.message}</p>}
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
                                {`${r.fullName} (${r.employeeNumber})`}
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
                      value={activeRecipient?.escalation1User ? `${activeRecipient?.escalation1User?.fullName} (${activeRecipient?.escalation1User?.employeeNumber}) ` : "N/A"}
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel>Second Escation</FieldLabel>
                    <Input
                      name="secondEscalation"
                      placeholder="N/A"
                      value={activeRecipient?.escalation2User ? `${activeRecipient?.escalation2User?.fullName} (${activeRecipient?.escalation2User?.employeeNumber}) ` : "N/A"}
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel>Third Escation</FieldLabel>
                    <Input
                      name="thirdEscalation"
                      placeholder="N/A"
                      value={activeRecipient?.escalation3User ? `${activeRecipient?.escalation3User?.fullName} (${activeRecipient?.escalation3User?.employeeNumber}) ` : "N/A"}
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel>Fourth Escation</FieldLabel>
                    <Input
                      name="fourthEscalation"
                      placeholder="N/A"
                      value={activeRecipient?.escalation4User ? `${activeRecipient?.escalation4User?.fullName} (${activeRecipient?.escalation4User?.employeeNumber}) ` : "N/A"}
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
                  initialAttachments={null}
                />
                {notValidAttachment && <p className="text-xs text-destructive mt-1">{ `At least one attachment is required` }</p>}
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