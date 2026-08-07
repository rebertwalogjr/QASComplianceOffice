"use client"

// import {  FormProvider, useFormContext } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { createTemplate } from "@/server-actions/template"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface EmailTemplateProps {
  children: React.ReactNode
}

export const emailTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
  description: z.string().optional(),
})

export type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>

export default function TemplateFormContext({ children }: EmailTemplateProps) {
  const router = useRouter()

  const methods = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      subject: "",
      content: "",
      description: "",
    }
  })

  const onSubmit = async (values: EmailTemplateFormValues) => {
    const formData = new FormData()

    formData.append("name", values.name.toUpperCase())
    formData.append("subject", values.subject)
    formData.append("content", values.content)
    formData.append("description", "")

    const result = await createTemplate(formData)

    if (result.success) {
      toast.success(result.message, { position: "top-center" })
      router.push("/qas/admin/templates")
      router.refresh()
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