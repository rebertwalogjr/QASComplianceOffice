import { TextAreaComposerWithButton } from "@/components/textarea-composer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonalIcon } from "lucide-react";


export default function UpdateTrail() {
  return (
    <div className="md:px-12">
    <div className="flex flex-col h-[600px] max-h-screen gap-4 md:px-2 border rounded-lg bg-background">

      <div id="scrollable-section" className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-muted"> 
        <div className="w-full flex">
          <div className="flex flex-col gap-3 w-[80%]">
            <div className="flex justify-between">
              <Label className="ml-1">Juan</Label>
              <span className="text-xs font-normal text-muted-foreground">11:30</span>
            </div>
            <Item variant="outline" className="relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
              <ItemContent>
                <Label className="font-normal tracking-wide leading-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis aspernatur totam hic atque sit laborum saepe minus officiis perspiciatis inventore! Vero similique recusandae assumenda tenetur dolores eaque explicabo ipsum quaerat.</Label>
              </ItemContent>
            </Item>
          </div>
        </div>

        <div className="w-full flex justify-end">
          <div className="flex flex-col gap-3 w-[80%]">
            <div className="flex justify-between">
              <Label className="ml-1">You</Label>
              <span className="text-xs font-normal text-muted-foreground">11:30</span>
            </div>
            <Item variant="outline" className="relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500 bg-primary/20 border-primary">
              <ItemContent>
                <Label className="font-normal tracking-wide leading-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis aspernatur totam hic atque sit laborum saepe minus officiis perspiciatis inventore! Vero similique recusandae assumenda tenetur dolores eaque explicabo ipsum quaerat.</Label>
              </ItemContent>
            </Item>
          </div>
        </div>
      </div>

      <div id="fixed-at-the-bottom" className="w-full p-4 bg-background">
        <TextAreaComposerWithButton />
      </div>

    </div>
    </div>
  )
}