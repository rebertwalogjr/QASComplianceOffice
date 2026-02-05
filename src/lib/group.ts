type Group = {
  id: number,
  code: string,
  name: string,
  projectDepartmentId: number,
  inChargeId: string,
  emailAddress: string,
  isActive: boolean,
  remarks: string | null,
  createdBy: number,
  createdOn: Date,
  modifiedBy: number | null,
  modifiedOn: Date | null,
}

export default Group