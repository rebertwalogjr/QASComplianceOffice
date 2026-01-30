"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";

export async function createCompany(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  // const isActive = formData.get("isActive") === "on";
  const isActive = true; // Defaulting to true for simplicity
  const currentUserId = 1001;

  try {
    const newCompany = await prisma.company.create({
      data: {
        name,
        code,
        isActive: isActive,
        createdBy: currentUserId,
      },
    })
    revalidatePath("/companies");
    return { success: true, company: newCompany };
  } catch (error: any) {
    if (error.code === 'P2002') {
      //return { error: "A company with this name or code already exists." }
      toast.error("A company with this name or code already exists.");
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function getCompanies() {
  return await prisma.company.findMany();
}