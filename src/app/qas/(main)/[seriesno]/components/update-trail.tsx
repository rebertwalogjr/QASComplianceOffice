import { getUpdateTrailByTransactionId } from "@/server-actions/update-trail";
import UpdateTrailClient from "./update-trail-client";
import { getUserId } from "@/server-actions/get-session";
import { TransactionPayload } from "@/server-actions/transaction";

export default async function UpdateTrail({ jobTransaction }: { jobTransaction: TransactionPayload }) {
  const currentUserId = await getUserId()
  const initialTrails = await getUpdateTrailByTransactionId(jobTransaction.id)
  
  return (
    <div className="md:px-12">
      <UpdateTrailClient
        initialTrails={initialTrails.data || []}
        jobTransaction={jobTransaction}
        currentUserId={Number(currentUserId)}
      />
    </div>
  )
}