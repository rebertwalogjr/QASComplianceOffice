"use client"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Loader2, PlusCircle, X } from "lucide-react"
import { createFindingCategory } from "@/server-actions/finding-category"

const findingCategorySchema = z.object({
  name: z.string().min(1, "Finding Category name is required")
})

type FindingCategoryFormValues = z.infer<typeof findingCategorySchema>

export default function CreateDrawer() {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting }, } = useForm<FindingCategoryFormValues>({
    resolver: zodResolver(findingCategorySchema),
    defaultValues: {
      name: "",
    }
  })

  const onSubmit = async (values: FindingCategoryFormValues) => {
    const formData = new FormData();
    formData.append("name", values.name);

    const response = await createFindingCategory(formData);

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success("Finding category created successfully!", { position: "top-center" })
      reset()
      setIsOpen(false)
    }
  }

  const handleClose = () => {
    reset()
    setIsOpen(false)
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
        <Button variant="default" size="sm" className="rounded-2xl">
          <PlusCircle className="fill-white text-primary" />
          Add Category
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <DrawerHeader className="gap-1 flex flex-row items-center h-12 justify-between">
            <DrawerTitle>Add New Category</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon-sm">
                <X />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <Separator />

          <div className="flex flex-col gap-4 overflow-y-auto px-4 py-4 text-sm">
            <FieldGroup>
              <FieldSet>
                <FieldGroup>

                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input
                      id="name"
                      placeholder="e.g. Financial"
                      {...register("name")}
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                  </Field>

                </FieldGroup>
              </FieldSet>
            </FieldGroup>
          </div>

          <DrawerFooter className="border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Save Category
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