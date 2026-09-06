"use server"

import { getPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";

const prisma = getPrisma()

// Stored Proc Actions
export async function execAppSuiteEmployeeMasterUpdateAll() {
  return await dbQuery(
    prisma.$executeRaw`EXEC [dbo].[pr_SQLJOB_AppSuiteEmployeeMasterUpdateAll]`
  )
}