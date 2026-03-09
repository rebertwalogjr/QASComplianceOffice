"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "../../generated/prisma/client";
import { dbQuery } from "@/lib/prisma-db-utils";
import { userSelect } from "./selectors";
import { getUserId } from "./get-session";

export async function getActiveHolding(jobTransactionId: number) : Promise<{ data: HoldingPayload | null, error: any }> {
  return await dbQuery(
    prisma.holdingHistory.findFirstOrThrow({
      where: { jobTransactionId, isActive: true },
      orderBy: { createOn: "desc" },
      include: HoldingInclude
    })
  )
}

export async function liftHoldStatusById(jobTransactionId: number, holdingId: number) {
  const creatorId = await getUserId()
  if (!creatorId) throw new Error("Unauthorized")

  return await dbQuery(
    prisma.$transaction(async (tx) => {
      const job = await prisma.jobTransaction.update({
        where: { id: jobTransactionId },
        data: { onHold: false }
      })
      await prisma.holdingHistory.update({
        where: { id: holdingId },
        data: { isActive: false, endedBy: creatorId, endedOn: new Date() }
      })
      await tx.auditTrail.create({
        data: {
          jobTransactionId: job.id,
          jobStatus: 'open',
          actionTaken: "lifted the hold status of this series",
          createdBy: creatorId,
          tag: "updated"
        }
      })
    })
  )
}

const HoldingInclude = {
  creator: userSelect
} satisfies Prisma.HoldingHistoryInclude

export type HoldingPayload = Prisma.HoldingHistoryGetPayload<{
  include: typeof HoldingInclude
}>