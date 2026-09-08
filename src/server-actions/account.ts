"use server"

import { getPrisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { dbQuery } from "@/lib/prisma-db-utils"
import { getUserId } from "./get-session"
import bcrypt from "bcryptjs"
import { generateCode, generateRandomPassword } from "@/lib/utils"
import { createHash, randomBytes } from "crypto"

type SendOTPCodeResult =
  | {
    success: true
    message: string
    token: string
  }
  | {
    success: false
    message: string
  }

export async function updateUsername(formData: FormData) {
  const prisma = getPrisma()
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

export async function adminTriggeredResetPassword(userId: number) {
  const prisma = getPrisma()
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

export async function sendOTPCode(emailAddress: string): Promise<SendOTPCodeResult> {
  const prisma = getPrisma()

  // validate email aaddress
  const userId = await validateEmailAddress(emailAddress)

  if (userId === undefined) {
    return {
      success: false,
      message: "Email address does not exist"
    }
  }

  // generate otp code
  const code = generateCode()
  const codeHash = createHash("sha256").update(code).digest("hex")

  // generate token
  const token = randomBytes(32).toString("hex")
  const tokenHash = createHash("sha256").update(token).digest("hex")

  const expiresOn = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiration
  const tokenExpiresOn = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiration

  const { error } = await dbQuery(
    prisma.$transaction(async (tx) => {
      // deactivate existing code
      await tx.codeHistory.updateMany({
        where: {
          userId,
          isActive: true,
        },
        data: {
          isActive: false,
        },
      })

      // create new code
      await tx.codeHistory.create({
        data: {
          userId,
          codeHash,
          expiresOn
        }
      })

      // save token
      await tx.passwordResetToken.create({
        data: {
          userId,
          tokenHash,
          expiresOn: tokenExpiresOn
        }
      })

      // send email notif
      await tx.$executeRaw`
        EXEC dbo.pr_SendCodeEmailNotif
          @EmailAdrress = ${emailAddress},
          @Code = ${code},
          @Token = ${token}`
    })
  )

  if (error) {
    return {
      success: false,
      message: error
    }
  }

  return {
    success: true,
    message: "OTP code sent successfully",
    token,
  }
}

export async function verifyOTPCode(token: string, code: string): Promise<SendOTPCodeResult> {
  const prisma = getPrisma()

  const tokenHash = createHash("sha256").update(token).digest("hex")

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
  })

  if (!resetToken) {
    return {
      success: false,
      message: "Invalid password reset request.",
    }
  }

  if (resetToken.usedOn) {
    return {
      success: false,
      message: "This password reset request has already been used.",
    }
  }

  if (resetToken.expiresOn <= new Date()) {
    return {
      success: false,
      message: "This password reset request has expired.",
    }
  }

  const userId = resetToken.userId
  const codeHash = createHash("sha256").update(code).digest("hex")

  const codeHistory = await prisma.codeHistory.findFirst({
    where: {
      userId,
      codeHash: codeHash,
      expiresOn: {
        gt: new Date(),
      },
      isActive: true,
    },
    orderBy: {
      id: "desc",
    },
  })

  if (!codeHistory) {
    return {
      success: false,
      message: "Invalid OTP code!"
    }
  }

  // OTP is valid, so deactivate it 
  await prisma.codeHistory.update({
    where: { id: codeHistory.id, },
    data: { isActive: false, },
  })

  // Mark the reset token as verified
  await prisma.passwordResetToken.update({
    where: { id: resetToken.id, },
    data: { verifiedOn: new Date(), },
  })

  return {
    success: true,
    message: "",
    token
  }

}

export async function resetPassword(token: string, password: string) {
  const prisma = getPrisma()
  const tokenHash = createHash("sha256").update(token).digest("hex")

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
  })

  if (!resetToken) {
    return {
      success: false,
      message: "Invalid password reset request.",
    }
  }

  if (resetToken.usedOn) {
    return {
      success: false,
      message: "This password reset request has already been used.",
    }
  }

  if (!resetToken.verifiedOn) {
    return {
      success: false,
      message: "Token not yet verified",
    }
  }

  if (resetToken.expiresOn <= new Date()) {
    return {
      success: false,
      message: "This password reset request has expired.",
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const { error } = await dbQuery(
    prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: resetToken.userId },
        data: {
          password: hashedPassword,
          isActivated: true,
        },
        select: { id: true }
      })

      // Mark the reset token as used
      await tx.passwordResetToken.update({
        where: { id: resetToken.id, },
        data: { usedOn: new Date(), },
      })

      // send email notif
      // const res = await tx.$executeRaw`
      //   EXEC dbo.pr_ResetPasswordEmailNotif
      //     @UserId = ${userData.id.toString()},
      //     @Password = ${genPassword}`

    })
  )

  if (error) return { success: false, message: error }

  return { success: true, message: "Account password resets successfully" }
}

export async function validateEmailAddress(emailAddress: string) {
  const prisma = getPrisma()

  const result = await prisma.user.findUnique({
    where: { emailAddress },
    select: { id: true }
  })

  if (result) return result.id

  return undefined
}
