import { BadgeAlert, BadgeCheck, BadgeCheckIcon, BadgeMinusIcon, BadgeX, CircleCheck, CircleX, Hand, Loader, LucideAlarmClockOff, ThumbsUp } from "lucide-react";
import { Badge } from "./ui/badge"

function getStatusLabel(status: string) {
  switch (status.toLowerCase()) {
    case "closed":
      return <Badge className="bg-gradient-horizontal"><BadgeCheck />Closed</Badge>
    case "for closing":
      return <Badge className="bg-primary/10 border-primary text-primary"><BadgeCheck />For Closing</Badge>
    case "accepted":
      return <Badge className="bg-green-50 border-green-500 text-green-500"><BadgeCheckIcon />Accepted</Badge>
    case "new":
      return <Badge className="bg-cyan-50 border-cyan-500 text-cyan-500"><BadgeCheck />New</Badge>
    case "on-hold":
      return <Badge className="bg-orange-50 border-orange-500 text-orange-500"><LucideAlarmClockOff />On-Hold</Badge>
    case "cancelled":
      return <Badge className="bg-muted border-muted text-muted-foreground"><BadgeX />Cancelled</Badge>
    // case "declined":
    //   return <Badge className="bg-red-50 border-red-500 text-red-500"><BadgeMinusIcon />Declined</Badge>
    case "open":
      return <Badge className="bg-yellow-50 border-yellow-500 text-yellow-500"><BadgeMinusIcon />Open</Badge>
    default:
      return <Badge className="bg-yellow-50 border-yellow-500 text-yellow-500"><BadgeMinusIcon />{ status }</Badge>;
  }
}

export default function StatusBadge({ status }: { status: string }) {
  return getStatusLabel(status)
}