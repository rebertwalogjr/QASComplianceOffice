"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { generateAuditFindingNumber } from "@/server-actions/transaction"
import { AlertTriangle, Info, InfoIcon, TriangleAlertIcon } from "lucide-react"
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
    <div className="flex gap-3">
      <Button size="xs" className="w-48" onClick={handleClick}>
        Generate Audit Number
      </Button>
      <div className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
        <AlertTriangle className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <span className="font-medium whitespace-nowrap">Action Required</span>
      </div>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center text-muted-foreground hover:text-foreground focus:outline-none"
            >
              <Info className="size-3.5" />
              <span className="sr-only">Why am I seeing this?</span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs">
            <p className="font-semibold mb-0.5">Why am I seeing this?</p>
            <p className="text-muted-foreground">
              The system failed to generate an audit finding number automatically and it needs to be manually created.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}