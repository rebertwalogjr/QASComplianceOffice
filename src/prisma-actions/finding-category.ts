"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";

export async function getFindingCategories() {
  return await dbQuery(
    prisma.findingCategory.findMany()
  )
}

export async function createFindingCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const currentUserId = 1002;
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

export async function updateFindingCategory(formData: FormData, categoryId: number) {
  const name = formData.get("name") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 1002;
  const { data, error } = await dbQuery(
    prisma.findingCategory.update({
      where: { id: categoryId },
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