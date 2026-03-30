"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { dbQuery } from "@/lib/prisma-db-utils"
import { Prisma } from "../../generated/prisma/client"
import { cache } from "react"

export const getFilterOptions = cache(async (): Promise<FilterOptionsPayload> => {
  const [companies, projects, findings, categories, engagements, ratings, reports, groups] = await Promise.all([
    prisma.company.findMany({select: { id: true, name: true }}),
    prisma.project.findMany({select: { id: true, name: true, companyId: true }}),
    prisma.typeOfFinding.findMany({select: { id: true, name: true }}),
    prisma.findingCategory.findMany({select: { id: true, name: true }}),
    prisma.auditEngagement.findMany({select: { id: true, name: true, companyId: true }}),
    prisma.auditRating.findMany({select: { id: true, name: true, companyId: true }}),
    prisma.auditReport.findMany({select: {id: true, name: true, companyId: true, projectId: true}}),
    prisma.group.findMany({select: {id: true, name: true, projectId: true}}),
  ])

  return {companies, projects, findings, categories, engagements, ratings, reports, groups}
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
}