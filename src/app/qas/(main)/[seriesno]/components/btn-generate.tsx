"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { generateAuditFindingNumber } from "@/server-actions/transaction"
import { toast } from "sonner"

export default function ButtonGenerateAuditReportNumber({ jobTransactionId }: { jobTransactionId: number | undefined }) {
  if (typeof jobTransactionId !== "number") {
    return (
      <Badge variant="destructive">Invalid ID</Badge>
    )
  }

  const handleClick = async () => {
    const result = await generateAuditFindingNumber(jobTransactionId)

    if (result.success) {
      toast.success(result.message, { position: "top-center" })
    } else {
      toast.error(result.message, { position: "bottom-right" })
    }
  }

  return (
    <Button size="xs" className="w-20" onClick={handleClick}>
      Generate
    </Button>
  )
}