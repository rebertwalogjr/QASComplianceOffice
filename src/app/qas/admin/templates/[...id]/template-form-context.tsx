"use client"

// import {  FormProvider, useFormContext } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { EmailTemplate } from "../../../../../../generated/prisma/client"
import { updateTemplate } from "@/server-actions/template"
import { toast } from "sonner"

interface EmailTemplateProps {
  template: EmailTemplate
  children: React.ReactNode
}

export const emailTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  description: z.string().optional(),
})

export type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>

export default function TemplateFormContext({ template, children }: EmailTemplateProps) {
  const methods = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateSchema),
    mode: "onChange",
    values: {
      id: template.id.toString(),
      name: template.name,
      subject: template.subject,
      content: template.content,
      description: template.description,
    }
  })

  const onSubmit = async (values: EmailTemplateFormValues) => {
    const formData = new FormData()

    formData.append("id", values.id)
    formData.append("name", values.name.toUpperCase())
    formData.append("subject", values.subject)
    formData.append("content", values.content)

    const result = await updateTemplate(formData)

    if (result.success) {
      toast.success(result.message, { position: "top-center" })
    } else {
      toast.error(result.message, { position: "top-center" })
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        id="template-editor-form"
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        <div className="@container/main flex flex-col lg:h-svh overflow-hidden">
          {children}
        </div>
      </form>
    </FormProvider>
  )
}