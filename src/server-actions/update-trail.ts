"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { getUserId } from "./get-session";
import { userSelect } from "./selectors";
import { Prisma } from "../../generated/prisma/client";

export async function createUpdateTrail(formData: FormData) {
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
    prisma.updateTrail.create({
      data: { ...rawData }
    })
  )

  revalidatePath(`/qas/${data.jobTransactionId}`)

  return {data, error}
}

export async function getUpdateTrailByTransactionId(jobTransactionId: number) : Promise<{data: UpdateTrailPayload[] | null, error: any}> {
  return await dbQuery(
    prisma.updateTrail.findMany({
      where:{ jobTransactionId },
      include: { creator: userSelect }
    })
  )
}

const UpdateTrailInclude = {
  creator: userSelect,
} satisfies Prisma.UpdateTrailInclude

export type UpdateTrailPayload = Prisma.UpdateTrailGetPayload<{
  include: typeof UpdateTrailInclude
}>