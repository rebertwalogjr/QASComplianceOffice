"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";

export async function getAuditEngagements() {
  return await dbQuery(
    prisma.auditEngagement.findMany({
      include: {
        company: true,
      }
    })
  )
}

export async function getActiveAuditEngagements() {
  return await dbQuery(
    prisma.auditEngagement.findMany({
      where: {
        isActive: true
      }
    })
  )
}

export async function createAuditEngagement(formData: FormData) {
  const name = formData.get("name") as string;
  const companyId = Number(formData.get("companyId"));
  const currentUserId = 1002;
  const { data, error } = await dbQuery(
    prisma.auditEngagement.create({
      data: {
        name,
        companyId,
        createdBy: currentUserId,
      },
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/engagements")
  return { data, error }
}

export async function updateAuditEngagement(formData: FormData, engagementId: number) {
  const name = formData.get("name") as string;
  const companyId = Number(formData.get("companyId"));
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 1002;
  const { data, error } = await dbQuery(
    prisma.auditEngagement.update({
      where: { id: engagementId },
      data: {
        name,
        companyId,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/engagements")
  return { data, error }
}