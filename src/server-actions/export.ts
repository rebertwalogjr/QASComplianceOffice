"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";
import { recipientSelect, userSelect } from "./selectors";

export async function getExportData(filters: any): Promise<{ data: TransactionExportPayload[] | null, error: any }> {
  const where: any = {}

  if (filters.status?.length) where.jobStatus = { in: filters.status }
  if (filters.company) where.companyId = Number(filters.company)
  if (filters.projects?.length) where.projectId = { in: filters.projects.map(Number) }
  if (filters.findings?.length) where.typeOfFindingId = { in: filters.findings.map(Number) }
  if (filters.categories?.length) where.findingCategoryId = { in: filters.categories.map(Number) }

  // Date Ranges
  const addDateFilter = (field: string, from?: string, until?: string) => {
    if (from || until) {
      where[field] = {
        ...(from && { gte: new Date(from) }),
        ...(until && { lte: new Date(until) }),
      }
    }
  }

  // addDateFilter("createdOn", filters.createdFrom, filters.createdUntil)
  // addDateFilter("approvedOn", filters.approvedFrom, filters.approvedUntil)
  // addDateFilter("closedOn", filters.closedFrom, filters.closedUntil)

  const { data, error } = await dbQuery(
    prisma.jobTransaction.findMany({
      where,
      include: transactionInfoInclude
    })
  )

  return {data, error}
}

const transactionInfoInclude = {
  company: { select: { id: true, name: true, isActive: true } },
  project: { select: { id: true, name: true, isActive: true } },
  auditEngagement: { select: { id: true, name: true, isActive: true } },
  typeOfFinding: { select: { id: true, name: true, isActive: true } },
  findingCategory: { select: { id: true, name: true, isActive: true } },
  complianceOfficer: userSelect,
  complianceSecretariat: userSelect,
  supervisor: userSelect,
  auditReport: { select: { id: true, name: true, isActive: true } },
  auditRating: { select: { id: true, name: true, isActive: true } },
  group: { select: { id: true, name: true, isActive: true } },
  recipient: recipientSelect,
  jobEscalation1User: userSelect,
  jobEscalation2User: userSelect,
  jobEscalation3User: userSelect,
  jobEscalation4User: userSelect,
  attachments: true,
  verifier: userSelect,
  approver: userSelect,
  creator: userSelect,
} satisfies Prisma.JobTransactionInclude

export type TransactionExportPayload = Prisma.JobTransactionGetPayload<{
  include: typeof transactionInfoInclude
}>