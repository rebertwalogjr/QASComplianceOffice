import { BadgeAlert, BadgeCheck, BadgeCheckIcon, BadgeMinusIcon, BadgeX, CircleCheck, CircleX, Hand, Loader, ThumbsUp } from "lucide-react";
import { Badge } from "./ui/badge"

function getStatusLabel(status: string) {
  switch (status) {
    case "Closed":
      return <Badge className="bg-gradient-horizontal"><BadgeCheck />Closed</Badge>
    case "For Closing":
      return <Badge className="bg-primary/10 border-primary text-primary"><BadgeCheck />For Closing</Badge>
    case "Accepted":
      return <Badge className="bg-green-50 border-green-500 text-green-500"><BadgeCheckIcon />Accepted</Badge>
    case "New":
      return <Badge className="bg-cyan-50 border-cyan-500 text-cyan-500"><BadgeCheck />New</Badge>
    case "On-Hold":
      return <Badge className="bg-orange-50 border-orange-500 text-orange-500"><BadgeAlert />On-Hold</Badge>
    case "Cancelled":
      return <Badge className="bg-red-50 border-red-500 text-red-500"><BadgeX />Cancelled</Badge>
    case "Declined":
      return <Badge className="bg-red-50 border-red-500 text-red-500"><BadgeMinusIcon />Declined</Badge>
    default:
      return <Badge className="bg-yellow-50 border-yellow-500 text-yellow-500"><BadgeMinusIcon />{ status }</Badge>;
  }
}

export default function StatusBadge({ status }: { status: string }) {
  return getStatusLabel(status)
}