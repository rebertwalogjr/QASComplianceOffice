"use server"

import { getPrisma } from "@/lib/prisma";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";
import { userSelect } from "./selectors";

const prisma = getPrisma()

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
  creator: userSelect,
  jobTransaction: { select: { jobStatus: true, verifiedOn: true, approvedOn: true, onHold: true } }
} satisfies Prisma.AuditTrailInclude

export type AuditTrailPayload = Prisma.AuditTrailGetPayload<{
  include: typeof auditTrailInclude
}>