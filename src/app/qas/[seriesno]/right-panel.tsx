import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ellipsis, EllipsisVertical } from "lucide-react";


export default function RightPanel() {
  return (
    <div className="bg-muted h-full py-4 px-4 border-l overflow-auto">
      <Card>
        <CardHeader>Status</CardHeader>
        <CardDescription>Something...</CardDescription>
      </Card>
    </div>
  )
}