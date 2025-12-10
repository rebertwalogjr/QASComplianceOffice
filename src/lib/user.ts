import { Status } from "./common-types"

type User = {
  id: string,
  empId: string,
  username: string,
  firstname: string,
  lastname: string,
  status: Status
  email: string,
  accesslevel: "Admin" | "Compliance Secretariat" | "Compliance Officer" | "Supervisor" | "Recipient",
  company: string,
}

export default User