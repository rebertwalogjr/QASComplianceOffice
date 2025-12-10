import { PrimaryStatus, SecondaryStatus } from "./common-types"

type Transaction = {
  id: string,
  auditNo: string,
  company: string,
  project: string,
  resposiblePerson: string,
  status: PrimaryStatus,
  secondaryStatus: SecondaryStatus,
  engagement: string,
  rating: string,
  category: string,
  details: string,
  approvedDate: string
}

export default Transaction