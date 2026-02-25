"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";
import { userSelect, recipientSelect } from "./selectors";
import { promoteToFinal } from "@/lib/file-server";
import fs from 'fs-extra';
import path from 'path';

export async function createTransaction(formData: FormData) {
  const sessionId = formData.get("sessionId") as string
  const creatorId = 1002
  const status = "OPEN"
  const rawData = {
    companyId: Number(formData.get("company")),
    projectId: Number(formData.get("project")),
    auditEngagementId: Number(formData.get("auditEngagement")),
    typeOfFindingId: Number(formData.get("findingType")),
    findingCategoryId: Number(formData.get("findingCategory")),
    complianceOfficerId: Number(formData.get("complianceOfficer")),
    supervisorId: Number(formData.get("supervisor")),
    auditReportId: Number(formData.get("auditReport")),
    auditFindingNumber: "",
    issuedOn: formData.get("datetimeIssued") ? new Date(formData.get("datetimeIssued") as string) : null,
    targetDate: formData.get("datetimeTarget") ? new Date(formData.get("datetimeTarget") as string) : null,
    auditRatingId: Number(formData.get("auditRating")),
    projectManagerDepartmentHead: formData.get("projectHead") as string,
    responsibleDepartment: formData.get("responsibleDepartment") as string,
    responsiblePerson: formData.get("responsiblePerson") as string,
    recurringPerProcess: formData.get("recurringPerProcess") === "yes",
    recurringPerPerson: formData.get("recurringPerPerson") === "yes",
    recipientGroupId: Number(formData.get("recipientGroup")),
    recipientId: Number(formData.get("recipient")),
    problemCriteria: formData.get("criteria") as string,
    problemFindings: formData.get("findings") as string,
    recommendations: formData.get("recommendations") as string,

    complianceSecretariatId: Number(formData.get("complianceSecretariat")), // Hardcoded per your form's read-only value
    jobStatus: status,
    createdBy: creatorId,
  };

  const tempDirPath = path.join(process.env.FILE_SERVER_PATH!, 'Temporary', sessionId)
  let fileNames: string[] = []
  if (fs.existsSync(tempDirPath)) {
    fileNames = fs.readdirSync(tempDirPath)
  }

  const { data: newJob, error } = await dbQuery(
    prisma.$transaction(async (tx) => {
      // Create the new transaction
      const newJob = await tx.jobTransaction.create({
        data: {
          ...rawData,
          attachments: {
            create: fileNames.map(name => ({
              fileName: name,
              fileType: path.extname(name),
              fileSize: 0,
              fromRecipient: false,
              creator: { connect: { id: creatorId } }
            }))
          }
        }
      })
      // Create the audit trail
      await tx.auditTrail.create({
        data: {
          jobTransactionId: newJob.id,
          jobStatus: status,
          actionTaken: "created this series",
          createdBy: creatorId,
          tag: "created"
        }
      })
      return newJob
    })
  )

  if (newJob) {
    await promoteToFinal(sessionId, newJob.id)
  }

  if (error) { return { data: newJob, error } }
  revalidatePath("/qas");
  return { data: newJob, error }
}

export async function getTransactions(page: number = 1, pageSize: number = 10): Promise<{
  data: TransactionBasicPaylod[] | null,
  totalCount: number,
  error: any
}> {
  const skip = (page - 1) * pageSize;
  const { data, error } = await dbQuery(
    Promise.all([
      prisma.jobTransaction.findMany({
        select: transactionBasicSelect,
        skip: skip,
        take: pageSize,
        orderBy: { createdOn: "desc" }
      }),
      prisma.jobTransaction.count()
    ])
  )
  const [transactions, totalCount] = data ?? [[], 0]
  return {
    data: transactions as TransactionBasicPaylod[], 
    totalCount: totalCount as number,
    error
  }
}

export async function getTransactionById(id: number): Promise<{ data: TransactionPayload | null, error: any }> {
  return await dbQuery(
    prisma.jobTransaction.findUnique({
      where: { id },
      include: transactionInfoInclude
    })
  )
}

const transactionBasicSelect = {
  id: true,
  jobStatus: true,
  auditFindingNumber: true,
  complianceSecretariat: userSelect,
  verifier: userSelect,
  verifiedOn: true,
  approver: userSelect,
  approvedOn: true,
  creator: userSelect,
  createdOn: true,
  company: { select: { name: true } },
  project: { select: { name: true } },
  auditRating: { select: { name: true } },
  auditReport: { select: { id: true, name: true, isActive: true } },
  auditEngagement: { select: { name: true } },
  findingCategory: { select: { name: true } },
  recipient: recipientSelect,
} satisfies Prisma.JobTransactionSelect

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
  attachments: true,
  verifier: userSelect,
  approver: userSelect,
  creator: userSelect,
} satisfies Prisma.JobTransactionInclude

export type TransactionBasicPaylod = Prisma.JobTransactionGetPayload<{
  select: typeof transactionBasicSelect
}>

export type TransactionPayload = Prisma.JobTransactionGetPayload<{
  include: typeof transactionInfoInclude
}>