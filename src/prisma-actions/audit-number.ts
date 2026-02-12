"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";

export async function getAuditReports() {
  return await dbQuery(
    prisma.auditReport.findMany({
      include: {
        company: true,
        project: true,
        auditEngagement: true
      }
    })
  )
}

export async function createAuditReport(formData: FormData) {
  const name = formData.get("name") as string;
  const projectId = Number(formData.get("projectId"));
  const auditEngagementId = Number(formData.get("auditEngagementId"));
  const companyId = Number(formData.get("companyId"));
  const currentUserId = 1002;
  const { data, error } = await dbQuery(
    prisma.auditReport.create({
      data: {
        name,
        projectId,
        auditEngagementId,
        companyId,
        createdBy: currentUserId,
      },
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/auditreports");
  return { data, error }
}

export async function updateAuditReport(formData: FormData, auditReportId: number) {
  const name = formData.get("name") as string;
  const projectId = Number(formData.get("projectId"));
  const companyId = Number(formData.get("companyId"));
  const auditEngagementId = Number(formData.get("auditEngagementId"));
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 1002;
  const { data, error } = await dbQuery(
    prisma.auditReport.update({
      where: { id: auditReportId },
      data: {
        name,
        projectId,
        companyId,
        auditEngagementId,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/auditreports");
  return { data, error }
}