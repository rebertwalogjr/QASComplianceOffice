import { CircleCheck, CircleX, Hand, Loader, ThumbsUp } from "lucide-react";
import { Badge } from "./ui/badge"

function getStatusLabel(status: string) {
  switch (status) {
    case "closed":
      return <>
        <CircleCheck className="text-white fill-green-500 dark:fill-green-400" />
        { status }
      </>
        break;
    case "request for closing":
      return <>
        <CircleCheck />
        { status }
      </>
        break;
    case "open":
      return <>
        <Loader />
        { status }
      </>
        break;
    case "request for hold":
      return <>
        <Hand />
        { status }
      </>
        break;
    case "on-hold":
      return <>
        <Hand className="fill-yellow-300" />
        { status }
      </>
        break;
    case "cancelled":
      return <>
        <CircleX className="text-white fill-red-500 dark:fill-red-400" />
        { status }
      </>
        break;
    case "accepted":
      return <>
        <ThumbsUp />
        { status }
      </>
        break;
    default:
      return status;
  }
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className="text-muted-foreground px-1.5">
        { getStatusLabel(status.toLowerCase()) }
      </Badge>
  )
}