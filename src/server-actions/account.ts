"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { dbQuery } from "@/lib/prisma-db-utils"
import { Prisma } from "../../generated/prisma/client"
import { getUserId } from "./get-session"
import bcrypt from "bcryptjs"
import { generateCode } from "@/lib/utils"
import { createHash } from "crypto"

export async function updateUsername(formData: FormData) {
  const userId = await getUserId()

  if (!userId) {
    throw new Error("You must be logged in.")
  }

  const rawData = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true }
  })

  if (!user) {
    return { error: "User not found." }
  }

  const isPasswordValid = await bcrypt.compare(rawData.password, user.password)
  if (!isPasswordValid) {
    return { error: "Invalid password." }
  }

  const { data, error } = await dbQuery(
    prisma.user.update({
      where: { id: userId },
      data: {
        username: rawData.username,
        usernameChangedAt: new Date(),
        modifiedBy: userId,
      }
    })
  )

  revalidatePath("/settings")
  return { data, error }
}

export async function sendCode() {
  const code = generateCode()

  const codeHash = createHash("sha256").update(code).digest("hex")
}