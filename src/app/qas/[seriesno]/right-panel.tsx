import StatusBadge from "@/components/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ellipsis, EllipsisVertical } from "lucide-react";


export default function RightPanel() {
  return (
    <div className="bg-muted h-full py-4 px-4 border-l overflow-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Series - #
            <Label className="text-xl text-primary">1</Label>
            <StatusBadge status="closed" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis sapiente ut ea commodi cum nam consequatur, dignissimos earum omnis quas, placeat odio necessitatibus rem ipsum voluptas odit quasi dolorum? Earum?</CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}