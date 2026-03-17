"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";
import { getUserId } from "./get-session";

export async function getFindingCategories() {
  return await dbQuery(
    prisma.findingCategory.findMany()
  )
}

export async function createFindingCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const currentUserId = await getUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }

  const { data, error } = await dbQuery(
    prisma.findingCategory.create({
      data: {
        name,
        createdBy: currentUserId,
      },
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/categories")
  return { data, error }
}

export async function updateFindingCategory(formData: FormData) {
  const id = Number(formData.get("id"))
  const name = formData.get("name") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = await getUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }
  
  const { data, error } = await dbQuery(
    prisma.findingCategory.update({
      where: { id },
      data: {
        name,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/categories")
  return { data, error }
}

export async function getActiveFindingCategories() : Promise<{ data: ActiveFindingCategoryPayload[] | null, error: any}> {
  return await dbQuery(
    prisma.findingCategory.findMany({
      where: { isActive: true }
    })
  )
}

// finding category payload
export type ActiveFindingCategoryPayload = Prisma.FindingCategoryGetPayload<{
  select: { id: true, name: true; }
}>