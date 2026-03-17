"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";
import { getUserId } from "./get-session";

export async function getGroups() {
  return await dbQuery(
    prisma.group.findMany({
      include: {
        project: true,
      }
    })
  )
}

export async function getActiveGroups() : Promise<{ data: ActiveGroupPayload[] | null, error: any}> {
  return await dbQuery(
    prisma.group.findMany({
      where: {
        isActive: true
      }
    })
  )
}

export async function createGroup(formData: FormData) {
  const currentUserId = await getUserId();
  
  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }

  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const projectId = Number(formData.get("projectId"));
  const inCharge = formData.get("inCharge") as string;
  const emailAddress = formData.get("emailAddress") as string;
  const remarks = formData.get("remarks") as string;

  const { data, error } = await dbQuery(
    prisma.group.create({
      data: {
        name,
        code,
        project: {
          connect: { id: projectId }
        },
        inCharge,
        emailAddress,
        remarks,
        creator: {
          connect: { id: currentUserId }
        },
      },
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/groups")
  return { data, error }
}

export async function updateGroup(formData: FormData) {
  const id = Number(formData.get("id"))
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const projectId = Number(formData.get("projectId"));
  const inCharge = formData.get("inCharge") as string;
  const emailAddress = formData.get("emailAddress") as string;
  const remarks = formData.get("remarks") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = await getUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }
  
  const { data, error } = await dbQuery(
    prisma.group.update({
      where: { id },
      data: {
        name,
        code,
        projectId,
        inCharge,
        emailAddress,
        remarks,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/groups")
  return { data, error }
}

// group payload
export type ActiveGroupPayload = Prisma.GroupGetPayload<{
  select: { id: true, name: true, code: true, projectId: true },
}>