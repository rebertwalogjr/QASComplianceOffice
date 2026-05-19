import { OfficerForClosingApproved } from "@/lib/email-builder";

const job = {
  id: '1001',
  creator: 'Rebert',
  project: 'DMCI'
}

export default function TestPage() {
  return (
    <OfficerForClosingApproved job={job} />
  )
}