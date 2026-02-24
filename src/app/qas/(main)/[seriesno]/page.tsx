
import { notFound } from "next/navigation"

import { SeriesTabs, SeriesTabsContent, SeriesTabsList, SeriesTabsTrigger } from "@/components/series-tabs"

import FormView from "./form-view"
import RightPanel from "./right-panel"
import SeriesTitle from "./series-title"
import UpdateTrail from "../update-trail"
import ReviewTrail from "../review-trail"
import AuditTrail from "../audit-trail"

import { getTransactionById } from "@/prisma-actions/transaction"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getAuditTrailByTransId } from "@/prisma-actions/audit-trail"

export default async function SeriesViewer({ params }: { params: Promise<{ seriesno: string }> }) {
  const resolvedParams = await params
  const slug = resolvedParams.seriesno
  const transId = Number(slug)

  if (isNaN(transId)) {
    notFound()
  }

  const [jobTransaction, auditTrails] = await Promise.all([getTransactionById(transId), getAuditTrailByTransId(transId)])

  if (!jobTransaction.data) {
    notFound()
  }

  const result = [jobTransaction, auditTrails]
  const firstError = result.find(r => r.error)?.error

  return (
    <div className="@container/ pt-2 flex">
      {firstError ? (
        <div className="mt-6 mx-4" >
          <Alert variant="destructive" className="bg-red-50 border-destructive">
            <AlertCircle />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              {firstError}
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <>
          <div className="flex-2 min-w-0 min-h-0">
            <SeriesTitle seriesno={transId.toString()} />
            <div className="">
              <SeriesTabs defaultValue="details">
                <SeriesTabsList>
                  <SeriesTabsTrigger value="details">Details</SeriesTabsTrigger>
                  <SeriesTabsTrigger value="audit">Audit Trail</SeriesTabsTrigger>
                  <SeriesTabsTrigger value="update">Update Trail</SeriesTabsTrigger>
                  <SeriesTabsTrigger value="review">Review Trail</SeriesTabsTrigger>
                </SeriesTabsList>
                <SeriesTabsContent value="details">
                  <FormView data={jobTransaction.data} />
                </SeriesTabsContent>
                <SeriesTabsContent value="audit">
                  <AuditTrail data={auditTrails.data} />
                </SeriesTabsContent>
                <SeriesTabsContent value="update">
                  <UpdateTrail />
                </SeriesTabsContent>
                <SeriesTabsContent value="review">
                  <ReviewTrail />
                </SeriesTabsContent>
              </SeriesTabs>
            </div>

          </div>

          {/* COLUMN 2 – no scroll */}
          <div className="hidden shrink lg:flex lg:flex-col lg:flex-1 min-h-0 sticky top-16 overflow-hidden z-20 h-[calc(100vh-64px)]">
            <RightPanel />
          </div>
        </>
      )}
    </div>
  )
}