import { getUpdateTrailByTransactionId } from "@/server-actions/update-trail";
import UpdateTrailClient from "./update-trail-client";
import { getUserId } from "@/server-actions/get-session";


export default async function UpdateTrail({ jobTransactionId }: { jobTransactionId: number }) {
  const currentUserId = await getUserId()
  const initialTrails = await getUpdateTrailByTransactionId(jobTransactionId)
  
  return (
    <div className="md:px-12">
      <UpdateTrailClient
        initialTrails={initialTrails.data || []}
        jobTransactionId={jobTransactionId}
        currentUserId={Number(currentUserId)}
      />
    </div>
  )
}