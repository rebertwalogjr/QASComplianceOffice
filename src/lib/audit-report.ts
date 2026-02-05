import { Status } from "./common-types"

type AuditNumber = {
  id: number,
  name: string,
  companyId: number,
  projectDepartmentId: number,
  auditEngagementId: number,
  isActive: boolean,
  createdBy: number,
  createdOn: Date,
  modifiedBy?: number | null,
  modifiedOn?: Date | null,
}

export default AuditNumber