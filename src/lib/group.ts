import { Status } from "./common-types"

type Group = {
  id: string,
  code: string,
  name: string,
  project:string | undefined,
  inCharge: string,
  inChargeEmail: string,
  status: Status,
  remarks: string | undefined, 
}

export default Group