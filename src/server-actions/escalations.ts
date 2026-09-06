"use server"

import { getPrisma } from "@/lib/prisma"
import { dbQuery } from "@/lib/prisma-db-utils"
import { Prisma } from "../../generated/prisma/client"

export async function getEscalations() {
  const prisma = getPrisma()

  return await dbQuery(
    prisma.user.findMany({
      where: { isEscalation: true },
      include: {
        appSuiteEmployeeMaster: true,
        company: true
      },
      orderBy: { createdOn: "desc" }
    })
  )
}

export async function getEscalationUser(search: string = "", skip: number = 0): Promise<{ data: EscalationUserPayload[] | null, error: any }> {
  const prisma = getPrisma()
  
  return await dbQuery(
    prisma.user.findMany({
      where: {
        isEscalation: true,
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { employeeNumber: { contains: search } },
        ]
      },
      select: userEscalation,
      take: 20,
      skip: skip,
      orderBy: { lastName: 'asc' }
    })
  )
}

const userEscalation = {
  id: true,
  firstName: true,
  lastName: true,
  fullName: true,
  employeeNumber: true,
}

export type EscalationUserPayload = Prisma.UserGetPayload<{
  select: typeof userEscalation
}>