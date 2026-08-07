"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { dbQuery } from "@/lib/prisma-db-utils"
import { EmailTemplate, Prisma } from "../../generated/prisma/client"
import { getUserId } from "./get-session"

export async function getTemplates() {
  return await dbQuery(
    prisma.emailTemplate.findMany({
      orderBy: { createdOn: "desc" }
    })
  )
}

export async function createTemplate(formData: FormData) {
  const name = formData.get("name") as string
  const subject = formData.get("subject") as string
  const content = formData.get("content") as string
  const description = formData.get("description") as string
  const currentUserId = await getUserId()

  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }

  const { data, error } = await dbQuery(
    prisma.emailTemplate.create({
      data: {
        name,
        subject,
        content,
        description,
        createdBy: currentUserId
      }
    })
  )
  if (error) { return { success: false, message: error } }
  revalidatePath("/templates")
  return { success: true, message: "Email template created." }
}

export async function getTemplateById(id: number): Promise<{ data: EmailTemplate | null, error: any }> {
  return await dbQuery(
    prisma.emailTemplate.findUnique({
      where: { id }
    })
  )
}

export async function updateTemplate(formData: FormData) {
  const id = Number(formData.get("id") as string)

  const rawData = {
    name: formData.get("name") as string,
    subject: formData.get("subject") as string,
    content: formData.get("content") as string,
  }
  
  const { error } = await dbQuery(
    prisma.emailTemplate.update({
      where: { id },
      data: rawData
    })
  )
  if (error) { return { success: false, message: error } }
  revalidatePath("/templates")
  return { success: true, message: "Email template saved" }
}

export type EmailTemplatePayload = Prisma.EmailTemplateGetPayload<{
  select: { id: true; name: true; subject: true, description: true, content: true }
}>