"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { dbQuery } from "@/lib/prisma-db-utils"
import { Prisma } from "../../generated/prisma/client"
import { getUserId } from "./get-session"
import bcrypt from "bcryptjs"

export async function getUserDetails(): Promise<{ data: UserDetailsPayload | null, error: any }> {
  const userId = await getUserId()

  if (!userId) {
    return { data: null, error: "Unauthorized. Please log in." }
  }

  return await dbQuery(
    prisma.user.findUnique({
      where: { id: userId },
      select: userDetailsSelect
    })
  )
}

export async function updateUserProfile(formData: FormData) {
  const userId = await getUserId()

  if (!userId) {
    throw new Error("You must be logged in.")
  }

  const rawData = {
    firstName: formData.get("firstName") as string,
    middleName: formData.get("middleName") as string,
    lastName: formData.get("lastName") as string,
    employeeNumber: formData.get("employeeNumber") as string,
    department: formData.get("department") as string,
    position: formData.get("position") as string,
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

  const trimmedMiddle = rawData.middleName?.trim()
  const middleInitial = trimmedMiddle ? `${trimmedMiddle.charAt(0)}.` : null
  const fullName = [rawData.firstName.trim(), middleInitial, rawData.lastName.trim()].filter(Boolean).join(' ')

  const { data, error } = await dbQuery(
    prisma.user.update({
      where: { id: userId },
      data: {
        firstName: rawData.firstName.trim(),
        middleName: rawData.middleName.trim(),
        lastName: rawData.lastName.trim(),
        fullName: fullName,
        employeeNumber: rawData.employeeNumber,
        department: rawData.department,
        position: rawData.position,
      }
    })
  )

  return { data, error }
}

const userDetailsSelect = {
  employeeNumber: true,
  firstName: true,
  middleName: true,
  lastName: true,
  emailAddress: true,
  theme: true,
  position: true,
  department: true,
  username: true,
}

export type UserDetailsPayload = Prisma.UserGetPayload<{
  select: typeof userDetailsSelect
}>