import { notFound } from "next/navigation"

import { getAuditTrailByTransId } from "@/server-actions/audit-trail"
import { getTransactionById } from "@/server-actions/transaction"

import FormView from "./components/form-view"
import RightPanel from "./components/right-panel"
import SeriesTitle from "./components/series-title"
import UpdateTrail from "./components/update-trail"
import ReviewTrail from "./components/review-trail"
import AuditTrail from "./components/audit-trail"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { SeriesTabs, SeriesTabsContent, SeriesTabsList, SeriesTabsTrigger } from "@/components/series/series-tabs"
import CardHoldAction from "./components/card-hold-action"
import { getActiveHolding } from "@/server-actions/hold-history"
import { SiteHeader } from "@/components/site-header"

export default async function SeriesViewer({ params }: { params: Promise<{ seriesno: string }> }) {
  const resolvedParams = await params
  const slug = resolvedParams.seriesno
  const transId = Number(slug)

  if (isNaN(transId)) {
    notFound()
  }

  const [jobTransaction, auditTrails, activeHolding] = await Promise.all([getTransactionById(transId), getAuditTrailByTransId(transId), getActiveHolding(transId)])

  if (!jobTransaction.data) {
    notFound()
  }

  const result = [jobTransaction, auditTrails]
  const firstError = result.find(r => r.error)?.error

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
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
        <div className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-col lg:flex-row">
            {/* Column 1 */}
            <div className="flex-2 min-w-0 min-h-0">
              <SeriesTitle
                jobTransaction={jobTransaction.data}
              />
              <div className="">
                <SeriesTabs defaultValue="details">
                  <SeriesTabsList>
                    <SeriesTabsTrigger value="details">Details</SeriesTabsTrigger>
                    <SeriesTabsTrigger value="audit">Audit Trail</SeriesTabsTrigger>
                    <SeriesTabsTrigger value="update">Update Trail</SeriesTabsTrigger>
                    <SeriesTabsTrigger value="review">Review Trail</SeriesTabsTrigger>
                  </SeriesTabsList>
                  {jobTransaction.data.onHold && activeHolding.data && (
                    <CardHoldAction activeHolding={activeHolding.data} />
                  )}
                  <SeriesTabsContent value="details">
                    <FormView data={jobTransaction.data} />
                  </SeriesTabsContent>
                  <SeriesTabsContent value="audit">
                    <AuditTrail data={auditTrails.data} jobTransaction={jobTransaction.data} />
                  </SeriesTabsContent>
                  <SeriesTabsContent value="update">
                    <UpdateTrail jobTransaction={jobTransaction.data} />
                  </SeriesTabsContent>
                  <SeriesTabsContent value="review">
                    <ReviewTrail jobTransaction={jobTransaction.data} />
                  </SeriesTabsContent>
                </SeriesTabs>
              </div>

            </div>
            {/* COLUMN 2 – no scroll */}
            {/* <div className="hidden shrink lg:flex lg:flex-col lg:flex-1 min-h-0 sticky top-16 overflow-hidden z-20 h-[calc(100vh-64px)]"> */}
            <div className="mt-4 lg:mt-0 lg:flex-1 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:overflow-hidden lg:z-20">
              <RightPanel
                key={activeHolding?.data?.id ?? 'no-hold'}
                jobTransaction={jobTransaction.data}
                activeHolding={activeHolding.data}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}