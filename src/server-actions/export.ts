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

export async function getExportDatav2(filters: any): Promise<{ data: jobTransactionViewSelect[] | null, error: any }> {
  const conditions: Prisma.Sql[] = []

  if (filters.status?.length) {
    conditions.push(Prisma.sql`jobStatus IN (${Prisma.join(filters.status)})`)
  }

  if (filters.company) {
    conditions.push(Prisma.sql`companyId = ${Number(filters.company)}`)
  }

  if (filters.projects?.length) {
    conditions.push(Prisma.sql`projectId IN (${Prisma.join(filters.projects.map(Number))})`)
  }

  if (filters.findings?.length) {
    conditions.push(Prisma.sql`typeOfFindingId IN (${Prisma.join(filters.findings.map(Number))})`)
  }

  if (filters.categories?.length) {
    conditions.push(Prisma.sql`findingCategoryId IN (${Prisma.join(filters.categories.map(Number))})`)
  }

  if (filters.createdFrom) {
    const fromDate = new Date(filters.createdFrom)
    fromDate.setHours(0, 0, 0, 0)
    conditions.push(Prisma.sql`createdOn >= ${fromDate}`)
  }

  if (filters.createdUntil) {
    const untilDate = new Date(filters.createdUntil)
    untilDate.setHours(23, 59, 59, 999)
    conditions.push(Prisma.sql`createdOn <= ${untilDate}`)
  }

  const whereClause = conditions.length
  ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
  : Prisma.empty

  const { data, error } = await dbQuery(
    prisma.$queryRaw<jobTransactionViewSelect[]>`
      SELECT * FROM v_jobTransactionSelect 
      ${whereClause}
    `
  )

  // const finalQuery = conditions.length > 0
  //   ? Prisma.sql`SELECT * FROM v_jobTransactionSelect WHERE ${Prisma.join(conditions, ' AND ')}`
  //   : Prisma.sql`SELECT * FROM v_jobTransactionSelect`

  // const { data, error } = await dbQuery(
  //   prisma.$queryRaw<jobTransactionViewSelect[]>(finalQuery)
  // )

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

export interface jobTransactionViewSelect {
  jobTransactionID: string
  auditReportNumber: string
  complianceSecretariat: string
  company: string
  project: string
  auditEngagement: string
  typeOfFinding: string
  findingCategory: string
  auditRating: string
  problemFindings: string
  responsibleDepartment: string
  responsiblePerson: string
  projectManagerDepartmentHead: string
  issuedOn: Date
  createdOn: Date
  targetDate: Date
  closedOn: Date
  approvedOn: Date
  agingDays: number
  jobStatus: string
  recurringPerProcess: boolean
  recurringPerPerson: boolean
  cancelReason: string
  recipient: string
  correctiveAction: string
  correctiveCommitmentDate: Date
  preventiveAction: string
  preventiveCommitmentDate: Date
}