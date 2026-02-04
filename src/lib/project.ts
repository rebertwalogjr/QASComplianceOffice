type Project = {
  id: number,
  code: string,
  name: string,
  companyId: number,
  remarks: string | null,
  isActive: boolean,
  createdBy: number,
  createdOn: Date,
  modifiedBy: number | null,
  modifiedOn: Date | null,
}

export default Project