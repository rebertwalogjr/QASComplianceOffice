"use client"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Loader2, PlusCircle, X } from "lucide-react";
import { createCompany } from "@/server-actions/company";


const companySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  code: z.string().min(1, "Company code is required"),
})

type CompanyFormValues = z.infer<typeof companySchema>

export default function CreateDrawer() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting }, } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      code: ""
    }
  })

  const onsubmit = async (values: CompanyFormValues) => {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("code", values.code)

    const response = await createCompany(formData)

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success("Company created successfully!", { position: "top-center" })
      reset()
      setIsOpen(false)
    }
  }

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) reset()
      }}
    >
      <DrawerTrigger asChild>
        <Button variant="outline" size={isMobile ? "icon-sm" : "sm"}>
          <PlusCircle />
          {!isMobile ? "Add Company" : ""}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col h-full">
          <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
            <DrawerTitle>Add New Company</DrawerTitle>
            <DrawerDescription></DrawerDescription>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon-sm">
                <X className="size-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <Separator />

          <div className="flex-1 overflow-y-auto px-4 py-4 text-sm">
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <div className="flex flex-col gap-5">

                    {/* Name Field */}
                    <Field>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        id="name"
                        placeholder="e.g. DMCI Homes Inc."
                        {...register("name")}
                      />
                      {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                    </Field>

                    {/* Code Field */}
                    <Field>
                      <FieldLabel htmlFor="code">Code</FieldLabel>
                      <Input
                        id="code"
                        placeholder="e.g. DMCI"
                        {...register("code")}
                      />
                      {errors.code && <p className="text-xs text-destructive mt-1">{errors.code.message}</p>}
                    </Field>
                  </div>
                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </div>

          <DrawerFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Company
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}