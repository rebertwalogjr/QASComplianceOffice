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

export async function getActiveProjects() {
  return await prisma.projectDepartmentList.findMany({where: { isActive: true }});
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

// Finding type actions
export async function getFindingTypes() {
  return await prisma.typeOfFinding.findMany();
}

export async function createFindingType(formData: FormData) {
  const name = formData.get("name") as string;
  const currentUserId = 1001;

  try {
    const newType = await prisma.typeOfFinding.create({
      data: {
        name,
        createdBy: currentUserId,
      },
    })
    revalidatePath("/types");
    return { success: true, type: newType };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "A finding type with this name already exists." }
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function updateFindingType(formData: FormData, typeId: number) {
  const name = formData.get("name") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 1001;

  try {
    const updatedType = await prisma.typeOfFinding.update({
      where: { id: typeId },
      data: {
        name,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
    revalidatePath("/types");
    return { success: true, type: updatedType };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "A finding type with this name already exists." }
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}

// Finding Category Actions
export async function getFindingCategories() {
  return await prisma.findingCategory.findMany();
}

export async function createFindingCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const currentUserId = 1001;

  try {
    const newCategory = await prisma.findingCategory.create({
      data: {
        name,
        createdBy: currentUserId,
      },
    })
    revalidatePath("/categories");
    return { success: true, category: newCategory };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "A finding category with this name already exists." }
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function updateFindingCategory(formData: FormData, categoryId: number) {
  const name = formData.get("name") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 1001;

  try {
    const updatedCategory = await prisma.findingCategory.update({
      where: { id: categoryId },
      data: {
        name,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
    revalidatePath("/categories");
    return { success: true, category: updatedCategory };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "A finding category with this name already exists." }
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}

// Audit Engagement Actions
export async function getAuditEngagements() {
  return await prisma.auditEngagement.findMany({
    include: {
      company: true,
    }
  })
}

export async function getActiveAuditEngagements(){
  return await prisma.auditEngagement.findMany({
    where: {
      isActive: true
    }
  })
}

export async function createAuditEngagement(formData: FormData) {
  const name = formData.get("name") as string;
  const companyId = Number(formData.get("companyId"));
  const currentUserId = 1001;

  try {
    const newEngagement = await prisma.auditEngagement.create({
      data: {
        name,
        companyId,
        createdBy: currentUserId,
      },
    })
    revalidatePath("/engagements");
    return { success: true, engagement: newEngagement };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "An audit engagement with this name already exists." }
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function updateAuditEngagement(formData: FormData, engagementId: number) {
  const name = formData.get("name") as string;
  const companyId = Number(formData.get("companyId"));
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 1001;

  try {
    const updatedEngagement = await prisma.auditEngagement.update({
      where: { id: engagementId },
      data: {
        name,
        companyId,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
    revalidatePath("/engagements");
    return { success: true, engagement: updatedEngagement };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "An audit engagement with this name already exists." }
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}

// Group Actions
export async function getGroups() {
  return await prisma.groupList.findMany({
    include: {
      projectDepartmentList: true,
    }
  });
}

export async function createGroup(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const projectId = Number(formData.get("projectDepartmentId"));
  const inChargeId = formData.get("inChargeId") as string;
  const emailAddress = formData.get("emailAddress") as string;
  const remarks = formData.get("remarks") as string;
  const currentUserId = 1001;

  try{
    const newGroup = await prisma.groupList.create({
      data: {
        name,
        code,
        projectDepartmentId: projectId,
        inChargeId,
        emailAddress,
        remarks,
        createdBy: currentUserId,
      },
    })
    revalidatePath("/groups");
    return { success: true, group: newGroup };  
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "A group with this name already exists." }
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function updateGroup(formData: FormData, groupId: number) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const projectId = Number(formData.get("projectDepartmentId"));
  const inChargeId = formData.get("inChargeId") as string;
  const emailAddress = formData.get("emailAddress") as string;
  const remarks = formData.get("remarks") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 1001;

  try {
    const updatedGroup = await prisma.groupList.update({
      where: { id: groupId },
      data: {
        name,
        code,
        projectDepartmentId: projectId,
        inChargeId,
        emailAddress,
        remarks,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
    revalidatePath("/groups");
    return { success: true, group: updatedGroup };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "A group with this name already exists." }
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}

// Audit Number Actions
export async function getAuditReports() {
  return await prisma.auditReport.findMany({
    include: {
      company: true,
      projectDepartmentList: true,
      auditEngagement: true
    }
  })
}


export async function createAuditReport(formData: FormData) {
  const name = formData.get("name") as string;
  const projectId = Number(formData.get("projectDepartmentId"));
  const engagementId = Number(formData.get("auditEngagementId"));
  const companyId = Number(formData.get("companyId"));
  const currentUserId = 1001;

  try{
    const newReport = await prisma.auditReport.create({
      data: {
        name,
        projectDepartmentId: projectId,
        auditEngagementId: engagementId,
        companyId,
        createdBy: currentUserId,
      },
    })
    revalidatePath("/auditreports");
    return { success: true, auditReport: newReport };  
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "An audit number with this name already exists." }
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}

export async function updateAuditReport(formData: FormData, auditReportId: number) {
  const name = formData.get("name") as string;
  const projectId = Number(formData.get("projectDepartmentId"));
  const companyId = Number(formData.get("companyId"));
  const engagementId = Number(formData.get("auditEngagementId"));
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 1001;

  try {
    const updatedGroup = await prisma.auditReport.update({
      where: { id: auditReportId },
      data: {
        name,
        projectDepartmentId: projectId,
        companyId,
        auditEngagementId: engagementId,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
    revalidatePath("/groups");
    return { success: true, group: updatedGroup };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "An audit number with this name already exists." }
    }
    return { error: error.message || "An unexpected error occurred." }
  }
}