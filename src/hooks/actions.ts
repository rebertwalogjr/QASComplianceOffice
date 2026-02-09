"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "../../generated/prisma/client";
import { dbQuery } from "@/lib/prisma-db-utils";

// Company Actions
export async function getCompanies() {
  return await dbQuery(
    prisma.company.findMany()
  )
}

export async function createCompany(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const currentUserId = 3004;
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

export async function updateCompany(formData: FormData, companyId: number) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 3004;
  const { data, error } = await dbQuery(
    prisma.company.update({
      where: { id: companyId },
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

export async function getActiveCompanies() {
  const { data, error } = await dbQuery(
    prisma.company.findMany({ where: { isActive: true } })
  )
  return { data, error }
}

// Projects/Departments Actions
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
  const currentUserId = 3004;
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
  const currentUserId = 3004;
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

// Finding type actions
export async function getFindingTypes() {
  return await dbQuery(
    prisma.typeOfFinding.findMany()
  )
}

export async function createFindingType(formData: FormData) {
  const name = formData.get("name") as string;
  const currentUserId = 3004;
  const { data, error } = await dbQuery(
    prisma.typeOfFinding.create({
      data: {
        name,
        createdBy: currentUserId,
      },
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/types")
  return { data, error }
}

export async function updateFindingType(formData: FormData, typeId: number) {
  const name = formData.get("name") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 3004;
  const { data, error } = await dbQuery(
    prisma.typeOfFinding.update({
      where: { id: typeId },
      data: {
        name,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/types")
  return { data, error }
}

// Finding Category Actions
export async function getFindingCategories() {
  return await dbQuery(
    prisma.findingCategory.findMany()
  )
}

export async function createFindingCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const currentUserId = 3004;
  const { data, error } = await dbQuery(
    prisma.findingCategory.create({
      data: {
        name,
        createdBy: currentUserId,
      },
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/categories")
  return { data, error }
}

export async function updateFindingCategory(formData: FormData, categoryId: number) {
  const name = formData.get("name") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 3004;
  const { data, error } = await dbQuery(
    prisma.findingCategory.update({
      where: { id: categoryId },
      data: {
        name,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/categories")
  return { data, error }
}

// Audit Engagement Actions
export async function getAuditEngagements() {
  return await dbQuery(
    prisma.auditEngagement.findMany({
      include: {
        company: true,
      }
    })
  )
}

export async function getActiveAuditEngagements() {
  return await dbQuery(
    prisma.auditEngagement.findMany({
      where: {
        isActive: true
      }
    })
  )
}

export async function createAuditEngagement(formData: FormData) {
  const name = formData.get("name") as string;
  const companyId = Number(formData.get("companyId"));
  const currentUserId = 3004;
  const { data, error } = await dbQuery(
    prisma.auditEngagement.create({
      data: {
        name,
        companyId,
        createdBy: currentUserId,
      },
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/engagements")
  return { data, error }
}

export async function updateAuditEngagement(formData: FormData, engagementId: number) {
  const name = formData.get("name") as string;
  const companyId = Number(formData.get("companyId"));
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 3004;
  const { data, error } = await dbQuery(
    prisma.auditEngagement.update({
      where: { id: engagementId },
      data: {
        name,
        companyId,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/engagements")
  return { data, error }
}

// Group Actions
export async function getGroups() {
  return await dbQuery(
    prisma.group.findMany({
      include: {
        project: true,
      }
    })
  )
}

export async function createGroup(formData: FormData) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const projectId = Number(formData.get("projectId"));
  const inCharge = formData.get("inCharge") as string;
  const emailAddress = formData.get("emailAddress") as string;
  const remarks = formData.get("remarks") as string;
  const currentUserId = 3004;
  const { data, error } = await dbQuery(
    prisma.group.create({
      data: {
        name,
        code,
        projectId,
        inCharge,
        emailAddress,
        remarks,
        createdBy: currentUserId,
      },
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/groups")
  return { data, error }
}

export async function updateGroup(formData: FormData, groupId: number) {
  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const projectId = Number(formData.get("projectId"));
  const inCharge = formData.get("inCharge") as string;
  const emailAddress = formData.get("emailAddress") as string;
  const remarks = formData.get("remarks") as string;
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 3004;
  const { data, error } = await dbQuery(
    prisma.group.update({
      where: { id: groupId },
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

// Audit Number Actions
export async function getAuditReports() {
  return await dbQuery(
    prisma.auditReport.findMany({
      include: {
        company: true,
        project: true,
        auditEngagement: true
      }
    })
  )
}

export async function createAuditReport(formData: FormData) {
  const name = formData.get("name") as string;
  const projectId = Number(formData.get("projectId"));
  const auditEngagementId = Number(formData.get("auditEngagementId"));
  const companyId = Number(formData.get("companyId"));
  const currentUserId = 3004;
  const { data, error } = await dbQuery(
    prisma.auditReport.create({
      data: {
        name,
        projectId,
        auditEngagementId,
        companyId,
        createdBy: currentUserId,
      },
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/auditreports");
  return { data, error }
}

export async function updateAuditReport(formData: FormData, auditReportId: number) {
  const name = formData.get("name") as string;
  const projectId = Number(formData.get("projectId"));
  const companyId = Number(formData.get("companyId"));
  const auditEngagementId = Number(formData.get("auditEngagementId"));
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 3004;
  const { data, error } = await dbQuery(
    prisma.auditReport.update({
      where: { id: auditReportId },
      data: {
        name,
        projectId,
        companyId,
        auditEngagementId,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/auditreports");
  return { data, error }
}

// Stored Proc Actions
export async function execAppSuiteEmployeeMasterUpdateAll(){
  return await dbQuery(
    prisma.$executeRaw`EXEC [dbo].[pr_SQLJOB_AppSuiteEmployeeMasterUpdateAll]`
  )
}

//AppSuite Actions
export async function getEmployees(search: string = "", skip: number = 0){
  return await dbQuery(
    prisma.appSuiteEmployeeMaster.findMany({
      where: {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { employeeNumber: { contains: search } }
        ]
      },
      take: 20,
      skip: skip,
      orderBy: {lastName: 'asc' }
    })
  )
}

// Users Actions
export async function getUsers(){
  return await dbQuery(
    prisma.user.findMany({
      include: {
        appSuiteEmployeeMaster: true,
        company: true
      }
    })
  )
}

export async function getUserById(id: number){
  return await dbQuery(
    prisma.user.findFirst({
      where: {
        id: id
      },
      include: {
        appSuiteEmployeeMaster: true
      }
    })
  )
}

export async function createUser(formData: FormData){
  const employeeNumber = '1'
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const emailAddress = formData.get("emailAddress") as string;
  const companyId = Number(formData.get("companyId"));
  const currentUserId = 3004;
  const accessId = 1
  const position = formData.get("position") as string;
  const escalation1 = 1
  const escalation2 = 1
  const escalation3 = 1
  const escalation4 = 1
  const isEscalation = formData.get("isEscalation") ? true : false
  const { data, error } = await dbQuery(
    prisma.user.create({
      data: {
        employeeNumber,
        username,
        password,
        emailAddress,
        accessId,
        companyId,
        position,
        escalation1,
        escalation2,
        escalation3,
        escalation4,
        isEscalation,
        createdBy: currentUserId
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/users");
  return { data, error }
}

export async function updateUser(formData: FormData, id: number) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const emailAddress = formData.get("emailAddress") as string;
  const companyId = Number(formData.get("companyId"));
  const accessId = 1
  const position = formData.get("position") as string;
  const escalation1 = 1
  const escalation2 = 1
  const escalation3 = 1
  const escalation4 = 1
  const isEscalation = formData.get("isEscalation") ? true : false
  const isActive = formData.get("isActive") === "true";
  const currentUserId = 3004;
  const { data, error } = await dbQuery(
    prisma.user.update({
      where: { id },
      data: {
        username,
        password,
        emailAddress,
        accessId,
        companyId,
        position,
        escalation1,
        escalation2,
        escalation3,
        escalation4,
        isEscalation,
        isActive,
        modifiedBy: currentUserId,
        modifiedOn: new Date(),
      }
    })
  )
  if (error) { return { data, error } }
  revalidatePath("/auditreports");
  return { data, error }
}