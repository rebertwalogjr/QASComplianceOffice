"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createUpdateTrail, UpdateTrailPayload } from "@/server-actions/update-trail"

import TrailContainer from "./trail-container"
import { TransactionPayload } from "@/server-actions/transaction"
import { ShieldAlert } from "lucide-react"

interface UpdateTrailProps {
  initialTrails: UpdateTrailPayload[],
  jobTransaction: TransactionPayload
  currentUserId: number,
}

export default function UpdateTrailClient({ initialTrails, jobTransaction, currentUserId }: UpdateTrailProps) {
  const router = useRouter()

  const permissions = useMemo(() => {
    const isAuditor = jobTransaction.complianceSecretariatId === currentUserId
    const isSupervisor = jobTransaction.supervisorId === currentUserId
    const isOfficer = jobTransaction.complianceOfficerId === currentUserId
    const isRecipient = jobTransaction.recipientId === currentUserId
    return { isAuditor, isSupervisor, isOfficer, isRecipient }
  }, [initialTrails, jobTransaction, currentUserId])

  const hasAnyPermission = Object.values(permissions).some(p => p === true)

  const handleSendMessage = async (message: string) => {
    const formData = new FormData
    formData.append("jobTransactionId", jobTransaction.id.toString())
    formData.append("message", message)

    const { data, error } = await createUpdateTrail(formData)

    if (error) {
      toast.error(error)
    } else {
      router.refresh()
    }

  }

  return (
    <>
      {hasAnyPermission ? (
        <TrailContainer
          trails={initialTrails}
          currentUserId={currentUserId}
          onSend={handleSendMessage}
          canWrite={permissions.isAuditor || permissions.isRecipient}
          readonly={jobTransaction.closedOn ? true : false}
        />
      ) : (
        <div className="h-[600px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-muted/50 p-4 rounded-full mb-4">
            <ShieldAlert className="size-8 text-muted-foreground/60" />
          </div>
          <h3 className="text-sm font-semibold text-muted-foreground">Access Restricted</h3>
          <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
            You do not have the required permissions to view this trail. Please contact the <strong>QAS Administrator</strong> for access.
          </p>
        </div>
      )
      }
    </>
  )
}

