"use server"

import { getPrisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getUserId } from "./get-session"

export async function updateUserTheme(theme: string) {
  const prisma = getPrisma()
  const creatorId = await getUserId()

  if (!creatorId) {
    throw new Error("You must be logged in.")
  }

  await prisma.user.update({
    where: {id: creatorId},
    data: {
      theme: theme
    }
  })

  revalidatePath("/", "layout")
}

export async function getUserTheme() {
  const prisma = getPrisma()
  const userId = await getUserId()
  
  if (!userId) return "system"

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { theme: true },
  })

  return user?.theme ?? "system"
}