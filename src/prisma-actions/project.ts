"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";

export async function getProjects() {
  return await dbQuery(
    prisma.project.findMany({
      include: {
        company: true
      }
    })
  )
}

export async function getActiveProjects() {
  return await dbQuery(
    prisma.project.findMany({
      where: { isActive: true }
    })
  )
}

export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const companyId = Number(formData.get("companyId"));
  const remarks = formData.get("remarks") as string;
  const currentUserId = 1002;
  const { data, error } = await dbQuery(
    prisma.project.create({
      data: {
        name,
        code,
        companyId,
        remarks,
        createdBy: currentUserId,
      },
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/projects")
  return { data, error }
}

export async function updateProject(formData: FormData, projectId: number) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const companyId = Number(formData.get("companyId"));
  const remarks = formData.get("remarks") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 1002;
  const { data, error } = await dbQuery(
    prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        code,
        isActive,
        companyId,
        remarks,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/projects")
  return { data, error }
}