import { Status } from "./types"

type Group = {
  id: string,
  groupCode: string,
  groupName: string,
  groupInCharge: string,
  groupInChargeEmail: string,
  status: Status,
  remarks?: string, 
}

export default Group