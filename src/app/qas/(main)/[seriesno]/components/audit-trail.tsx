"use client"

import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemMedia, ItemTitle } from "@/components/ui/item"
import { User2, LucideClockFading } from "lucide-react"
import StatusBadge from "@/components/status-badge"
import { AuditTrailPayload } from "@/server-actions/audit-trail"
import { format } from "date-fns"
import { UserHoverCard } from "@/components/user-hover-card"
import { groupAuditTrails } from "@/lib/utils"
import { TransactionPayload } from "@/server-actions/transaction"
import { useIsMobile } from "@/hooks/use-mobile"

export default function AuditTrail({ data, jobTransaction }: { data: AuditTrailPayload[] | null, jobTransaction: TransactionPayload }) {
  const isMobile = useIsMobile()
  if (!data || data.length === 0) return <div>No history found.</div>

  const groupedData = groupAuditTrails(data)

  const isInactive = jobTransaction.jobStatus === "closed" || jobTransaction.jobStatus === "on-hold" || jobTransaction.jobStatus === "cancelled"

  const getPendingMessage = () => {
    const { verifiedOn, approvedOn, jobStatus: status } = jobTransaction

    if (status === "open" && !verifiedOn) {
      return "Waiting for the supervisor to verify"
    }
    if (verifiedOn && !approvedOn) {
      return "Waiting for compliance officer approval"
    }
    if (verifiedOn && approvedOn && status === "open") {
      return "Waiting for acceptance"
    }
    if (status === "accepted") {
      return "Accepted, waiting for closing"
    }
    if (status === 'for closing') {
      return "Waiting for closing approval"
    }
    return null
  }

  const pendingMessage = getPendingMessage()

  return (
    <div className="flex flex-col gap-4 md:px-12">

      {!isInactive && pendingMessage && (
        <Item variant="outline" className="bg-muted/50 border-dashed animate-in fade-in slide-in-from-top-2 duration-500">
          <ItemMedia variant="icon" className="mr-2">
            <LucideClockFading className="text-muted-foreground animate-spin" size={18} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              <span className="text-muted-foreground font-medium italic">
                {pendingMessage}...
              </span>
            </ItemTitle>
          </ItemContent>
        </Item>
      )}


      {Object.entries(groupedData).map(([label, trails]) => {
        // Skip rendering the group if it's empty
        if (trails.length === 0) return null

        return (
          <div key={label} className="flex flex-col gap-4">
            {/* The Distinction Label */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                {label}
              </span>
              <div className="h-px w-full bg-border/60" />
            </div>

            {/* The Trails for this group */}
            <div className="flex flex-col gap-3">
              {trails.map((t) => {
                const showFullDate = label === "This Week" || label === "Earlier"
                return (
                  <Item key={t.id} variant="outline" className="relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex gap-3 w-full">

                      <ItemContent className="flex-1 min-w-0">

                        {isMobile ?
                          <ItemTitle className="text-sm leading-5 font-normal">
                            <ItemMedia variant="icon" className="shrink-0 mt-1">
                              <User2 size={18} />
                            </ItemMedia>
                            <span className="tracking-wide"><strong>{t.creator.fullName}</strong>{" "}{t.actionTaken.toLowerCase()}</span>
                          </ItemTitle> :
                          <ItemTitle className="text-sm leading-5 font-normal">
                            <ItemMedia variant="icon" className="shrink-0 mt-1">
                              <User2 size={18} />
                            </ItemMedia>
                            <UserHoverCard data={t.creator} />
                            {" "}
                            <span className="tracking-wide">{t.actionTaken.toLowerCase()}</span>
                          </ItemTitle>
                        }

                        {t.comment && (
                          <p className="text-sm text-muted-foreground line-clamp-3 italic border-l-2 border-muted pl-2 mt-2">
                            {t.comment}
                          </p>
                        )}

                        <div className="flex items-center justify-between gap-2 mt-2">
                          {t.tag && (
                            <div className="mt-2">
                              <StatusBadge status={t.jobStatus.toLowerCase()} />
                            </div>
                          )}
                          <div className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap text-right">
                            {showFullDate ? (
                              <div className="flex flex-row gap-1">
                                <div>{format(new Date(t.createdOn), "MMM d, yyyy")}</div>
                                <div className="opacity-70">
                                  {format(new Date(t.createdOn), "h:mm aa")}
                                </div>
                              </div>
                            ) : (
                              <span>
                                {label} at {format(new Date(t.createdOn), "h:mm aa")}
                              </span>
                            )}
                          </div>
                        </div>

                      </ItemContent>
                    </div>
                  </Item>
                )
              })}
            </div>
          </div>
        )
      })}

    </div>
  )
}