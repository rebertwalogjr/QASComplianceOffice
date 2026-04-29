"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { dbQuery } from "@/lib/prisma-db-utils"
import { Prisma } from "../../generated/prisma/client"
import { cache } from "react"
import { getUserId } from "./get-session";

export const getFilterOptions = cache(async (): Promise<FilterOptionsPayload> => {
  const userId = await getUserId()

  const [companies, projects, findings, categories, engagements, ratings, reports, groups, rawUsers] = await Promise.all([
    prisma.company.findMany({ select: { id: true, name: true } }),
    prisma.project.findMany({ select: { id: true, name: true, companyId: true } }),
    prisma.typeOfFinding.findMany({ select: { id: true, name: true } }),
    prisma.findingCategory.findMany({ select: { id: true, name: true } }),
    prisma.auditEngagement.findMany({ select: { id: true, name: true, companyId: true } }),
    prisma.auditRating.findMany({ select: { id: true, name: true, companyId: true } }),
    prisma.auditReport.findMany({ select: { id: true, name: true, companyId: true, projectId: true } }),
    prisma.group.findMany({ select: { id: true, name: true, projectId: true } }),
    prisma.user.findMany({ select: { id: true, appSuiteEmployeeMaster: { select: { firstName: true, lastName: true } } } })
  ])

  const users: BaseFilterOption[] = rawUsers.map((u) => {
    const isMe = u.id === userId
    return {
      id: u.id,
      name: isMe
        ? "Me"
        : (u.appSuiteEmployeeMaster
          ? `${u.appSuiteEmployeeMaster.firstName} ${u.appSuiteEmployeeMaster.lastName}`
          : "Unknown User")
    }
  }).sort((a, b) => {
    if (a.name === "Me") return -1
    if (b.name === "Me") return 1
    return a.name.localeCompare(b.name)
  })

  return { companies, projects, findings, categories, engagements, ratings, reports, groups, users }
})

export interface BaseFilterOption {
  id: number | string
  name: string
  companyId?: number
  projectId?: number
}

export interface FilterOptionsPayload {
  companies: BaseFilterOption[]
  projects: BaseFilterOption[]
  findings: BaseFilterOption[]
  categories: BaseFilterOption[]
  engagements: BaseFilterOption[]
  ratings: BaseFilterOption[]
  reports: BaseFilterOption[]
  groups: BaseFilterOption[]
  users: BaseFilterOption[]
}