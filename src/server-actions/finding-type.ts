"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";
import { getUserId } from "./get-session";

export async function getFindingTypes() {
  return await dbQuery(
    prisma.typeOfFinding.findMany()
  )
}

export async function getActiveFindingTypes() : Promise<{ data: ActiveFindingTypePayload[] | null, error: any}> {
  return await dbQuery(
    prisma.typeOfFinding.findMany({
      where: { isActive: true }
    })
  )
}

export async function createFindingType(formData: FormData) {
  const name = formData.get("name") as string;
  const currentUserId = await getUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }

  const { data, error } = await dbQuery(
    prisma.typeOfFinding.create({
      data: {
        name,
        createdBy: currentUserId,
      },
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/types")
  return { data, error }
}

export async function updateFindingType(formData: FormData, typeId: number) {
  const name = formData.get("name") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = await getUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }
  
  const { data, error } = await dbQuery(
    prisma.typeOfFinding.update({
      where: { id: typeId },
      data: {
        name,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/types")
  return { data, error }
}

// finding types payload
export type ActiveFindingTypePayload = Prisma.TypeOfFindingGetPayload<{
  select: { id: true; name: true;}
}>