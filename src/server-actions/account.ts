"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { dbQuery } from "@/lib/prisma-db-utils"
import { Prisma } from "../../generated/prisma/client"
import { getUserId } from "./get-session"
import bcrypt from "bcryptjs"
import { generateCode, generateRandomPassword } from "@/lib/utils"
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

export async function ResetPassword(userId: number) {

  const genPassword = generateRandomPassword(8)
  const hashedPassword = await bcrypt.hash(genPassword, 10)

  const { error } = await dbQuery(
    prisma.$transaction(async (tx) => {
      const userData = await tx.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          isActivated: false,
        },
        select: { id: true }
      })

      console.log(userData)
      // send email notif
      const res = await tx.$executeRaw`
        EXEC dbo.pr_ResetPasswordEmailNotif
          @UserId = ${userData.id.toString()},
          @Password = ${genPassword}`

    })
  )

  if (error) return { success: false, message: error }

  return { success: true, message: "Account password resets successfully" }
}

// Need to set the emailAddress in User table as unique
// export async function validateEmailAddress(formData: FormData) {
//   const email = formData.get("email") as string
//   const username = formData.get("username") as string

//   const result = await prisma.user.findUnique({
//     where: { emailAddress: email },
//     data: { id: true }
//   })
// }

export async function sendCode() {
  const code = generateCode()

  const codeHash = createHash("sha256").update(code).digest("hex")
}