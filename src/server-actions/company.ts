"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";
import { getUserId } from "./get-session";

export async function getCompanies() {
  return await dbQuery(
    prisma.company.findMany()
  )
}

export async function createCompany(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const currentUserId = await getUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }

  const { data, error } = await dbQuery(
    prisma.company.create({
      data: {
        name,
        code,
        createdBy: currentUserId
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/companies")
  return { data, error }
}

export async function updateCompany(formData: FormData) {
  const id = Number(formData.get("id"))
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = await getUserId();

  if (!currentUserId) {
    throw new Error("You must be logged in.")
  }
  
  const { data, error } = await dbQuery(
    prisma.company.update({
      where: { id },
      data: {
        name,
        code,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/companies");
  return { data, error };
}

export async function deleteCompany(companyId: number) {
  const { data, error } = await dbQuery(
    prisma.company.delete({ where: { id: companyId } })
  )
  revalidatePath("/companies");
  return { data, error };
}

export async function getActiveCompanies() : Promise<{ data: ActiveCompanyPayload[] | null, error: any}> {
  return await dbQuery(
    prisma.company.findMany({ 
      where: { isActive: true }
    })
  )
}

// Company Payload
export type ActiveCompanyPayload = Prisma.CompanyGetPayload<{
  select: { id: true; name: true; code: true }
}>