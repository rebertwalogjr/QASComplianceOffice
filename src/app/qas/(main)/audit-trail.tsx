import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemMedia, ItemTitle } from "@/components/ui/item";
import { BadgeCheck, BadgeCheckIcon, BadgeMinusIcon, User2, LucideClockFading } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "@/components/status-badge";
import { AuditTrailPayload } from "@/prisma-actions/audit-trail";
import { format } from "date-fns";
import { UserHoverCard } from "@/components/user-hover-card";
import { groupAuditTrails } from "@/lib/utils";

export default function AuditTrail({ data }: { data: AuditTrailPayload[] | null }) {

  if (!data || data.length === 0) return <div>No history found.</div>;

  const groupedData = groupAuditTrails(data)

  return (
    <div className="flex flex-col gap-4 md:px-12">

      <Item variant="outline" className="bg-muted">
        <ItemMedia variant="icon" className="mr-2">
          <LucideClockFading className="text-muted-foreground animate-spin" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle><span className="text-muted-foreground">Currently verifying by the supervisor</span></ItemTitle>
        </ItemContent>
      </Item>


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
              {trails.map((t) => (
                <Item key={t.id} variant="outline" className="relative overflow-hidden ...">
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
                      <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                        {format(new Date(t.createdOn), "h:mm aa")}
                      </div>
                    </div>
                    {t.comment && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
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
              ))}
            </div>
          </div>
        );
      })}

    </div>
  )
}