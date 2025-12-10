import { Status } from "./common-types"

type AuditNumber = {
  id: string,
  company: string,
  project: string,
  auditEngagement: string,
  status: Status
}

export default AuditNumber