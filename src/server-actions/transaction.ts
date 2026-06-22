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
import { triggerDatabaseMail } from "@/lib/mail-service";
import { getNewlyCreatedEmailHtml, getOfficerApprovalRequestEmailHtml, getRecipientApprovalRequestEmailHtml, getReOpenSeriesRecipientEmailHtml, getSecretariatApprovalRequestEmailHtml, getSupervisorForClosingApprovedEmailHtml, getSupervisorForClosingRequestEmailHtml, getSupervisorVerificationRequestEmailHtml } from "@/lib/email-builder";
// import { NewlyCreatedTemplate } from "@/lib/email-builder";

export async function createTransaction(formData: FormData) {
  const creatorId = await getUserId()

  if (!creatorId) {
    throw new Error("You must be logged in.")
  }

  const sessionId = formData.get("sessionId") as string
  const payload = formData.get("payload") as string
  const values = JSON.parse(payload)

  const escalations = await prisma.user.findFirst({
    where: { id: Number(values.recipientId) },
    select: { escalation1User: userSelect, escalation2User: userSelect, escalation3User: userSelect, escalation4User: userSelect }
  })

  const rawData = {
    companyId: Number(values.companyId),
    projectId: Number(values.projectId),
    auditEngagementId: Number(values.auditEngagementId),
    typeOfFindingId: Number(values.typeOfFindingId),
    findingCategoryId: Number(values.findingCategoryId),
    complianceOfficerId: Number(values.complianceOfficerId),
    supervisorId: Number(values.supervisorId),
    auditReportId: Number(values.auditReportId),
    auditFindingNumber: "",
    issuedOn: values.issuedOn ? new Date(values.issuedOn as string) : null,
    targetDate: values.targetDate ? new Date(values.targetDate as string) : null,
    auditRatingId: Number(values.auditRatingId),
    projectManagerDepartmentHead: values.projectManagerDepartmentHead as string,
    responsibleDepartment: values.responsibleDepartment as string,
    responsiblePerson: values.responsiblePerson as string,
    recurringPerProcess: values.recurringPerProcess === "yes",
    recurringPerPerson: values.recurringPerPerson === "yes",
    recipientGroupId: Number(values.recipientGroupId),
    recipientId: Number(values.recipientId),
    problemCriteria: values.problemCriteria as string,
    problemFindings: values.problemFindings as string,
    recommendations: values.recommendations as string,
    complianceSecretariatId: creatorId,
    jobStatus: "open",
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
        },
        select: transactionEmailSelect
      })
      // Create the audit trail
      await tx.auditTrail.create({
        data: {
          jobTransactionId: newJob.id,
          jobStatus: "open",
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
    // -- EMAIL NOTIFICATION START
    // Send email to verifier
    const emailHtml = await getSupervisorVerificationRequestEmailHtml(newJob)
    triggerDatabaseMail({
      to: emailHtml.recipient,
      cc: emailHtml.cc,
      subject: emailHtml.subject,
      body: emailHtml.template
    }).catch(err => console.error("Background Email Error:", err))
    // -- EMAIL NOTIFICATION END
  }
  return { data: newJob, error }
}

export async function updateTransaction(formData: FormData) {
  const creatorId = await getUserId()

  if (!creatorId) {
    throw new Error("You must be logged in.")
  }

  const payload = formData.get("payload") as string
  const sessionId = formData.get("sessionId") as string

  const { deletedAttachmentIds, ...values } = JSON.parse(payload)
  const jobTransactionId = Number(values.jobTransactionId)

  const escalations = await prisma.user.findFirst({
    where: { id: Number(values.recipientId) },
    select: { escalation1User: userSelect, escalation2User: userSelect, escalation3User: userSelect, escalation4User: userSelect }
  })

  const rawData = {
    companyId: Number(values.companyId),
    projectId: Number(values.projectId),
    auditEngagementId: Number(values.auditEngagementId),
    typeOfFindingId: Number(values.typeOfFindingId),
    findingCategoryId: Number(values.findingCategoryId),
    complianceOfficerId: Number(values.complianceOfficerId),
    supervisorId: Number(values.supervisorId),
    auditReportId: Number(values.auditReportId),
    auditFindingNumber: "",
    issuedOn: values.issuedOn ? new Date(values.issuedOn as string) : null,
    targetDate: values.targetDate ? new Date(values.targetDate as string) : null,
    auditRatingId: Number(values.auditRatingId),
    projectManagerDepartmentHead: values.projectManagerDepartmentHead as string,
    responsibleDepartment: values.responsibleDepartment as string,
    responsiblePerson: values.responsiblePerson as string,
    recurringPerProcess: values.recurringPerProcess === "yes",
    recurringPerPerson: values.recurringPerPerson === "yes",
    recipientGroupId: Number(values.recipientGroupId),
    recipientId: Number(values.recipientId),
    problemCriteria: values.problemCriteria as string,
    problemFindings: values.problemFindings as string,
    recommendations: values.recommendations as string,
    jobStatus: "open",
    modifiedBy: creatorId,
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

  const { data: modJob, error } = await dbQuery(
    prisma.$transaction(async (tx) => {
      // Update transaction
      const modJob = await tx.jobTransaction.update({
        where: { id: jobTransactionId },
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
        },
        select: transactionEmailSelect
      })
      // Create the audit trail
      await tx.auditTrail.create({
        data: {
          jobTransactionId: jobTransactionId,
          jobStatus: "open",
          actionTaken: "modified this series",
          createdBy: creatorId,
          tag: "created"
        }
      })
      // Soft-delete the attachments
      if (deletedAttachmentIds && deletedAttachmentIds.length > 0) {
        await tx.attachment.updateMany({
          where: {
            id: { in: deletedAttachmentIds },
            jobTransactionId: jobTransactionId
          },
          data: { isActive: false }
        })
      }
      return modJob
    })
  )

  if (modJob) {
    await promoteToFinal(sessionId, modJob.id)
    // -- EMAIL NOTIFICATION START
    // Send email to verifier
    // const emailHtml = await getSupervisorVerificationRequestEmailHtml(modJob)
    // triggerDatabaseMail({
    //   to: emailHtml.recipient,
    //   cc: emailHtml.cc,
    //   subject: emailHtml.subject,
    //   body: emailHtml.template
    // }).catch(err => console.error("Background Email Error:", err))
    // -- EMAIL NOTIFICATION END
  }
  return { data: modJob, error }
}

export async function getTransactions(page: number = 1, pageSize: number = 10, filters: { [key: string]: string | undefined } = {}): Promise<{
  data: TransactionBasicPaylod[] | null,
  totalCount: number,
  error: any
}> {
  const skip = (page - 1) * pageSize;
  const where: any = {}

  const addIntFilter = (key: string, value: string | undefined) => {
    if (value && !isNaN(parseInt(value))) {
      where[key] = parseInt(value)
    }
  }

  addIntFilter('companyId', filters.company)
  addIntFilter('projectId', filters.project)
  addIntFilter('typeOfFindingId', filters.type)
  addIntFilter('findingCategoryId', filters.category)
  addIntFilter('auditReportId', filters.report)
  addIntFilter('auditEngagementId', filters.engagement)
  addIntFilter('auditRatingId', filters.rating)
  addIntFilter('recipientGroupId', filters.group)
  addIntFilter('createdBy', filters.creator)
  // addIntFilter('assignedTo', filters.assignedTo)

  if (filters.status) {
    where.jobStatus = { equals: filters.status };
  }

  const { data, error } = await dbQuery(
    Promise.all([
      prisma.jobTransaction.findMany({
        where,
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
  const payload = formData.get("payload") as string

  const { deletedAttachmentIds } = JSON.parse(payload)

  console.log("deletedAttachmentIds: ", deletedAttachmentIds)

  let rawData = {}
  let actionTaken = ""

  const tempDirPath = path.join(process.env.FILE_SERVER_PATH!, 'Temporary', sessionId)
  let fileNames: string[] = []
  if (fs.existsSync(tempDirPath)) {
    fileNames = fs.readdirSync(tempDirPath)
  }

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
        },
        select: transactionEmailSelect
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

      if (deletedAttachmentIds && deletedAttachmentIds.length > 0) {
        await tx.attachment.updateMany({
          where: {
            id: { in: deletedAttachmentIds },
            jobTransactionId: id
          },
          data: { isActive: false }
        })
      }

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

    // -- EMAIL NOTIFICATION START
    switch (type) {
      case "verify":
        // Send email to compliance officer for approval
        const emailHtml1 = await getOfficerApprovalRequestEmailHtml(newJob, comment)
        triggerDatabaseMail({
          to: emailHtml1.recipient,
          subject: emailHtml1.subject,
          cc: emailHtml1.cc,
          body: emailHtml1.template
        }).catch(err => console.error("Background Email Error:", err))
        break;
      case "approve":
        // Send email to recipient
        const emailHtml2 = await getRecipientApprovalRequestEmailHtml(newJob, comment)
        triggerDatabaseMail({
          to: emailHtml2.recipient,
          subject: emailHtml2.subject,
          cc: emailHtml2.cc,
          body: emailHtml2.template
        }).catch(err => console.error("Background Email Error:", err))
        break;
      case "accept":
        // Send email to secretariat
        const emailHtml3 = await getSecretariatApprovalRequestEmailHtml(newJob, comment)
        triggerDatabaseMail({
          to: emailHtml3.recipient,
          subject: emailHtml3.subject,
          body: emailHtml3.template
        }).catch(err => console.error("Background Email Error:", err))
        break;
      case "for closing":
        // send email to supervisor
        const emailHtml4 = await getSupervisorForClosingRequestEmailHtml(newJob, comment)
        triggerDatabaseMail({
          to: emailHtml4.recipient,
          subject: emailHtml4.subject,
          body: emailHtml4.template
        }).catch(err => console.error("Background Email Error:", err))
        break;
      case "close":
        // send email to compliance secretariat
        const emailHtml5 = await getSupervisorForClosingApprovedEmailHtml(newJob, comment)
        triggerDatabaseMail({
          to: emailHtml5.recipient,
          subject: emailHtml5.subject,
          cc: emailHtml5.cc,
          body: emailHtml5.template
        }).catch(err => console.error("Background Email Error:", err))
        break;
    }
    // -- EMAIL NOTIFICATION END
  }

  revalidatePath(`/qas/${newJob.id}`)
  return { data: newJob, error }
}

export async function search(params: string): Promise<{ data: TransactionBasicPaylod[] | null, error: any }> {
  const idValue = parseInt(params)
  const isNumeric = !isNaN(idValue)

  return await dbQuery(
    prisma.jobTransaction.findMany({
      where: {
        OR: [
          ...(isNumeric ? [{ id: { equals: idValue } }] : []),
          { auditReport: { name: { contains: params } } },
        ]
      },
      select: transactionBasicSelect,
      take: 10,
    })
  )
}

export async function reOpenTransaction(id: number) {
  const creatorId = await getUserId()
  if (!creatorId) throw new Error("Unauthorized")

  await dbQuery(
    prisma.$transaction(async (tx) => {
      const job = await tx.jobTransaction.update({
        where: { id: id },
        data: { jobStatus: "open" },
        select: transactionEmailSelect
      })

      await tx.auditTrail.create({
        data: {
          jobTransactionId: id,
          jobStatus: 'open',
          actionTaken: 're-open the series',
          comment: "",
          createdBy: creatorId,
          tag: "updated"
        }
      })

      if (job) {
        const emailHtml5 = await getReOpenSeriesRecipientEmailHtml(job)
        triggerDatabaseMail({
          to: emailHtml5.recipient,
          subject: emailHtml5.subject,
          cc: emailHtml5.cc,
          body: emailHtml5.template
        }).catch(err => console.error("Background Email Error:", err))
      }

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
  closedOn: true,
  creator: userSelect,
  createdOn: true,
  company: { select: { name: true } },
  project: { select: { name: true } },
  auditRating: { select: { name: true } },
  auditReport: { select: { id: true, name: true, isActive: true } },
  auditEngagement: { select: { name: true } },
  findingCategory: { select: { name: true } },
  recipient: recipientSelect,
  typeOfFinding: { select: { name: true } },
  problemCriteria: true,
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
  auditTrails: true
} satisfies Prisma.JobTransactionInclude

const transactionEmailSelect = {
  id: true,
  jobStatus: true,
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
  typeOfFinding: { select: { name: true } },
  problemCriteria: true,
  supervisor: userSelect,
  recipient: recipientSelect,
  complianceOfficer: userSelect,
  complianceSecretariat: userSelect,
  correctiveAction: true,
  preventiveAction: true,
} satisfies Prisma.JobTransactionSelect

export type TransactionBasicPaylod = Prisma.JobTransactionGetPayload<{
  select: typeof transactionBasicSelect
}>

export type TransactionPayload = Prisma.JobTransactionGetPayload<{
  include: typeof transactionInfoInclude
}>

export type TransactionEmailPayload = Prisma.JobTransactionGetPayload<{
  select: typeof transactionEmailSelect
}>