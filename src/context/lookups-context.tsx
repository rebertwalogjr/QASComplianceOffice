"use client"

import { createContext, useContext } from "react"
import { AuditEngagement, AuditReport, Company, GroupList, ProjectDepartmentList } from "../../generated/prisma/client"

interface LookupsContextProps {
  companies?: Company[]
  projects?: ProjectDepartmentList[]
  auditEngagement?: AuditEngagement[]
  groups?: GroupList[]
  auditReports?: AuditReport[]
  activeCompanies?: Company[]
  activeProjects?: ProjectDepartmentList[]
  activeGroups?: GroupList[]
  activeAuditEngagements?: AuditEngagement[]
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