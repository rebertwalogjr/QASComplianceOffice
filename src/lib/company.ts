import { Status } from "./common-types"

type Company = {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdBy: number;
  createdOn: Date;
  modifiedBy: number | null;
  modifiedOn: Date;
}

export default Company