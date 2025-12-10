import { Status } from "./common-types"

type Project = {
  id: string,
  code: string,
  name: string,
  company: string,
  remarks: string | undefined,
  status: Status
}

export default Project