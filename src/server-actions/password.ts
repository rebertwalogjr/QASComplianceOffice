"use server"

import { prisma } from "@/lib/prisma" // adjust to your prisma instance location
import bcrypt from "bcryptjs"
import { getUserId } from "./get-session"

interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export async function changePassword(formData: FormData) {
  const userId = await getUserId()

  const rawData = {
    password: formData.get("oldPassword") as string,
    newPassword: formData.get("newPassword") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  }

  if (!userId) {
    return { success: false, error: "Unauthorized. Please log in." }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true, passwordChangedAt: true }
  })

  if (!user) {
    return { success: false, error: "User not found." }
  }

  // Enforce 30-day password change limit
  // if (user.passwordChangedAt) {
  //   const now = new Date()
  //   const diffTime = Math.abs(now.getTime() - new Date(user.passwordChangedAt).getTime())
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  //   if (diffDays < 30) {
  //     const remainingDays = 30 - diffDays
  //     return { 
  //       success: false, 
  //       error: `You can only change your password once every 30 days. Please wait ${remainingDays} more day(s).` 
  //     }
  //   }
  // }

  // Verify old password
  const isPasswordValid = await bcrypt.compare(rawData.password, user.password)
  if (!isPasswordValid) {
    return { success: false, error: "Incorrect old password." }
  }

  // Ensure new password is not the same as old password
  const isSamePassword = await bcrypt.compare(rawData.newPassword, user.password)
  if (isSamePassword) {
    return { success: false, error: "New password cannot be the same as your old password." }
  }

  const hashedPassword = await bcrypt.hash(rawData.newPassword, 10)

  await prisma.user.update({
    where: { id: userId },
    data: {
      password: hashedPassword,
      passwordChangedAt: new Date(),
      modifiedBy: userId,
    }
  })

  return { success: true, message: "Password updated successfully!" }
}

export async function canUpdatePassword() {
  const userId = await getUserId()

  if (!userId) {
    return { result: false, error: "Unauthorized. Please log in." }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordChangedAt: true }
  })

  if (!user) {
    return { result: false, error: "User not found." }
  }

  if (user.passwordChangedAt) {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - new Date(user.passwordChangedAt).getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 30) {
      const remainingDays = 30 - diffDays
      return {
        result: false,
        error: `You can only change your password once every 30 days. Please wait ${remainingDays} more day(s).`
      }
    }
  }

  return { result: true, error: "" }
}