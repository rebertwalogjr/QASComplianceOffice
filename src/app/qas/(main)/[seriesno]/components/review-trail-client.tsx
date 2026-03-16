"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createReviewTrail, ReviewTrailPayload } from "@/server-actions/review-trail"

import TrailContainer from "./trail-container"

interface ReviewTrailProps {
  initialTrails: ReviewTrailPayload[],
  jobTransactionId: number,
  currentUserId: number,
}

export default function ReviewTrailClient({ initialTrails, jobTransactionId, currentUserId }: ReviewTrailProps) {
  const router = useRouter()

  const handleSendMessage = async (message: string) => {
    const formData = new FormData
    formData.append("jobTransactionId", jobTransactionId.toString())
    formData.append("message", message)

    const { error } = await createReviewTrail(formData)

    if (error) {
      toast.error(error)
    } else {
      router.refresh()
    }
  }

  return (
    <TrailContainer
      trails={initialTrails}
      currentUserId={currentUserId}
      onSend={handleSendMessage}
    />
  )
}

