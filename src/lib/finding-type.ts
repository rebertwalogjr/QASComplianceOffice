import { Status } from "./common-types"

type FindingType = {
  id: number,
  name: string,
  isActive: boolean,
  createdBy: number,
  createdOn: Date,
  modifiedBy: number | null,
  modifiedOn: Date | null,
}

export default FindingType