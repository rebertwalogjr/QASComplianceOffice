"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";
import { getUserId } from "./get-session";

export async function getAuditRatings() {
  return await dbQuery(
    prisma.auditRating.findMany({
      include: {
        company: true
      }
    })
  )
}

export async function createAuditRating(formData: FormData) {
  const name = formData.get("name") as string;
  const companyId = Number(formData.get("companyId"));
  const currentUserId = await getUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }

  const { data, error } = await dbQuery(
    prisma.auditRating.create({
      data: {
        name,
        companyId,
        createdBy: currentUserId
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/ratings")
  return { data, error }
}

export async function updateAuditRating(formData: FormData) {
  const currentUserId = await getUserId();
  
  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }

  const id = Number(formData.get("id"))
  const name = formData.get("name") as string;
  const companyId = Number(formData.get("companyId"));
  const isActive = formData.get("isActive") === "true";
  
  const { data, error } = await dbQuery(
    prisma.auditRating.update({
      where: { id },
      data: {
        name,
        isActive,
        companyId,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/ratings")
  return { data, error }
}

export async function getActiveAuditRatings() : Promise<{ data: ActiveAuditRatingPayload[] | null, error: any}> {
  return await dbQuery(
    prisma.auditRating.findMany({
      where: { isActive: true }
    })
  )
}

export type ActiveAuditRatingPayload = Prisma.AuditRatingGetPayload<{
  select: { id: true, name: true, companyId: true}
}>