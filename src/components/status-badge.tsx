import { BadgeAlert, BadgeCheck, BadgeCheckIcon, BadgeMinusIcon, BadgeX, CircleCheck, CircleX, Hand, Loader, LoaderCircle, LucideAlarmClockOff, ThumbsUp } from "lucide-react"
import { Badge } from "./ui/badge"

function getStatusLabel(status: string) {
  switch (status.toLowerCase()) {
    case "closed":
      return <Badge className="bg-gradient-horizontal dark:text-white"><BadgeCheck />Closed</Badge>
    case "for closing":
      return <Badge className="bg-primary/10 border-primary text-primary dark:bg-blue-600 dark:border-blue-600"><BadgeCheck />For Closing</Badge>
    case "accepted":
      return <Badge className="bg-green-50 border-green-500 text-green-500 dark:bg-green-500 dark:text-green-50"><BadgeCheckIcon />Accepted</Badge>
    case "new":
      return <Badge className="bg-cyan-50 border-cyan-500 text-cyan-500 dark:bg-cyan-500 dark:text-cyan-50"><BadgeCheck />New</Badge>
    case "on-hold":
      return <Badge className="bg-orange-50 border-orange-500 text-orange-500 dark:bg-orange-500 dark:text-orange-50"><LucideAlarmClockOff />On-Hold</Badge>
    case "request-hold":
      return <Badge className="bg-orange-50 border-orange-300 text-orange-300 dark:bg-orange-300 dark:text-orange-50"><LucideAlarmClockOff />Request hold</Badge>
    case "cancelled":
      return <Badge className="bg-muted border-muted text-muted-foreground dark:bg-muted-foreground dark:text-muted"><BadgeX />Cancelled</Badge>
    // case "declined":
    //   return <Badge className="bg-red-50 border-red-500 text-red-500"><BadgeMinusIcon />Declined</Badge>
    case "open":
      return <Badge className="bg-yellow-50 border-yellow-500 text-yellow-500 dark:bg-yellow-500 dark:text-yellow-50"><BadgeMinusIcon />Open</Badge>
    default:
      return <Badge className="bg-gray-50 border-gray-500 text-gray-500 dark:bg-gray-500 dark:text-gray-50"><BadgeMinusIcon />Unknown</Badge>
  }
}

export default function StatusBadge({ status }: { status: string }) {
  return getStatusLabel(status)
}