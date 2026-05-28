"use client"

import { useState, useMemo, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { toast } from "sonner"
import { jobTransactionClientUpdate, TransactionPayload } from "@/server-actions/transaction"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker, DateRangePicker } from "@/components/datepicker"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import StatusBadge from "@/components/status-badge"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { HoldingPayload } from "@/server-actions/hold-history"
import { FileUpload, Attachment } from "@/components/FileUpload"
import AttachmentViewer from "@/components/series/attachments-viewer"

export default function RightPanel({ jobTransaction, activeHolding }: { jobTransaction: TransactionPayload, activeHolding: HoldingPayload | null }) {
  const router = useRouter()
  const [sessionId, setSessionId] = useState<string>("")
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isPending, setIsPending] = useState(false)

  const { data: session } = useSession()
  const userId = session?.user.id
  const userRoles = session?.user.userRoles

  const isAccepted = jobTransaction.jobStatus === "accepted"
  const isForClosing = jobTransaction.jobStatus === "for closing"
  const isClosed = jobTransaction.jobStatus === "closed"
  const isCancelled = jobTransaction.jobStatus === "cancelled"
  const isHeld = jobTransaction.jobStatus === "on-hold"

  // Generate sessionId for attachment upload
  useEffect(() => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      setSessionId(crypto.randomUUID());
    } else {
      // Basic fallback for non-secure contexts
      const fallbackId = (Math.random().toString(36).substring(2) + Date.now().toString(36));
      setSessionId(fallbackId);
    }
  }, [])

  // reset permissions if any of the following changes: [jobTransaction, userId, userRoles]
  const permissions = useMemo(() => {
    const isAuditor = String(jobTransaction.complianceSecretariatId) === userId
    const isSupervisor = String(jobTransaction.supervisorId) === userId
    const isOfficer = String(jobTransaction.complianceOfficerId) === userId
    const isRecipient = String(jobTransaction.recipientId) === userId

    const hasAuditorRole = userRoles?.includes(1001)
    const hasSupervisorRole = userRoles?.includes(1002)
    const hasOfficerRole = userRoles?.includes(1003)
    const hasRecipientRole = userRoles?.includes(1004)

    const isOpen = jobTransaction.jobStatus === "open"
    const isStateNew = isOpen && !jobTransaction.verifiedBy && !jobTransaction.approvedBy
    const isStateVerified = isOpen && !!jobTransaction.verifiedBy && !jobTransaction.approvedBy
    const isStateApproved = isOpen && !!jobTransaction.verifiedBy && !!jobTransaction.approvedBy && !isAccepted

    return {
      isAuditor, isSupervisor, isOfficer, isRecipient,
      isOpen, isStateNew, isStateVerified, isStateApproved,
      canCancel: isStateNew && hasAuditorRole && isAuditor,
      canVerify: isStateNew && hasSupervisorRole && isSupervisor,
      canApprove: isStateVerified && hasOfficerRole && isOfficer,
      canAccept: isStateApproved && hasRecipientRole && isRecipient,
      canAskForClosing: isAccepted && hasAuditorRole && isAuditor,
      canClose: isForClosing && hasSupervisorRole && isSupervisor,
    }
  }, [jobTransaction, userId, userRoles])

  const joTransactionSchema = useMemo(() => {
    return z.object({
      // Actions
      isVerified: z.boolean(),
      isApproved: z.boolean(),
      isForAcceptance: z.boolean(),
      isForClosing: z.boolean(),
      isToClose: z.boolean(),
      isHold: z.boolean(),
      isCancel: z.boolean(),

      // Update Area
      correctiveAction: z.string().optional(),
      corrCommitmentDate: z.date().optional().nullable(),
      preventiveAction: z.string().optional(),
      prevCommitmentDate: z.date().optional().nullable(),

      // Holding Area
      holdRange: z.object({
        start: z.date().nullable().optional(),
        end: z.date().nullable().optional(),
      }).optional(),

      // Global
      comment: z.string().min(1, "Please provide a comment."),
    }).superRefine((data, ctx) => {
      const requiresUpdateValidation = permissions.isStateApproved && permissions.canAccept && !isFormDisabled

      if (requiresUpdateValidation) {
        if (!data.correctiveAction || data.correctiveAction.trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: "Please provide details.",
            path: ["correctiveAction"]
          })
        }
        if (!data.corrCommitmentDate) {
          ctx.addIssue({
            code: "custom",
            message: "Please select a commitment date.",
            path: ["corrCommitmentDate"]
          })
        }
        if (!data.preventiveAction || data.preventiveAction.trim() === "") {
          ctx.addIssue({
            code: "custom",
            message: "Please provide details.",
            path: ["preventiveAction"]
          })
        }
        if (!data.prevCommitmentDate) {
          ctx.addIssue({
            code: "custom",
            message: "Please select a commitment date.",
            path: ["prevCommitmentDate"]
          })
        }
      }

      if (!data.isHold && !data.isCancel) {
        if (!!jobTransaction.approvedBy || permissions.canAccept) {
          if (!data.correctiveAction || data.correctiveAction.trim() === "") {
            ctx.addIssue({
              code: "custom",
              message: "Corrective action is required to proceed.",
              path: ["correctiveAction"],
            });
          }
          if (!data.preventiveAction || data.preventiveAction.trim() === "") {
            ctx.addIssue({
              code: "custom",
              message: "Preventive action is required to proceed.",
              path: ["preventiveAction"],
            });
          }
          if (!data.corrCommitmentDate) {
            ctx.addIssue({
              code: "custom",
              message: "Please select a commitment date.",
              path: ["corrCommitmentDate"],
            });
          }
          if (!data.prevCommitmentDate) {
            ctx.addIssue({
              code: "custom",
              message: "Please select a commitment date.",
              path: ["prevCommitmentDate"],
            });
          }
        }
      }

      // Holding date validation
      if (data.isHold) {
        if (!data.holdRange?.start) {
          ctx.addIssue({
            code: "custom",
            message: "Start date is require for holding",
            path: ["holdRange"]
          })
        }
        if (!data.holdRange?.end) {
          ctx.addIssue({
            code: "custom",
            message: "End date is require for holding",
            path: ["holdRange"]
          })
        }
        if (data.holdRange?.start && data.holdRange?.end && data.holdRange.start > data.holdRange.end) {
          ctx.addIssue({
            code: "custom",
            message: "End date cannot be earlier than start date.",
            path: ["holdRange"],
          })
        }
      }

    })
  }, [permissions])

  type JobTransactionFormValues = z.infer<typeof joTransactionSchema>

  const { register, handleSubmit, control, watch, resetField, setValue, formState: { errors }, clearErrors } = useForm<JobTransactionFormValues>({
    resolver: zodResolver(joTransactionSchema),
    defaultValues: {
      isVerified: !!jobTransaction.verifiedBy || !!jobTransaction.verifiedOn,
      isApproved: !!jobTransaction.approvedBy || !!jobTransaction.approvedOn,
      isForAcceptance: (permissions.canAccept || isAccepted || isForClosing || isClosed) && !!jobTransaction.approvedBy && jobTransaction.jobStatus === "open",
      isForClosing: jobTransaction.jobStatus === "for closing",
      isToClose: !!jobTransaction.closedOn,
      isHold: !!jobTransaction.onHold,
      isCancel: !!jobTransaction.cancelledOn,
      correctiveAction: jobTransaction.correctiveAction ?? "",
      preventiveAction: jobTransaction.preventiveAction ?? "",
      corrCommitmentDate: jobTransaction.correctiveCommitmentDate ? new Date(jobTransaction.correctiveCommitmentDate) : null,
      prevCommitmentDate: jobTransaction.preventiveCommitmentDate ? new Date(jobTransaction.preventiveCommitmentDate) : null,
      holdRange: {
        start: activeHolding?.holdFrom ? new Date(activeHolding.holdFrom) : undefined,
        end: activeHolding?.holdUntil ? new Date(activeHolding.holdUntil) : undefined,
      },
      comment: "",
    }
  })

  const isHoldChecked = watch("isHold")
  const isCancelChecked = watch("isCancel")
  const isVerifiedChecked = watch("isVerified")
  const isApprovedChecked = watch("isApproved")
  const isForClosingChecked = watch("isForClosing")
  const isToCloseChecked = watch("isToClose")
  const holdRangeValue = watch("holdRange")

  const showUpdateArea = !isHoldChecked && !isCancelChecked && (permissions.canAccept || isAccepted || isForClosing || isClosed)

  const isFormDisabled = useMemo(() => {
    if (isPending) return true
    if (isClosed || isCancelled || isHeld) return true

    // RULE 1: New ticket validation
    if (permissions.isStateNew) {
      const changesMade = (permissions.canCancel && isCancelChecked) || (permissions.canVerify && isVerifiedChecked)
      if (!changesMade) return true
    }
    // RULE 2: Verified stage requirements
    if (permissions.isStateVerified) {
      if (permissions.canApprove && !isApprovedChecked) return true
      if (!permissions.canApprove) return true
    }
    // RULE 3: Acceptance criteria validation
    if (permissions.isStateApproved) {
      if (!permissions.canAccept) return true
      if (isHoldChecked) {
        if (!holdRangeValue) return true
        const start = holdRangeValue.start
        const end = holdRangeValue.end
        const hasValidDates = start instanceof Date && end instanceof Date
        const isValidRange = hasValidDates && start.getTime() <= end.getTime()
        if (!isValidRange) return true
      } else {
        const hasActions = !!watch("correctiveAction")?.trim() && !!watch("preventiveAction")?.trim()
        const hasDates = !!watch("corrCommitmentDate") && !!watch("prevCommitmentDate")
        if (!hasActions || !hasDates) return true
      }
    }
    // RULE 4: Action check configurations
    if (isAccepted) {
      if (permissions.canAskForClosing && !isForClosingChecked) return true
      if (!permissions.canAskForClosing) return true
    }
    // RULE 5: Closing stage
    if (isForClosing) {
      if (permissions.canClose && !isToCloseChecked) return true
      if (!permissions.canClose) return true
    }
    return false
  }, [permissions, isPending, isAccepted, isForClosing, isCancelChecked, isVerifiedChecked, isApprovedChecked, isHoldChecked, isApprovedChecked, isForClosingChecked, isToCloseChecked, watch("correctiveAction"), watch("preventiveAction"), watch("corrCommitmentDate"), watch("prevCommitmentDate"), watch("holdRange.start"), watch("holdRange.end"), watch("comment"), holdRangeValue])

  useEffect(() => {
    // Clear validation errors for Update Area when moving to hold
    if (isHoldChecked || isCancelChecked) {
      clearErrors(["correctiveAction", "preventiveAction", "corrCommitmentDate", "prevCommitmentDate"])
    }
    if (isHoldChecked) {
      resetField("isCancel")
    }
    if (!isHoldChecked) {
      setValue("holdRange", { start: undefined, end: undefined }, { shouldValidate: true })
      clearErrors("holdRange")
    }
    if (isCancelChecked) {
      resetField("isHold")
    }
  }, [isHoldChecked, isCancelChecked, clearErrors, resetField, setValue])

  useEffect(() => {
    if (!jobTransaction.onHold) {
      setValue("isHold", false)
      setValue("holdRange", { start: undefined, end: undefined })
    } else {
      setValue("isHold", true)
      setValue("holdRange", {
        start: activeHolding?.holdFrom ? new Date(activeHolding.holdFrom) : undefined,
        end: activeHolding?.holdUntil ? new Date(activeHolding.holdUntil) : undefined,
      })
    }
  }, [activeHolding])

  const onSubmit = async (data: JobTransactionFormValues) => {
    setIsPending(true)

    let actionType = ""
    if (data.isHold) actionType = "hold"
    else if (data.isCancel) actionType = "cancel"
    else if (permissions.canClose && data.isToClose) actionType = "close"
    else if (permissions.canAskForClosing && data.isForClosing) actionType = "for closing"
    else if (permissions.canAccept) actionType = "accept"
    else if (permissions.canApprove && data.isApproved) actionType = "approve"
    else if (permissions.canVerify && data.isVerified) actionType = "verify"

    if (!actionType && data.comment) actionType = "comment_only"

    const formData = new FormData()
    formData.append("sessionId", sessionId)
    formData.append("seriesno", String(jobTransaction.id))
    formData.append("actionType", actionType)
    formData.append("correctiveAction", data.correctiveAction || "")
    formData.append("preventiveAction", data.preventiveAction || "")
    formData.append("comment", data.comment || "")

    if (data.isHold && data.holdRange) {
      if (data.holdRange.start) {
        formData.append("holdFrom", data.holdRange?.start?.toISOString() ?? "")
      }
      if (data.holdRange.end) {
        formData.append("holdUntil", data.holdRange?.end?.toISOString() ?? "")
      }
    }

    const { error } = await jobTransactionClientUpdate(formData)

    if (error) {
      toast.error(error)
    } else {
      toast.success("Series updated successfully.", { position: "top-center" })
      resetField("comment")
      router.refresh()
    }

    setIsPending(false)
  }

  return (
    <div className="bg-muted py-2 px-2 border-l h-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full bg-background rounded-md border shadow-2xl">
        <div className="flex items-center gap-3 p-3 border-b">
          <Label className="text-md">Series #{jobTransaction.id}</Label>
          <StatusBadge status={jobTransaction.jobStatus ?? "open"} />
        </div>

        <div className="flex flex-col gap-4 px-4 py-4 h-full overflow-auto">

          <Label className="text-muted-foreground text-xs uppercase font-bold">Entry Actions</Label>

          <FieldGroup className="gap-3">
            {/* VERIFICATION CHECKBOX */}
            <Field>
              <div className="flex items-center gap-3">
                <Controller
                  control={control}
                  name="isVerified"
                  render={({ field }) => (
                    <Checkbox
                      id="isVerified"
                      {...register("isVerified")}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!permissions.isStateNew || isHoldChecked || !permissions.canVerify || isCancelChecked} />
                  )}
                />
                <FieldLabel htmlFor="isVerified">{jobTransaction.verifiedBy ? "Verified" : "Verify"}</FieldLabel>
              </div>
            </Field>

            {/* APPROVAL CHECKBOX */}
            {!permissions.isStateNew && (
              <Field>
                <div className="flex items-center gap-3">
                  <Controller
                    control={control}
                    name="isApproved"
                    render={({ field }) => (
                      <Checkbox
                        id="isApproved"
                        {...register("isApproved")}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!permissions.isStateVerified || isHoldChecked || !permissions.canApprove}
                      />
                    )}
                  />
                  <FieldLabel htmlFor="isApproved">{jobTransaction.approvedBy ? "Approved" : "Approve"}</FieldLabel>
                </div>
              </Field>
            )}

            {/* FOR CLOSING CHECKBOX */}
            {(isAccepted || isForClosing) && (
              <Field>
                <div className="flex items-center gap-3">
                  <Controller
                    control={control}
                    name="isForClosing"
                    render={({ field }) => (
                      <Checkbox
                        id="isForClosing"
                        {...register("isForClosing")}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!isAccepted || isHoldChecked || !permissions.canAskForClosing}
                      />
                    )}
                  />
                  <FieldLabel htmlFor="isForClosing">For Closing</FieldLabel>
                </div>
              </Field>
            )}

            {/* CLOSING CHECKBOX */}
            {(isForClosing || isClosed) && (
              <Field>
                <div className="flex items-center gap-3">
                  <Controller
                    control={control}
                    name="isToClose"
                    render={({ field }) => (
                      <Checkbox
                        id="isToClose"
                        {...register("isToClose")}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!permissions.canClose}
                      />
                    )}
                  />
                  <FieldLabel htmlFor="isToClose">{isForClosing ? "Close" : "Closed"}</FieldLabel>
                </div>
              </Field>
            )}

            {/* CANCEL CHECKBOX */}
            {(permissions.isStateNew && permissions.canCancel || isCancelled) && (
              <Field>
                <div className="flex items-center gap-3">
                  <Controller
                    control={control}
                    name="isCancel"
                    render={({ field }) => (
                      <Checkbox
                        id="isCancel"
                        {...register("isCancel")}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isHoldChecked || !permissions.canCancel || isCancelled || isVerifiedChecked}
                      />
                    )}
                  />
                  <FieldLabel htmlFor="isCancel">{isCancelled ? "Cancelled" : "Cancel"}</FieldLabel>
                </div>
              </Field>
            )}

          </FieldGroup>

          {/* HOLDING AREA */}
          {/* {(permissions.isStateApproved && permissions.canAccept) || isHeld && ( */}
          {(showUpdateArea || isHeld || isHoldChecked) && !(isAccepted || isForClosing || isClosed) && (
            <FieldGroup className="gap-3">
              <Field>
                <div className="flex items-center gap-3">
                  <Controller
                    control={control}
                    name="isHold"
                    render={({ field }) => (
                      <Checkbox
                        id="isHold"
                        {...register("isHold")}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={jobTransaction.onHold}
                      />
                    )}
                  />
                  <Label>{jobTransaction.onHold ? "On-Hold" : "Request for hold"}</Label>
                </div>
              </Field>

              {isHoldChecked &&
                <FieldGroup className="flex gap-3 px-4 py-2 animate-in fade-in slide-in-from-top-2 duration-500">
                  <Field>
                    <Controller
                      control={control}
                      name="holdRange"
                      render={({ field }) => (
                        <DateRangePicker
                          defaultStart={field.value?.start ?? null}
                          defaultEnd={field.value?.end ?? null}
                          onChange={field.onChange}
                          readonly={jobTransaction.onHold}
                        />
                      )}
                    />
                  </Field>
                  {errors.holdRange && <FieldError>{errors.holdRange.message}</FieldError>}
                </FieldGroup>
              }
            </FieldGroup>
          )}

          {showUpdateArea &&
            <FieldGroup className="gap-3 animate-in fade-in slide-in-from-top-2 duration-500">
              <Separator />

              <Label className="text-muted-foreground text-xs uppercase font-bold">Update Area</Label>

              <Field>
                <FieldLabel className="text-muted-foreground">Corrective Actions</FieldLabel>
                <Textarea
                  id="correctiveAction"
                  {...register("correctiveAction")}
                  defaultValue={jobTransaction.correctiveAction ?? ""}
                  placeholder="Type here..."
                  className="resize-none"
                  readOnly={!permissions.canAccept}
                  disabled={permissions.canAccept && isHoldChecked && isCancelChecked}
                />
                {errors.correctiveAction && <FieldError>{errors.correctiveAction.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel className="text-muted-foreground">Corrective Comitment Date</FieldLabel>
                <Controller
                  control={control}
                  name="corrCommitmentDate"
                  render={({ field }) => (
                    <DatePicker
                      defaultDate={field.value ?? undefined}
                      onChange={field.onChange}
                      readonly={!permissions.canAccept}
                      disabled={permissions.canAccept && isHoldChecked && isCancelChecked}
                    />
                  )}
                />
                {errors.corrCommitmentDate && <FieldError>{errors.corrCommitmentDate.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel className="text-muted-foreground">Preventive Actions</FieldLabel>
                <Textarea
                  id="preventiveAction"
                  {...register("preventiveAction")}
                  defaultValue={jobTransaction.preventiveAction ?? ""}
                  placeholder="Type here..."
                  className="resize-none"
                  readOnly={!permissions.canAccept}
                  disabled={permissions.canAccept && isHoldChecked && isCancelChecked}
                />
                {errors.preventiveAction && <FieldError>{errors.preventiveAction.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel className="text-muted-foreground">Preventive Comitment Date</FieldLabel>
                <Controller
                  control={control}
                  name="prevCommitmentDate"
                  render={({ field }) => (
                    <DatePicker
                      defaultDate={field.value ?? undefined}
                      onChange={field.onChange}
                      readonly={!permissions.canAccept}
                      disabled={permissions.canAccept && isHoldChecked && isCancelChecked}
                    />
                  )}
                />
                {errors.prevCommitmentDate && <FieldError>{errors.prevCommitmentDate.message}</FieldError>}
              </Field>

              {/* Recipient's Attachement Upload */}
              {!(isAccepted || isClosed || isForClosing) &&
                <Field>
                  <FieldLabel className="text-muted-foreground" htmlFor="attachments">Attachments</FieldLabel>
                  {/* <Input name="attachments" /> */}
                  <FileUpload sessionId={sessionId} onFilesChange={setAttachments} />
                </Field>
              }

              {(isAccepted || isClosed || isForClosing) &&
                <Field>
                  <FieldLabel className="text-muted-foreground" htmlFor="attachments">Attachments</FieldLabel>
                  <AttachmentViewer
                    jobTransactionId={jobTransaction?.id ?? 0}
                    attachments={jobTransaction?.attachments ? jobTransaction.attachments.filter(e => e.fromRecipient && e.isActive) : []}
                  />
                </Field>
              }

            </FieldGroup>
          }

          {!(isClosed || isCancelled || isHeld) &&
            <>
              <Separator />
              <div className="flex flex-col gap-3">
                <Label htmlFor="comment" className="text-muted-foreground">{isHoldChecked ? "Holding Reason" : isCancelChecked ? "Cancel Reason" : "Comments / Remarks"}</Label>
                <Textarea id="comment"
                  {...register("comment")}
                  placeholder="Type here..."
                  className="resize-none"
                  disabled={isFormDisabled}
                />
                {errors.comment && <FieldError>Comment is required.</FieldError>}
              </div>
            </>
          }

        </div>


        {!(isClosed || isCancelled || isHeld) && (
          <div className="w-full border-t px-4 py-4 space-y-2">
            <Button type="submit" size="lg" className="w-full" disabled={isFormDisabled}>
              {isPending ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) : "Submit"}
            </Button>
          </div>
        )}

      </form>
    </div>
  )
}