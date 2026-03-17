import { getUserId } from "@/server-actions/get-session";
import { getReviewTrailByTransactionId } from "@/server-actions/review-trail";
import ReviewTrailClient from "./review-trail-client";
import { TransactionPayload } from "@/server-actions/transaction";

export default async function ReviewTrail({ jobTransaction }: { jobTransaction: TransactionPayload }) {
  const currentUserId = await getUserId()
  const initialTrails = await getReviewTrailByTransactionId(jobTransaction.id)

  return (
    <div className="md:px-12">
      <ReviewTrailClient
        initialTrails={initialTrails.data || []}
        jobTransaction={jobTransaction}
        currentUserId={Number(currentUserId)}
      />
    </div>
  )
}