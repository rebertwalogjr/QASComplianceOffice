"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";
import { userSelect } from "./selectors";

export async function getAuditTrailByTransId(id: number) : Promise<{ data: AuditTrailPayload[] | null, error: any }> {
  return await dbQuery(
    prisma.auditTrail.findMany({
      where: { jobTransactionId: id },
      include: auditTrailInclude,
      orderBy: { createdOn: 'desc' }
    })
  )
}

const auditTrailInclude = {
  creator: userSelect
} satisfies Prisma.AuditTrailInclude

export type AuditTrailPayload = Prisma.AuditTrailGetPayload<{
  include: typeof auditTrailInclude
}>