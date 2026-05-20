import { Prisma } from "../../generated/prisma/client"

export const userSelect = {
  select: { 
    id: true, 
    isActive: true,
    emailAddress: true,
    appSuiteEmployeeMaster: { select: { fullName: true, employeeNumber: true, position: true, department: true, emailAddress: true, firstName: true, lastName: true } }, 
  }
} satisfies Prisma.UserDefaultArgs

export const recipientSelect = {
  select: { 
    id: true, 
    isActive: true,
    emailAddress: true,
    appSuiteEmployeeMaster: { select: { fullName: true, employeeNumber: true, position: true, department: true, emailAddress: true, firstName: true, lastName: true } }, 
    escalation1User: userSelect,
    escalation2User: userSelect,
    escalation3User: userSelect,
    escalation4User: userSelect,
  }
} satisfies Prisma.UserDefaultArgs