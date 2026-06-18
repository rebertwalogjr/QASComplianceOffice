"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState } from "react"

import HideOnScroll from "@/components/hide-on-scroll"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Edit2 } from "lucide-react"

import { reOpenTransaction, TransactionPayload } from "@/server-actions/transaction"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

interface Props {
  jobTransaction: TransactionPayload
}

export default function SeriesTitle({ jobTransaction }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const userId = session?.user.id

  const isOpen = jobTransaction.jobStatus === 'open'
  const isAccepted = jobTransaction.jobStatus === 'accepted'
  const isAuditor = String(jobTransaction.complianceSecretariatId) === userId

  const canUpdate = isOpen && isAuditor
  const canReopen = isAccepted && isAuditor

  const handleUpdate = () => {
    router.push(`/qas/update/${jobTransaction.id}`)
  }

  const handleReopen = () => {
    setIsLoading(true)
    reOpenTransaction(jobTransaction.id)
    toast.success("Series re-open successfully.", { position: "top-center" })
    router.refresh()
    setIsLoading(false)
  }

  return (
    <div id="page-title" className="w-full">
      <HideOnScroll>
        <div id="series-title" className="flex justify-between p-4 md:p-8 h-16">
          <div className="flex items-start justify-center flex-col">
            <Label className="text-md">Series #{jobTransaction.id}</Label>
            <div className="flex gap-2">
              <Label className="text-sm">{jobTransaction.creator.appSuiteEmployeeMaster.fullName}</Label>
              <Label className="text-muted-foreground text-xs">— {jobTransaction.createdOn.toDateString()}</Label>
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="outline" className="" onClick={handleUpdate} hidden={!canUpdate}>
              <Edit2 className="size-3.5" />Update
            </Button>
            <Button variant="outline" className="" onClick={handleReopen} hidden={!canReopen} disabled={isLoading}>
              {isLoading ? <Spinner /> : "Re-open" }
            </Button>
          </div>
        </div>
      </HideOnScroll>
      {/* <SeriesNavigationMenu /> */}
    </div>
  )
}