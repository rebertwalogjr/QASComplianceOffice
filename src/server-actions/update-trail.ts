"use server"

import { getPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { getUserId } from "./get-session";
import { userSelect } from "./selectors";
import { Prisma } from "../../generated/prisma/client";
import { triggerWebhook } from "@/lib/webhook";

export async function createUpdateTrail(formData: FormData) {
  const prisma = getPrisma()
  const creatorId = await getUserId()
  const jobTransactionId = Number(formData.get("jobTransactionId"))
  const message = formData.get("message") as string

  if (!creatorId) {
    throw new Error("You must be logged in.")
  }

  const rawData = {
    jobTransactionId: jobTransactionId,
    message: message,
    createdBy: creatorId,
  }

  const {data, error} = await dbQuery(
    prisma.updateTrail.create({
      data: { ...rawData },
      include: UpdateTrailInclude
    })
  )

  // EMAIL NOTIF
  // if (data) {
  //   const emailHtml = await getUpdateTrailEmailHtml({data, message})
  //   triggerDatabaseMail({
  //     to: emailHtml.recipient,
  //     subject: emailHtml.subject,
  //     body: emailHtml.template
  //   })
  // }

  triggerWebhook(data)

  revalidatePath(`/qas/${data.jobTransactionId}`)

  return {data, error}
}

export async function getUpdateTrailByTransactionId(jobTransactionId: number) : Promise<{data: UpdateTrailPayload[] | null, error: any}> {
  const prisma = getPrisma()
  
  return await dbQuery(
    prisma.updateTrail.findMany({
      where:{ jobTransactionId },
      include: UpdateTrailInclude
    })
  )
}

const UpdateTrailInclude = {
  creator: userSelect,
  jobTransaction: { select: { recipient: userSelect, supervisor: userSelect, complianceOfficer: userSelect } }
} satisfies Prisma.UpdateTrailInclude

export type UpdateTrailPayload = Prisma.UpdateTrailGetPayload<{
  include: typeof UpdateTrailInclude
}>