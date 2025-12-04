type User = {
  id: string,
  empId: string,
  username: string,
  firstname: string,
  lastname: string,
  status: "Active" | "Inactive",
  email: string,
  accesslevel: "Admin" | "Compliance Secretariat" | "Compliance Officer" | "Supervisor" | "Recipient",
  company: string,
}

export default User