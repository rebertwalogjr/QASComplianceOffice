import StatusBadge from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/datepicker";
import { Separator } from "@/components/ui/separator";


export default function RightPanel() {
  return (
    <div className="bg-muted py-4 px-4 border-l h-full">

      <div className="flex flex-col h-full bg-background rounded-md border shadow-2xl">

        <div className="flex items-center gap-3 p-4 berder-b border-b">
          <Label className="text-lg">Series - #10</Label>
          <StatusBadge status="closed" />
        </div>

        <div className="flex flex-col gap-6 px-4 py-4 h-full overflow-auto">
          <div className="flex flex-col gap-3">
            <Label htmlFor="comment">Corrective Action</Label>
            <Textarea id="comment" placeholder="Type here..." className="resize-none" />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="comment">Commitment Date</Label>
            <DatePicker />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="comment">Preventive Action</Label>
            <Textarea id="comment" placeholder="Type here..." className="resize-none" />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="comment">Commitment Date</Label>
            <DatePicker />
          </div>

          <Separator />
          
          <div className="flex flex-col gap-3">
            <Label htmlFor="comment">Hold From</Label>
            <DatePicker />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="comment">Hold Until</Label>
            <DatePicker />
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <Checkbox />
            <Label>Verify</Label>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="comment">Comments / Remarks</Label>
            <Textarea id="comment" placeholder="Type here..." className="resize-none" />
          </div>
        </div>

        <div className="w-full border-t px-4 py-4">
          <Button size="lg" className="w-full">Submit</Button>
        </div>

      </div>

    </div>

  )
}