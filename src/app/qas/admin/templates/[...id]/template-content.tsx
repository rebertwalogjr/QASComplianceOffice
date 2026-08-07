"use client"

import { HtmlViewer } from "@/components/html-viewer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext } from "react-hook-form"
import { EmailTemplateFormValues } from "./template-form-context"

export default function TemplateContent() {
  const { register, watch, formState: { errors } } = useFormContext<EmailTemplateFormValues>()
  const contentValue = watch("content")

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-full">

      <div className="flex flex-1 flex-col gap-2 p-2 overflow-y-auto">
        <Label className="text-lg font-bold">Template Content</Label>

        <div className="border-2 rounded-md flex flex-col gap-2 p-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input
              {...register("name")}
              className="uppercase"
            />
            {errors.name && <span className="text-sm text-destructive">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>Email Subject</Label>
            <Input
              {...register("subject")}
            />
            {errors.subject && <span className="text-sm text-destructive">{errors.subject.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label>HTML Content</Label>
            <Textarea
              className="font-mono resize-none"
              {...register("content")}
            />
            {errors.content && <span className="text-sm text-destructive">{errors.content.message}</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-2 bg-muted">
        <Label className="text-lg font-bold">Live Preview</Label>
        <HtmlViewer content={contentValue} className="bg-background" />
      </div>

    </div>
  )
}