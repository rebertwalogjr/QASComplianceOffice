"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";

export async function getEmployees(search: string = "", skip: number = 0) {
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
      select: {
        employeeNumber: true,
        firstName: true,
        lastName: true,
        fullName: true,
        emailAddress: true,
        position: true
      },
      take: 20,
      skip: skip,
      orderBy: { lastName: 'asc' }
    })
  )
}
