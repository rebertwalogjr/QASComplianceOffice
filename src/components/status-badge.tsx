import { BadgeCheck, BadgeCheckIcon, BadgeMinusIcon, CircleCheck, CircleX, Hand, Loader, ThumbsUp } from "lucide-react";
import { Badge } from "./ui/badge"

function getStatusLabel(status: string) {
  switch (status) {
    case "closed":
      return <Badge className="bg-gradient-horizontal"><BadgeCheck />Closed</Badge>
    case "for closing":
      return <Badge className="bg-primary/10 border-primary text-primary"><BadgeCheck />For Closing</Badge>
    case "approved":
      return <Badge className="bg-cyan-500/10 border-cyan-500 text-cyan-500"><BadgeCheckIcon />Approved</Badge>
    case "accepted":
      return <Badge className="bg-cyan-500/10 border-cyan-500 text-cyan-500"><BadgeCheck />Accepted</Badge>
    case "verified":
      return <Badge className="bg-green-600/10 border-green-600 text-green-600"><BadgeCheckIcon />Verified</Badge>
    case "for hold":
      return <Badge className="bg-yellow-500/10 border-yellow-500 text-yellow-500"><BadgeMinusIcon />For Hold</Badge>
    case "on-hold":
      return <Badge className="bg-yellow-500/10 border-yellow-500 text-yellow-500"><BadgeMinusIcon />On Hold</Badge>
    case "cancelled":
      return <Badge className="bg-red-500/10 border-red-500 text-red-500"><BadgeMinusIcon />Cancelled</Badge>
    case "declined":
      return <Badge className="bg-red-500/10 border-red-500 text-red-500"><BadgeMinusIcon />Declined</Badge>
    default:
      return <Badge className="bg-muted border-muted-foreground text-muted-foreground"><BadgeMinusIcon />Open</Badge>;
  }
}

export default function StatusBadge({ status }: { status: string }) {
  // return (
  //   <Badge variant="outline" className="text-muted-foreground px-1.5">
  //       { getStatusLabel(status.toLowerCase()) }
  //     </Badge>
  // )
  return getStatusLabel(status)
}