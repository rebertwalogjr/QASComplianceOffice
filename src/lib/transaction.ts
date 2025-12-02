export type Transaction = {
  id: string,
  auditNo: string,
  company: string,
  project: string,
  resposiblePerson: string,
  status: "Open" | "Accepted" | "Cancelled" | "Closed" | "For Closing",
  secondaryStatus: "New" | "Verified" | "Approved" | "Request for Hold" | "On-Hold" | "Accepted" | "Cancelled" | "Closed" | "For Closing",
  engagement: string,
  rating: string,
  category: string,
  details: string,
  approvedDate: string
}