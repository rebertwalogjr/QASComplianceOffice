"use client"

import { useState, useRef, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { approveJobById, jobTransactionClientUpdate, recipientJobUpdate, TransactionPayload, verifyJobById } from "@/server-actions/transaction";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/datepicker";
import { Separator } from "@/components/ui/separator";
import { Loader2, Verified } from "lucide-react";
import StatusBadge from "@/components/status-badge";

export default function RightPanel({ jobTransaction }: { jobTransaction: TransactionPayload }) {
  const router = useRouter()

  const [isPending, setIsPending] = useState(false)
  const [isVerifiedChecked, setIsVerifiedChecked] = useState(!!jobTransaction.verifiedBy)
  const [isApprovedChecked, setIsApprovedChecked] = useState(!!jobTransaction.approvedBy)
  const [isHoldChecked, setIsHoldChecked] = useState(!!jobTransaction.onHold)
  const [isForClosing, setIsForClosing] = useState(!!jobTransaction.closedOn)

  const { data: session, status } = useSession()
  const userId = session?.user.id
  const userRoles = session?.user.userRoles

  const isAccepted = jobTransaction.jobStatus === "accepted"

  // reset permissions if any of the following changes: [jobTransaction, userId, userRoles]
  const permissions = useMemo(() => {
    const isAuditor = String(jobTransaction.complianceSecretariatId) === userId
    const isSupervisor = String(jobTransaction.supervisorId) === userId
    const isOfficer = String(jobTransaction.complianceOfficerId) === userId
    const isRecipient = String(jobTransaction.recipientId) === userId

    const canVerify = userRoles?.includes(1002) && !jobTransaction.verifiedBy && isSupervisor
    const canApprove = userRoles?.includes(1003) && !!jobTransaction.verifiedBy && !jobTransaction.approvedBy && isOfficer
    const canAccept = userRoles?.includes(1004) && !!jobTransaction.verifiedBy && !!jobTransaction.approvedBy && isRecipient
    const canAskForClosing = userRoles?.includes(1001) && isAccepted && isAuditor

    return { isSupervisor, isOfficer, isRecipient, canVerify, canApprove, canAccept, canAskForClosing }
  }, [jobTransaction, userId, userRoles])

  // update local state whenever the server sends new props
  useEffect(() => {
    setIsVerifiedChecked(!!jobTransaction.verifiedBy)
    setIsApprovedChecked(!!jobTransaction.approvedBy)
    setIsHoldChecked(!!jobTransaction.onHold)
  }, [jobTransaction.verifiedBy, jobTransaction.approvedBy, jobTransaction.onHold])

  const clientAction = async (formData: FormData) => {
    setIsPending(true)

    const wantsToVerify = permissions.canVerify && isVerifiedChecked && !jobTransaction.verifiedBy
    const wantsToApprove = permissions.canApprove && isApprovedChecked && !jobTransaction.approvedBy
    const wantsToAccept = permissions.canAccept

    console.log("corectiveDate: " + formData.get("corrCommitmentDate"))

    formData.append("seriesno", String(jobTransaction.id))
    formData.append("actionType", wantsToVerify ? "verify" : wantsToApprove ? "approve" : wantsToAccept ? "accept" : "")

    const { error } = await jobTransactionClientUpdate(formData)

    if (error) {
      toast.error(error)
      setIsPending(false)
      return
    }

    toast.success("Series updated.")
    // commentRef.current.value = ""
    router.refresh()
    setIsPending(false)
  }

  return (
    <div className="bg-muted py-2 px-2 border-l h-full">
      <form action={clientAction} className="flex flex-col h-full bg-background rounded-md border shadow-2xl">
        <div className="flex items-center gap-3 p-3 border-b">
          <Label className="text-md">Series #{jobTransaction.id}</Label>
          <StatusBadge status={jobTransaction.jobStatus ?? "open"} />
        </div>

        <div className="flex flex-col gap-4 px-4 py-4 h-full overflow-auto">

          <Label className="text-muted-foreground text-xs">Entry Actions</Label>

          <div className="flex items-center gap-3">
            <Checkbox
              id="verify"
              checked={isVerifiedChecked}
              onCheckedChange={(val) => setIsVerifiedChecked(!!val)}
              disabled={!permissions.canVerify} />
            <Label>{jobTransaction.verifiedBy ? "Verified" : "Verify"}</Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="approve"
              checked={isApprovedChecked}
              onCheckedChange={(val) => setIsApprovedChecked(!!val)}
              disabled={!permissions.canApprove}
            />
            <Label>{jobTransaction.approvedBy ? "Approved" : "Approve"}</Label>
          </div>

          {isAccepted &&
            <div className="flex items-center gap-3">
              <Checkbox
                id="forClosing"
                checked={isForClosing}
                onCheckedChange={(val) => setIsForClosing(!!val)}
                disabled={!permissions.canAskForClosing}
              />
              <Label>{jobTransaction.closedOn ? "Closed" : "For CLosing"}</Label>
            </div>
          }

          {(permissions.canVerify || permissions.canApprove || permissions.canAccept) &&
            <>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="hold"
                  checked={isHoldChecked}
                  onCheckedChange={(val) => setIsHoldChecked(!!val)}
                />
                <Label>{jobTransaction.onHold ? "On-Hold" : "Request for hold"}</Label>
              </div>

              {isHoldChecked &&
                <div className="flex gap-3 px-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="holdFrom" className="text-muted-foreground">Hold From</Label>
                    <DatePicker />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label htmlFor="holdUntil" className="text-muted-foreground">Hold Until</Label>
                    <DatePicker />
                  </div>
                </div>
              }
            </>
          }

          {(permissions.canAccept || isAccepted) && jobTransaction.approvedBy &&
            <>
              <Separator />

              <Label className="text-muted-foreground text-xs">Update Area</Label>

              <div className="flex flex-col gap-3">
                <Label htmlFor="correctiveAction" className="text-muted-foreground">Corrective Action</Label>
                <Textarea
                  id="correctiveAction"
                  name="correctiveAction"
                  defaultValue={jobTransaction.correctiveAction ?? ""}
                  placeholder="Type here..."
                  className="resize-none"
                  disabled={isAccepted}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="corrCommitmentData" className="text-muted-foreground">Commitment Date</Label>
                <DatePicker defaultDate={jobTransaction.correctiveCommitmentDate ?? undefined} name="corrCommitmentDate" disabled={isAccepted} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="preventiveAction" className="text-muted-foreground">Preventive Action</Label>
                <Textarea
                  id="preventiveAction"
                  name="preventiveAction"
                  defaultValue={jobTransaction.preventiveAction ?? ""}
                  placeholder="Type here..."
                  className="resize-none"
                  disabled={isAccepted}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="prevCommitmentDate" className="text-muted-foreground">Commitment Date</Label>
                <DatePicker defaultDate={jobTransaction.preventiveCommitmentDate ?? undefined} name="prevCommitmentDate" disabled={isAccepted} />
              </div>
            </>
          }

          <Separator />

          <div className="flex flex-col gap-3">
            <Label htmlFor="comment" className="text-muted-foreground">Comments / Remarks</Label>
            <Textarea id="comment" name="comment" placeholder="Type here..." className="resize-none" />
          </div>

        </div>

        <div className="w-full border-t px-4 py-4">
          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </div>

      </form>
    </div>
  )
}