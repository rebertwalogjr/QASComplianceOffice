"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";
import { getUserId } from "./get-session";

export async function getHolidays() {
  return await dbQuery(
    prisma.holiday.findMany({
      orderBy: { createdOn: "desc" }
    })
  )
}

export async function createHoliday(formData: FormData) {
  const currentUserId = await getUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }

  const { data, error } = await dbQuery(
    prisma.holiday.create({
      data: {
        name: formData.get("name") as string,
        type: formData.get("type") as string,
        date: new Date(formData.get("date") as string),
        createdBy: currentUserId
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/holidays")
  return { data, error }
}

export async function updateHoliday(formData: FormData) {
  const currentUserId = await getUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }

  const { data, error } = await dbQuery(
    prisma.holiday.update({
      where: { id: Number(formData.get("id") as string) },
      data: {
        name: formData.get("name") as string,
        type: formData.get("type") as string,
        date: new Date(formData.get("date") as string),
        isActive: formData.get("isActive") === "true",
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/holidays")
  return { data, error }
}