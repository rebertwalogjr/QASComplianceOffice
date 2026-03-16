import { getUserId } from "@/server-actions/get-session";
import { getReviewTrailByTransactionId } from "@/server-actions/review-trail";
import ReviewTrailClient from "./review-trail-client";

export default async function ReviewTrail({ jobTransactionId }: { jobTransactionId: number }) {
  const currentUserId = await getUserId()
  const initialTrails = await getReviewTrailByTransactionId(jobTransactionId)

  return (
    <div className="md:px-12">
      <ReviewTrailClient
        initialTrails={initialTrails.data || []}
        jobTransactionId={jobTransactionId}
        currentUserId={Number(currentUserId)}
      />
    </div>
  )
}