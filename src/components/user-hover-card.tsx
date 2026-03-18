import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Label } from "./ui/label";

export function UserHoverCard({ data }: { data: any }) {
  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Label className="hover:text-primary whitespace-nowrap cursor-pointer transition-colors">{data?.fullName}</Label>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-0.5">
        <div className="text-sm font-semibold">{data?.employeeNumber}</div>
        <div className="text-sm">{data?.fullName}</div>
        <div className="text-muted-foreground mt-1 text-xs">{`${data?.position} - ${data?.department}`}</div>
      </HoverCardContent>
    </HoverCard>
  )
}