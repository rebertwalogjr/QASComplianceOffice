"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";

export async function getEmployees(search: string = "", skip: number = 0) : Promise<{data: EmployeePayload[] | null, error: any}> {
  return await dbQuery(
    prisma.appSuiteEmployeeMaster.findMany({
      where: {
        isActive: true,
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { employeeNumber: { contains: search } }
        ]
      },
      take: 20,
      skip: skip,
      orderBy: { lastName: 'asc' }
    })
  )
}

// appsuite payload
export type EmployeePayload = Prisma.AppSuiteEmployeeMasterGetPayload<{
  select: {
    employeeNumber: true,
    firstName: true,
    lastName: true,
    fullName: true,
    emailAddress: true,
    position: true
  }
}>