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
      const filterConditions: any = {}
      if (from) {
        const fromDate = new Date(from)
        fromDate.setHours(0, 0, 0, 0) // Set to the very start of the day: 00:00:00.000
        filterConditions.gte = fromDate
      }
      if (until) {
        const untilDate = new Date(until)
        untilDate.setHours(23, 59, 59, 999) // Set to the very end of the day: 23:59:59.999
      }
      where[field] = filterConditions
    }
  }

  addDateFilter("createdOn", filters.createdFrom, filters.createdUntil)
  // addDateFilter("approvedOn", filters.approvedFrom, filters.approvedUntil)
  // addDateFilter("closedOn", filters.closedFrom, filters.closedUntil)

  const { data, error } = await dbQuery(
    prisma.jobTransaction.findMany({
      where,
      include: transactionInfoInclude
    })
  )

  return { data, error }
}

const transactionInfoInclude = {
  company: { select: { name: true } },
  project: { select: { name: true } },
  auditEngagement: { select: { name: true } },
  typeOfFinding: { select: { name: true } },
  findingCategory: { select: { name: true } },
  complianceOfficer: userSelect,
  complianceSecretariat: userSelect,
  supervisor: userSelect,
  auditReport: { select: { name: true } },
  auditRating: { select: { name: true } },
  group: { select: { name: true } },
  recipient: recipientSelect,
  jobEscalation1User: userSelect,
  jobEscalation2User: userSelect,
  jobEscalation3User: userSelect,
  jobEscalation4User: userSelect,
  verifier: userSelect,
  approver: userSelect,
  creator: userSelect,
} satisfies Prisma.JobTransactionInclude

export type TransactionExportPayload = Prisma.JobTransactionGetPayload<{
  include: typeof transactionInfoInclude
}>