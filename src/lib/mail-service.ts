import { prisma } from "@/lib/prisma"

interface MailPayload {
  to: string
  subject: string
  body: string
  cc?: string
}

export async function triggerDatabaseMail({ to, subject, body, cc = "" }: MailPayload) {
  try {
    await prisma.$executeRaw`EXEC [dbo].[pr_MailSend] 
      @email_recipient = ${to}, 
      @email_subject = ${subject}, 
      @email_body = ${body}, 
      @email_cc = ${cc}`;
    return { success: true }
  } catch (error) {
    console.error("SQL Mail Error:", error)
    return { success: false, error }
  }
}