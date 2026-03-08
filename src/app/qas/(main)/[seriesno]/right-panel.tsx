"use client"

import { useState, useRef, useMemo, useEffect } from "react"
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
import { DatePicker } from "@/components/datepicker"
import { Separator } from "@/components/ui/separator"
import { Loader2, Verified } from "lucide-react"
import StatusBadge from "@/components/status-badge"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"

const joTransactionSchema = z.object({
  // Actions
  isVerified: z.boolean(),
  isApproved: z.boolean(),
  isForClosing: z.boolean(),
  isToClose: z.boolean(),
  isHold: z.boolean(),

  // Update Area
  correctiveAction: z.string().optional(),
  corrCommitmentDate: z.date().optional().nullable(),
  preventiveAction: z.string().optional(),
  prevCommitmentDate: z.date().optional().nullable(),

  // Holding Area
  holdFrom: z.date().optional().nullable(),
  holdUntil: z.date().optional().nullable(),

  // Global
  comment: z.string().optional(),
}).superRefine((data, ctx) => {

})

type JobTransactionFormValues = z.infer<typeof joTransactionSchema>

export default function RightPanel({ jobTransaction }: { jobTransaction: TransactionPayload }) {
  const router = useRouter()

  const [isPending, setIsPending] = useState(false)

  const { data: session } = useSession()
  const userId = session?.user.id
  const userRoles = session?.user.userRoles

  const isAccepted = jobTransaction.jobStatus === "accepted"
  const isForClosing = jobTransaction.jobStatus === "for closing"
  const isClosed = jobTransaction.jobStatus === "closed"

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
      canClose: userRoles?.includes(1002) && isForClosing && isSupervisor,
    }
  }, [jobTransaction, userId, userRoles])

  const { register, handleSubmit, control, watch, resetField, formState: { errors } } = useForm<JobTransactionFormValues>({
    resolver: zodResolver(joTransactionSchema),
    defaultValues: {
      isVerified: !!jobTransaction.verifiedBy,
      isApproved: !!jobTransaction.approvedBy,
      isForClosing: jobTransaction.jobStatus === "for closing",
      isToClose: !!jobTransaction.closedOn,
      isHold: !!jobTransaction.onHold,
      correctiveAction: jobTransaction.correctiveAction ?? "",
      preventiveAction: jobTransaction.preventiveAction ?? "",
      corrCommitmentDate: jobTransaction.correctiveCommitmentDate ? new Date(jobTransaction.correctiveCommitmentDate) : null,
      prevCommitmentDate: jobTransaction.preventiveCommitmentDate ? new Date(jobTransaction.preventiveCommitmentDate) : null,
      comment: "",
    }
  })

  const isHoldChecked = watch("isHold")
  const hasAnyPermission = Object.values(permissions).some(p => p === true)
  const showUpdateArea = (permissions.canAccept || isAccepted || isForClosing || isClosed) && !!jobTransaction.approvedBy

  const onSubmit = async (data: JobTransactionFormValues) => {
    setIsPending(true)

    let actionType = ""
    if (permissions.canClose && data.isToClose) actionType = "close"
    else if (permissions.canAskForClosing && data.isForClosing) actionType = "for closing"
    else if (permissions.canAccept) actionType = "accept"
    else if (permissions.canApprove && data.isApproved) actionType = "approve"
    else if (permissions.canVerify && data.isVerified) actionType = "verify"

    // Manual validation for Acceptance phase
    if (actionType === "accept" && (!data.correctiveAction || !data.preventiveAction)) {
      toast.error("Corrective and Preventive actions are required to accept.");
      setIsPending(false);
      return;
    }

    const formData = new FormData();
    formData.append("seriesno", String(jobTransaction.id))
    formData.append("actionType", actionType)
    formData.append("correctiveAction", data.correctiveAction || "")
    formData.append("preventiveAction", data.preventiveAction || "")
    formData.append("comment", data.comment || "")

    const { error } = await jobTransactionClientUpdate(formData)

    if (error) {
      toast.error(error)
    } else {
      toast.success("Series updated.")
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
                      disabled={!permissions.canVerify} />
                  )}
                />
                <FieldLabel htmlFor="isVerified">{jobTransaction.verifiedBy ? "Verified" : "Verify"}</FieldLabel>
              </div>
            </Field>

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
                      disabled={!permissions.canApprove}
                    />
                  )}
                />
                <FieldLabel htmlFor="isApproved">{jobTransaction.approvedBy ? "Approved" : "Approve"}</FieldLabel>
              </div>
            </Field>

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
                        disabled={!permissions.canAskForClosing}
                      />
                    )}
                  />
                  <FieldLabel htmlFor="isForClosing">For Closing</FieldLabel>
                </div>
              </Field>
            )}

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
                  <FieldLabel htmlFor="isToClose">{isForClosing ? "For Closing" : "Closed"}</FieldLabel>
                </div>
              </Field>
            )}

          </FieldGroup>

          {(permissions.canVerify || permissions.canApprove || permissions.canAccept) &&
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
                      />
                    )}
                  />
                  <Label>{jobTransaction.onHold ? "On-Hold" : "Request for hold"}</Label>
                </div>
              </Field>

              {isHoldChecked &&
                <FieldGroup className="flex gap-3 px-4 py-2">
                  <Field>
                    <FieldLabel className="text-muted-foreground">From</FieldLabel>
                    <Controller
                      control={control}
                      name="holdFrom"
                      render={({ field }) => (
                        <DatePicker defaultDate={field.value ?? undefined} onChange={field.onChange} />
                      )}
                    />
                  </Field>
                  <Field>
                    <FieldLabel className="text-muted-foreground">Until</FieldLabel>
                    <Controller
                      control={control}
                      name="holdUntil"
                      render={({ field }) => (
                        <DatePicker defaultDate={field.value ?? undefined} onChange={field.onChange} />
                      )}
                    />
                  </Field>
                </FieldGroup>
              }
            </FieldGroup>
          }

          {showUpdateArea &&
            <FieldGroup className="gap-3">
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
                />
                {errors.correctiveAction && <FieldError>{errors.correctiveAction.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel className="text-muted-foreground">Corrective Comitment Date</FieldLabel>
                <Controller
                  control={control}
                  name="corrCommitmentDate"
                  render={({ field }) => (
                    <DatePicker defaultDate={field.value ?? undefined} onChange={field.onChange} readonly={!permissions.canAccept} />
                  )}
                />
              </Field>

              <Field>
                <FieldLabel className="text-muted-foreground">Preventive Actions</FieldLabel>
                <Textarea
                  id="preventiveAction"
                  {...register("preventiveAction")}
                  defaultValue={jobTransaction.correctiveAction ?? ""}
                  placeholder="Type here..."
                  className="resize-none"
                  readOnly={!permissions.canAccept}
                />
                {errors.preventiveAction && <FieldError>{errors.preventiveAction.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel className="text-muted-foreground">Preventive Comitment Date</FieldLabel>
                <Controller
                  control={control}
                  name="prevCommitmentDate"
                  render={({ field }) => (
                    <DatePicker defaultDate={field.value ?? undefined} onChange={field.onChange} readonly={!permissions.canAccept} />
                  )}
                />
              </Field>

            </FieldGroup>
          }

          <Separator />

          <div className="flex flex-col gap-3">
            <Label htmlFor="comment" className="text-muted-foreground">Comments / Remarks</Label>
            <Textarea id="comment"
              {...register("comment")}
              placeholder="Type here..."
              className="resize-none"
              disabled={!hasAnyPermission || isClosed}
            />
          </div>

        </div>

        <div className="w-full border-t px-4 py-4">
          <Button type="submit" size="lg" className="w-full" disabled={isPending || !hasAnyPermission || isClosed}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>

      </form>
    </div>
  )
}