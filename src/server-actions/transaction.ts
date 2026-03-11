"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";
import { userSelect, recipientSelect } from "./selectors";
import { promoteToFinal } from "@/lib/file-server";
import fs from 'fs-extra';
import path from 'path';
import { getUserId } from "./get-session";

export async function createTransaction(formData: FormData) {
  const sessionId = formData.get("sessionId") as string
  const status = "open"
  const creatorId = await getUserId()

  if (!creatorId) {
    throw new Error("You must be logged in.")
  }

  const escalations = await prisma.user.findFirst({
    where: { id: Number(formData.get("recipient")) },
    select: { escalation1User: userSelect, escalation2User: userSelect, escalation3User: userSelect, escalation4User: userSelect }
  })

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
    complianceSecretariatId: creatorId,
    jobStatus: status,
    createdBy: creatorId,
    jobEscalation1: escalations?.escalation1User?.id,
    jobEscalation2: escalations?.escalation2User?.id,
    jobEscalation3: escalations?.escalation3User?.id,
    jobEscalation4: escalations?.escalation4User?.id,
  }


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

export async function jobTransactionClientUpdate(formData: FormData) {
  const creatorId = await getUserId()
  if (!creatorId) throw new Error("Unauthorized")

  const sessionId = formData.get("sessionId") as string
  const id = Number(formData.get("seriesno"))
  const type = formData.get("actionType")
  const comment = formData.get("comment") as string
  let rawData = {}
  let holdRawData = {}
  let actionTaken = ""

  const tempDirPath = path.join(process.env.FILE_SERVER_PATH!, 'Temporary', sessionId)
  let fileNames: string[] = []
  if (fs.existsSync(tempDirPath)) {
    fileNames = fs.readdirSync(tempDirPath)
  }

  console.log("corrCommitmentDateValue: " + formData.get("corrCommitmentDate") as string)

  switch (type) {
    case "verify":
      rawData = { verifiedBy: creatorId, verifiedOn: new Date(), jobStatus: "open", onHold: false }
      actionTaken = "verified this series"
      break
    case "approve":
      rawData = { approvedBy: creatorId, approvedOn: new Date(), jobStatus: "open", onHold: false }
      actionTaken = "approved this series"
      break
    case "accept":
      rawData = {
        correctiveAction: formData.get("correctiveAction") as string ?? "",
        correctiveCommitmentDate: new Date(formData.get("corrCommitmentDate") as string) ?? null,
        preventiveAction: formData.get("preventiveAction") as string ?? "",
        preventiveCommitmentDate: new Date(formData.get("prevCommitmentDate") as string) ?? null,
        jobStatus: 'accepted', onHold: false
      }
      actionTaken = "accepted this series"
      break
    case "for closing":
      rawData = { jobStatus: "for closing", onHold: false }
      actionTaken = "requesting to close the series"
      break
    case "close":
      rawData = { jobStatus: "closed", closedOn: new Date(), onHold: false }
      actionTaken = "closed the series"
      break
    case "hold":
      rawData = { jobStatus: "on-hold", onHold: true }
      actionTaken = "hold the series"
      break
    case "cancel":
      rawData = { jobStatus: "cancelled", cancelledOn: new Date() }
      actionTaken = "cancelled the series"
    default:
      actionTaken = "added a comment"
  }

  const subCommentAction = comment ? " with comment" : ""

  const { data: newJob, error } = await dbQuery(
    prisma.$transaction(async (tx) => {
      const job = await tx.jobTransaction.update({
        where: { id },
        data: {
          ...rawData,
          attachments: {
            create: fileNames.map(name => ({
              fileName: name,
              fileType: path.extname(name),
              fileSize: 0,
              fromRecipient: true, // Recipients attachments
              creator: { connect: { id: creatorId } }
            }))
          }
        }
      })

      await tx.auditTrail.create({
        data: {
          jobTransactionId: job.id,
          jobStatus: job.jobStatus ?? '',
          actionTaken: actionTaken + subCommentAction,
          comment: comment ?? "",
          createdBy: creatorId,
          tag: "updated"
        }
      })

      if (type === "hold") {
        await tx.holdingHistory.create({
          data: {
            jobTransactionId: job.id,
            holdFrom: new Date(formData.get("holdFrom") as string) ?? null,
            holdUntil: new Date(formData.get("holdUntil") as string) ?? null,
            createdBy: creatorId,
          }
        })
      }

      return job
    })
  )

  if (newJob) {
    await promoteToFinal(sessionId, newJob.id)
  }

   return { data: newJob, error }
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
  jobEscalation1User: userSelect,
  jobEscalation2User: userSelect,
  jobEscalation3User: userSelect,
  jobEscalation4User: userSelect,
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