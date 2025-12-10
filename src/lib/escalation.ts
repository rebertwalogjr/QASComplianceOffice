import { Status } from "./common-types"

type Escalation = {
  id: string,
  fullname: string,
  email: string,
  project: string,
  status: Status
}

export default Escalation