import { Status } from "./common-types"

type AuditRating = {
  id: string,
  name: string,
  company: string,
  status: Status,
}

export default AuditRating