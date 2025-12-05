"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";

export default function AddUser() {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm" className="rounded-2xl"><PlusCircle className="fill-white text-primary" />Add User</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader >
          <DrawerTitle>New User</DrawerTitle>
          <DrawerDescription>sda</DrawerDescription>
        </DrawerHeader>

        {/* <Separator /> */}

        <div className="flex flex-col gap-4 overflow-y-auto px-4 py-4 text-sm">
          <form className="flex flex-col gap-4">

            <div className="flex flex-col gap-3">
              <Label htmlFor="seriesno">Employee ID</Label>
              <Input id="seriesno" />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="auditno">First Name</Label>
              <Input id="auditno" />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="company">Last Name</Label>
              <Input id="company" />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="project">Username</Label>
              <Input id="project" />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="status">Status</Label>
              <Input id="status" />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="rating">Email</Label>
              <Input id="rating" />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="engagement">Company</Label>
              <Input id="engagement" />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="category">User Access</Label>
              <Input id="category" />
            </div>     

          </form>
        </div>

        <DrawerFooter>
          <Button>
            Save
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}