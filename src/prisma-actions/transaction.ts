"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dbQuery } from "@/lib/prisma-db-utils";
import { Prisma } from "../../generated/prisma/client";

export async function createTransaction(formData: FormData) {
  const rawData = {
    companyId: Number(formData.get("company")),
    projectId: Number(formData.get("project")),
    auditEngagementId: Number(formData.get("auditEngagement")),
    typeOfFindingId: Number(formData.get("findingType")),
    findingCategoryId: Number(formData.get("findingCategory")),
    complianceOfficerId: Number(formData.get("complianceOfficer")),
    supervisorId: Number(formData.get("supervisor")),
    auditReportId: Number(formData.get("auditReport")),
    auditFindingNumber: "",
    // issuedOn: Date(formData.get("datetimeIssued")),
    // targetDate: Date(formData.get("datetimeTarget")),
    auditRatingId: Number(formData.get("auditRating")),
    projectManagerDepartmentHead: formData.get("projectHead") as string,
    responsibleDepartment: formData.get("responsibleDepartment") as string,
    responsiblePerson: formData.get("responsiblePerson") as string,
    recurringPerProcess: formData.get("recurringPerProcess") === "yes",
    recurringPerPerson: formData.get("recurringPerPerson") === "yes",
    recipientGroupId: Number(formData.get("recipientGroup")),
    recipientId: Number(formData.get("recipient")),
    problemCriteria: formData.get("criteria") as string,
    problemFindings: formData.get("findings") as string,
    recommendations: formData.get("recommendations") as string,
    
    complianceSecretariatId: Number(formData.get("complianceSecretariat")), // Hardcoded per your form's read-only value
    jobStatus: "OPEN",
    createdBy: 1002,
  };

  const { data, error } = await dbQuery(
    prisma.jobTransaction.create({
      data: rawData
    })
  )

  if (error) { return { data, error } }
  revalidatePath("/qas");
  return { data, error }
}

export async function getTransactions() {
  return await dbQuery(
    prisma.jobTransaction.findMany({
      include: {
        project: true,
        company: true,
        auditReport: true
      }
    })
  )
}