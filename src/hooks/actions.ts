"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Company Actions
export async function getCompanies() {
  return await prisma.company.findMany();
}

export async function createCompany(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const currentUserId = 1001;

  try {
    const newCompany = await prisma.company.create({
      data: {
        name,
        code,
        createdBy: currentUserId,
      },
    })
    revalidatePath("/companies");
    return { success: true, company: newCompany };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "A company with this name or code already exists." }
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function updateCompany(formData: FormData, companyId: number) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 1001;
  try {
    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        name,
        code,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
    revalidatePath("/companies");
    return { success: true, company: updatedCompany };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "A company with this name or code already exists." }
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function deleteCompany(companyId: number) {
  try {
    await prisma.company.delete({ where: { id: companyId } });
    revalidatePath("/companies");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function getActiveCompanies() {
  return await prisma.company.findMany({ where: { isActive: true } });
}


// Projects/Departments Actions
export async function getProjects() {
  return await prisma.projectDepartmentList.findMany({
    include: {
      company: true
    }
  });
}

export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const companyId = Number(formData.get("companyId"));
  const remarks = formData.get("remarks") as string;
  const currentUserId = 1001;

  try {
    const newProject = await prisma.projectDepartmentList.create({
      data: {
        name,
        code,
        companyId,
        remarks,
        createdBy: currentUserId,
      },
    })
    revalidatePath("/projects")
    return { success: true, project: newProject };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "A project with this name or code already exists." }
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function updateProject(formData: FormData, projectId: number) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const companyId = Number(formData.get("companyId"));
  const remarks = formData.get("remarks") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 1001;

  try {
    const updatedProject = await prisma.projectDepartmentList.update({
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
    revalidatePath("/projects");
    return { success: true, project: updatedProject };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "A project or department with this name or code already exists." }
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}