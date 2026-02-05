import { Status } from "./common-types"

type FindingCategory = {
  id: number,
  name: string,
  isActive: boolean,
  createdBy: number,
  createdOn: Date,
  modifiedBy?: number | null,
  modifiedOn?: Date | null,
}

export default FindingCategory