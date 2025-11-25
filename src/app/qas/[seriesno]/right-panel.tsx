import { Card } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ellipsis, EllipsisVertical } from "lucide-react";


export default function RightPanel() {
  return (
    <div className="bg-background h-full py-4 px-4 border-l shadow-card">
      <Tabs defaultValue="audit" className="bg-background">
        <TabsList className="gap-2">
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="review">Review Trail</TabsTrigger>
          <TabsTrigger value="update">Update Trail</TabsTrigger>
        </TabsList>
        <TabsContent value="audit" className="p-2">
          <div className=" h-[calc(100vh-148px)] overflow-y-auto space-y-3">
            {Array.from({ length: 21 }).map((_, index) => (
              <Item key={index} variant="outline">
                <ItemContent>
                  <ItemTitle>Item { index + 1 }</ItemTitle>
                  <ItemDescription>
                    Something they've done...
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <EllipsisVertical className="size-4" />
                </ItemActions>
              </Item>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="update">
          Update Trail
        </TabsContent>
      </Tabs>
    </div>
  )
}