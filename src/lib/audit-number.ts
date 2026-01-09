import { Status } from "./common-types"

type AuditNumber = {
  id: string,
  auditNumber: string,
  company: string,
  project: string,
  auditEngagement: string,
  status: Status
}

export default AuditNumber