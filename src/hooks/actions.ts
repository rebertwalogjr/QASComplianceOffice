"use server"

import { getPrisma } from "@/lib/prisma";
import { dbQuery } from "@/lib/prisma-db-utils";

// Stored Proc Actions
export async function execAppSuiteEmployeeMasterUpdateAll() {
  const prisma = getPrisma()

  return await dbQuery(
    prisma.$executeRaw`EXEC [dbo].[pr_SQLJOB_AppSuiteEmployeeMasterUpdateAll]`
  )
}