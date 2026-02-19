import { Prisma } from "../../generated/prisma/client"

export const userSelect = {
  select: { 
    id: true, 
    isActive: true,
    appSuiteEmployeeMaster: { select: { fullName: true, employeeNumber: true, position: true, department: true, emailAddress: true } }, 
  }
} satisfies Prisma.UserDefaultArgs

export const recipientSelect = {
  select: { 
    id: true, 
    isActive: true, 
    appSuiteEmployeeMaster: { select: { fullName: true, employeeNumber: true, position: true, department: true, emailAddress: true } }, 
    escalation1User: { select: { appSuiteEmployeeMaster: { select: { fullName: true, employeeNumber: true }}, id: true, isActive: true } },
    escalation2User: { select: { appSuiteEmployeeMaster: { select: { fullName: true, employeeNumber: true }}, id: true, isActive: true } },
    escalation3User: { select: { appSuiteEmployeeMaster: { select: { fullName: true, employeeNumber: true }}, id: true, isActive: true } },
    escalation4User: { select: { appSuiteEmployeeMaster: { select: { fullName: true, employeeNumber: true }}, id: true, isActive: true } },
  }
} satisfies Prisma.UserDefaultArgs