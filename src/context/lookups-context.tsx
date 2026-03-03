"use client"

import { createContext, useContext } from "react"
import { AuditEngagement, AuditReport, Company, Group, Project } from "../../generated/prisma/client"
import { ActiveCompanyPayload } from "@/server-actions/company"
import { ActiveProjectPayload } from "@/server-actions/project"
import { ActiveGroupPayload } from "@/server-actions/group"
import { ActiveEngagementPayload } from "@/server-actions/engagement"

interface LookupsContextProps {
  companies?: Company[]
  projects?: Project[]
  auditEngagement?: AuditEngagement[]
  groups?: Group[]
  auditReports?: AuditReport[]
  activeCompanies?: ActiveCompanyPayload[]
  activeProjects?: ActiveProjectPayload[]
  activeGroups?: ActiveGroupPayload[]
  activeAuditEngagements?: ActiveEngagementPayload[]
  activeAuditReports?: AuditReport[]
}

const LookupsContext = createContext<LookupsContextProps | undefined>(undefined)

export function LookupsProvider({ children, data }: { children: React.ReactNode, data: LookupsContextProps }) {
  return (
    <LookupsContext.Provider value={data}>
      {children}
    </LookupsContext.Provider>
  )
}

export const useLookups = () => {
  const context = useContext(LookupsContext)
  if (!context) {
    throw new Error("useLookups must be used within a LookupsProvider")
  }
  return context
}