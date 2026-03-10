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

export default function RightPanel({ jobTransaction, activeHolding }: { jobTransaction: TransactionPayload, activeHolding: HoldingPayload | null }) {
  const router = useRouter()

  const [isPending, setIsPending] = useState(false)

  const { data: session } = useSession()
  const userId = session?.user.id
  const userRoles = session?.user.userRoles

  const isAccepted = jobTransaction.jobStatus === "accepted"
  const isForClosing = jobTransaction.jobStatus === "for closing"
  const isClosed = jobTransaction.jobStatus === "closed"
  const isCancelled = jobTransaction.jobStatus === "cancelled"
  const isHeld = jobTransaction.jobStatus === "on-hold"

  // reset permissions if any of the following changes: [jobTransaction, userId, userRoles]
  const permissions = useMemo(() => {
    const isAuditor = String(jobTransaction.complianceSecretariatId) === userId
    const isSupervisor = String(jobTransaction.supervisorId) === userId
    const isOfficer = String(jobTransaction.complianceOfficerId) === userId
    const isRecipient = String(jobTransaction.recipientId) === userId

    return {
      canVerify: userRoles?.includes(1002) && !jobTransaction.verifiedBy && isSupervisor,
      canApprove: userRoles?.includes(1003) && !!jobTransaction.verifiedBy && !jobTransaction.approvedBy && isOfficer,
      canAccept: userRoles?.includes(1004) && !!jobTransaction.verifiedBy && !!jobTransaction.approvedBy && !isAccepted && !isForClosing && !isClosed && isRecipient,
      canAskForClosing: userRoles?.includes(1001) && isAccepted && isAuditor,
      canCancel: userRoles?.includes(1001) && isAuditor,
      canClose: userRoles?.includes(1002) && isForClosing && isSupervisor,
    }
  }, [jobTransaction, userId, userRoles])

  const joTransactionSchema = useMemo(() => {
    return z.object({
      // Actions
      isVerified: z.boolean(),
      isApproved: z.boolean(),
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
      comment: z.string().optional(),
    }).superRefine((data, ctx) => {
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
      if (data.isHold) {
        if (!data.holdRange?.start || !data.holdRange?.end) {
          ctx.addIssue({
            code: "custom",
            message: "Start and End dates are required for on-hold status",
            path: ["holdRange"],
          });
        }
      }
      if (data.isHold) {
        if (data.holdRange?.start && data.holdRange?.end) {
          if (data.holdRange.start > data.holdRange.end) {
            ctx.addIssue({
              code: "custom",
              message: "End date cannot be earlier than start date",
              path: ["holdRange"],
            });
          }
        }
      }
    })
  }, [])

  type JobTransactionFormValues = z.infer<typeof joTransactionSchema>

  const { register, handleSubmit, control, watch, resetField, setValue, formState: { errors }, clearErrors } = useForm<JobTransactionFormValues>({
    resolver: zodResolver(joTransactionSchema),
    defaultValues: {
      isVerified: !!jobTransaction.verifiedBy,
      isApproved: !!jobTransaction.approvedBy,
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
  const hasAnyPermission = Object.values(permissions).some(p => p === true)
  const showUpdateArea = !isHoldChecked && !isCancelChecked && (permissions.canAccept || isAccepted || isForClosing || isClosed) && !!jobTransaction.approvedBy

  useEffect(() => {
    // Clear validation errors for Update Area when moving to hold
    if (isHoldChecked || isCancelChecked) {
      clearErrors(["correctiveAction", "preventiveAction", "corrCommitmentDate", "prevCommitmentDate"])
      resetField("isVerified")
      resetField("isApproved")
    }
    if (isHoldChecked) {
      resetField("isCancel")
    }
    if (isCancelChecked) {
      resetField("isHold")
    }
  }, [isHoldChecked, isCancelChecked, clearErrors])

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

    const formData = new FormData();
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
            {/* For Verification */}
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
                      disabled={isHoldChecked || !permissions.canVerify} />
                  )}
                />
                <FieldLabel htmlFor="isVerified">{jobTransaction.verifiedBy ? "Verified" : "Verify"}</FieldLabel>
              </div>
            </Field>

            {/* For Approval */}
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
                      disabled={isHoldChecked || !permissions.canApprove}
                    />
                  )}
                />
                <FieldLabel htmlFor="isApproved">{jobTransaction.approvedBy ? "Approved" : "Approve"}</FieldLabel>
              </div>
            </Field>

            {/* For Closing */}
            {isAccepted && (
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
                        disabled={isHoldChecked || !permissions.canAskForClosing}
                      />
                    )}
                  />
                  <FieldLabel htmlFor="isForClosing">For Closing</FieldLabel>
                </div>
              </Field>
            )}

            {/* Closing */}
            {((isForClosing && permissions.canClose) || isClosed) && (
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
                        disabled={isHoldChecked || !permissions.canClose}
                      />
                    )}
                  />
                  <FieldLabel htmlFor="isToClose">{isForClosing ? "Close" : "Closed"}</FieldLabel>
                </div>
              </Field>
            )}

            {/* Cancellation */}
            {(permissions.canCancel || isCancelled) && (
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
                        disabled={isHoldChecked || !permissions.canCancel || isCancelled}
                      />
                    )}
                  />
                  <FieldLabel htmlFor="isCancel">{isCancelled ? "Cancelled" : "Cancel"}</FieldLabel>
                </div>
              </Field>
            )}

          </FieldGroup>

          {/* Holding Request */}
          {(permissions.canVerify || permissions.canApprove || permissions.canAccept) && !isCancelled &&
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
                        disabled={jobTransaction.onHold || isCancelChecked}
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
          }

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
              </Field>

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
                  disabled={!hasAnyPermission || jobTransaction.onHold}
                />
              </div>
            </>
          }

        </div>

        {!(isClosed || isCancelled || isHeld) &&
          <div className="w-full border-t px-4 py-4">
            <Button type="submit" size="lg" className="w-full" disabled={isPending || !hasAnyPermission || isClosed || isCancelled || isHeld || jobTransaction.onHold}>
              {isPending ? (<Loader2 className="mr-2 h-4 w-4 animate-spin" />) :
                isHoldChecked ? "Hold" :
                  isCancelChecked ? "Cancel" :
                    showUpdateArea ? "Accept and save" :
                      "Save Changes"
              }
            </Button>
          </div>
        }

      </form>
    </div>
  )
}