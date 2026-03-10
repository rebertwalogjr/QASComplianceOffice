import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemMedia, ItemTitle } from "@/components/ui/item";
import { BadgeCheck, BadgeCheckIcon, BadgeMinusIcon, User2, LucideClockFading } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "@/components/status-badge";
import { AuditTrailPayload } from "@/server-actions/audit-trail";
import { format } from "date-fns";
import { UserHoverCard } from "@/components/user-hover-card";
import { groupAuditTrails } from "@/lib/utils";
import { TransactionPayload } from "@/server-actions/transaction";

export default function AuditTrail({ data, jobTransaction }: { data: AuditTrailPayload[] | null, jobTransaction: TransactionPayload }) {

  if (!data || data.length === 0) return <div>No history found.</div>;

  const groupedData = groupAuditTrails(data)

  const isInactive = jobTransaction.jobStatus === "closed" || jobTransaction.jobStatus === "on-hold" || jobTransaction.jobStatus === "cancelled"

  const getPendingMessage = () => {
    const { verifiedOn, approvedOn, jobStatus: status } = jobTransaction;

    if (status === "open" && !verifiedOn) {
      return "Waiting for the supervisor to verify";
    }
    if (verifiedOn && !approvedOn) {
      return "Waiting for compliance officer approval";
    }
    if (verifiedOn && approvedOn && status !== "accepted") {
      return "Waiting for acceptance";
    }
    if (status === "accepted") {
      return "Accepted, waiting for closing";
    }
    return null;
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
        if (trails.length === 0) return null;

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
                    <ItemMedia variant="icon" className="mr-2">
                      <User2 size={18} />
                    </ItemMedia>
                    <ItemContent className="flex-1 flex flex-col gap-1">
                      <div className="flex justify-between items-start w-full">
                        <ItemTitle className="text-sm">
                          {/* <span className="font-bold text-foreground">{t.creator.appSuiteEmployeeMaster.firstName}</span> */}
                          <UserHoverCard data={t.creator.appSuiteEmployeeMaster} />
                          {" "}
                          <span className="font-normal">{t.actionTaken.toLowerCase()}</span>
                        </ItemTitle>
                        <div className="text-[10px] md:text-xs text-muted-foreground whitespace-nowrap ml-4 text-right">
                          {showFullDate ? (
                            <>
                              <div>{format(new Date(t.createdOn), "MMM d, yyyy")}</div>
                              <div className="opacity-70">{format(new Date(t.createdOn), "h:mm aa")}</div>
                            </>
                          ) : (
                            <span>{label} at {format(new Date(t.createdOn), "h:mm aa")}</span>
                          )}
                        </div>
                      </div>
                      {t.comment && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-3 italic border-l-2 border-muted pl-2">
                          {t.comment}
                        </p>
                      )}
                      {t.tag && (
                        <div className="mt-2">
                          <StatusBadge status={t.jobStatus.toLowerCase()} />
                        </div>
                      )}
                    </ItemContent>
                  </Item>
                )
              })}
            </div>
          </div>
        );
      })}

    </div>
  )
}