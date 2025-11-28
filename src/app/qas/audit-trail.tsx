import { Item, ItemContent, ItemDescription, ItemFooter, ItemHeader, ItemMedia, ItemTitle } from "@/components/ui/item";
import { BadgeCheck, BadgeCheckIcon, BadgeMinusIcon, User2, LucideClockFading } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "@/components/status-badge";

export default function AuditTrail() {
  return (
    <div className="flex flex-col gap-4 md:px-12">

      <Label className="text-muted-foreground">Today</Label>

      <Item variant="outline" className="">
        <ItemMedia variant="icon">
          <User2 />
        </ItemMedia>
        <ItemContent>
            <ItemTitle><div><strong>Rebert Walog Jr</strong> tag the entry as closed.</div></ItemTitle>
            <ItemDescription className="md:hidden">1:20 PM</ItemDescription>
            <StatusBadge status="closed" />
        </ItemContent>
        <ItemContent className="hidden md:block">
          <ItemDescription>1:20 PM</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="">
        <ItemMedia variant="icon">
          <User2 />
        </ItemMedia>
        <ItemContent>
          <ItemTitle><div><strong>Maria Makiling</strong> tag the entry for closing.</div></ItemTitle>
          <ItemDescription className="md:hidden">12:45 PM</ItemDescription>
          <StatusBadge status="for closing" />
        </ItemContent>
        <ItemContent className="hidden md:block">
          <ItemDescription>12:45 PM</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="">
        <ItemMedia variant="icon">
          <User2 />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>
            <div><strong>Alvaro</strong> accepted the entry with comment.</div>
          </ItemTitle>
          <ItemDescription className="md:hidden">9:45 AM</ItemDescription>
          <ItemDescription className="line-clamp-none">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae mollitia, natus corrupti minus ad tenetur dolor, eligendi officia reiciendis hic quasi obcaecati? Aspernatur, deserunt? Dolorum aliquam quidem doloribus eaque minus!</ItemDescription>
          <StatusBadge status="accepted" />
        </ItemContent>
        <ItemContent className="hidden md:block">
          <ItemDescription>9:45 AM</ItemDescription>
        </ItemContent>
      </Item>

      <Separator />

      <Label className="text-muted-foreground">This Week</Label>

      <Item variant="outline" className="">
        <ItemMedia variant="icon">
          <User2 />
        </ItemMedia>
        <ItemContent>
          <ItemTitle><div><strong>Pedro</strong> approved the entry with comment.</div></ItemTitle>
          <ItemDescription className="md:hidden">Yesterday 9:45 AM</ItemDescription>
          <ItemDescription className="line-clamp-none">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae mollitia, natus corrupti minus ad tenetur dolor, eligendi officia reiciendis hic quasi obcaecati? Aspernatur, deserunt? Dolorum aliquam quidem doloribus eaque minus!</ItemDescription>
          <StatusBadge status="approved" />
        </ItemContent>
        <ItemContent className="hidden md:block">
          <ItemDescription>Yesterday 9:45 AM</ItemDescription>
        </ItemContent>
      </Item>

      <Separator />

      <Label className="text-muted-foreground">Last Week</Label>

      <Item variant="outline" className="">
        <ItemMedia variant="icon">
          <User2 />
        </ItemMedia>
        <ItemContent>
          <ItemTitle><div><strong>Rebert Walog Jr</strong> verified the entry with comment.</div></ItemTitle>
          <ItemDescription className="md:hidden">11/8 2:56 PM</ItemDescription>
          <ItemDescription className="line-clamp-none">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae mollitia, natus corrupti minus ad tenetur dolor, eligendi officia reiciendis hic quasi obcaecati? Aspernatur, deserunt? Dolorum aliquam quidem doloribus eaque minus!</ItemDescription>
          <StatusBadge status="verified" />
        </ItemContent>
        <ItemContent className="hidden md:block">
          <ItemDescription>11/8 2:56 PM</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="bg-muted">
        <ItemMedia variant="icon">
          <LucideClockFading className="text-muted-foreground" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Waiting for Compliance Officer's approval...</ItemTitle>
        </ItemContent>
      </Item>

      <Item variant="outline" className="">
        <ItemMedia variant="icon">
          <User2 />
        </ItemMedia>
        <ItemContent>
          <ItemTitle><div><strong>You</strong> updated the entry.</div></ItemTitle>
          <ItemDescription className="md:hidden">11/8 11:17 AM</ItemDescription>
        </ItemContent>
        <ItemContent className="hidden md:block">
          <ItemDescription>11/8 11:17 AM</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="">
        <ItemMedia variant="icon">
          <User2 />
        </ItemMedia>
        <ItemContent>
          <ItemTitle><div><strong>Rebert Walog Jr</strong> declined the entry with comment.</div></ItemTitle>
          <ItemDescription className="md:hidden">11/7 4:35 PM</ItemDescription>
          <ItemDescription className="line-clamp-none">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae mollitia, natus corrupti minus ad tenetur dolor, eligendi officia reiciendis hic quasi obcaecati? Aspernatur, deserunt? Dolorum aliquam quidem doloribus eaque minus!</ItemDescription>
          <StatusBadge status="declined" />
        </ItemContent>
        <ItemContent className="hidden md:block">
          <ItemDescription>11/7 4:35 PM</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="bg-muted">
        <ItemMedia variant="icon">
          <LucideClockFading className="text-muted-foreground" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Waiting for Compliance Officer's approval...</ItemTitle>
        </ItemContent>
      </Item>

      <Item variant="outline" className="">
        <ItemMedia variant="icon">
          <User2 />
        </ItemMedia>
        <ItemContent>
          <ItemTitle><div><strong>Maria Makiling</strong> verified the entry with comment.</div></ItemTitle>
          <ItemDescription className="md:hidden">11/5 1:23 PM</ItemDescription>
          <ItemDescription className="line-clamp-none">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae mollitia, natus corrupti minus ad tenetur dolor, eligendi officia reiciendis hic quasi obcaecati? Aspernatur, deserunt? Dolorum aliquam quidem doloribus eaque minus!</ItemDescription>
          <StatusBadge status="verified" />
        </ItemContent>
        <ItemContent className="hidden md:block">
          <ItemDescription>11/5 1:23 PM</ItemDescription>
        </ItemContent>
      </Item>

      <Item variant="outline" className="bg-muted">
        <ItemMedia variant="icon">
          <LucideClockFading className="text-muted-foreground" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Endorsed to team leader.</ItemTitle>
        </ItemContent>
      </Item>

      <Item variant="outline" className="">
        <ItemMedia variant="icon">
          <User2 />
        </ItemMedia>
        <ItemContent>
          <ItemTitle><div><strong>You</strong> created an entry.</div></ItemTitle>
          <ItemDescription className="md:hidden">11/2 9:47 AM</ItemDescription>
        </ItemContent>
        <ItemContent className="hidden md:block">
          <ItemDescription>11/2 9:47 AM</ItemDescription>
        </ItemContent>
      </Item>

    </div>
  )
}