"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";

export async function getActiveRoles() {
  return await dbQuery(
    prisma.role.findMany({
      where: {
        isActive: true
      }
    })
  )
}