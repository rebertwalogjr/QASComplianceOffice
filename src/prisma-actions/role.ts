"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";

export async function getActiveRoles() : Promise<{ data: ActiveRolePayload[] | null, error: any}> {
  return await dbQuery(
    prisma.role.findMany({
      where: {
        isActive: true
      }
    })
  )
}

// role payload
export type ActiveRolePayload = Prisma.RoleGetPayload<{
  select: { id: true, name: true }
}>