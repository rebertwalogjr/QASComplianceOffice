"use client"

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlusCircle, X } from "lucide-react";
import React from "react";

export default function CreateDrawer() {
  const isMobile = useIsMobile();
  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm" className="rounded-2xl">
          <PlusCircle className="fill-white text-primary" />
          Add Group
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
          <DrawerTitle>Add New Group</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon-sm">
              <X />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <Separator />

        <div className="flex flex-col gap-4 overflow-y-auto px-4 py-4 text-sm">
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>

            <FieldGroup>
              <FieldSet>
                <FieldGroup>

                  <Field>
                    <FieldLabel htmlFor="groupCode">Group Code</FieldLabel>
                    <Input id="groupCode" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="groupName">Name</FieldLabel>
                    <Input id="groupName" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="project">Project / Department</FieldLabel>
                    <Select>
                      <SelectTrigger id="project">
                        <SelectValue placeholder="Select project or department..."  />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="proj-a">Project A</SelectItem>
                        <SelectItem value="proj-b">Project B</SelectItem>
                        <SelectItem value="proj-c">Project C</SelectItem>
                        <SelectItem value="proj-f">Project D</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="groupInCharge">In-Charge</FieldLabel>
                    <Input id="groupInCharge" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="groupInChargeEmail">In-Charge Email</FieldLabel>
                    <Input id="groupInChargeEmail" />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
                    <Textarea id="remarks" />
                  </Field>

                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </form>
        </div>

        <DrawerFooter>
          <Button>Save</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}