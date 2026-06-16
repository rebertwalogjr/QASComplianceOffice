"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { getUserId } from "./get-session";
import { userSelect } from "./selectors";
import { Prisma } from "../../generated/prisma/client";
import { triggerWebhook } from "@/lib/webhook";

export async function createReviewTrail(formData: FormData) {
  const creatorId = await getUserId()

  if (!creatorId) {
    throw new Error("You must be logged in.")
  }

  const rawData = {
    jobTransactionId: Number(formData.get("jobTransactionId")),
    message: formData.get("message") as string,
    createdBy: creatorId,
  }

  const {data, error} = await dbQuery(
    prisma.reviewTrail.create({
      data: { ...rawData }
    })
  )

  triggerWebhook(data)

  revalidatePath(`/qas/${data.jobTransactionId}`)

  return {data, error}
}

export async function getReviewTrailByTransactionId(jobTransactionId: number) : Promise<{data: ReviewTrailPayload[] | null, error: any}> {
  return await dbQuery(
    prisma.reviewTrail.findMany({
      where:{ jobTransactionId },
      include: ReviewTrailInclude
    })
  )
}

const ReviewTrailInclude = {
  creator: userSelect,
  jobTransaction: { select: { recipient: userSelect, supervisor: userSelect, complianceOfficer: userSelect } }
} satisfies Prisma.ReviewTrailInclude

export type ReviewTrailPayload = Prisma.ReviewTrailGetPayload<{
  include: typeof ReviewTrailInclude
}>