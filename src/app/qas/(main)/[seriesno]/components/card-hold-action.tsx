"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Loader2, LucideAlarmClockOff, LucideClockFading } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserHoverCard } from "@/components/user-hover-card"
import { formatLongDate } from "@/lib/utils"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { HoldingPayload, liftHoldStatusById } from "@/server-actions/hold-history"
import { toast } from "sonner"

export default function CardHoldAction({ activeHolding }: { activeHolding: HoldingPayload }) {
  const router = useRouter()
  const { data: session } = useSession()
  const userId = session?.user.id

  const canLift = activeHolding.createdBy === Number(userId)

  const [isPending, setIsPending] = useState(false)

  const handleClick = async () => {
    setIsPending(true)

    const { error } = await liftHoldStatusById(activeHolding?.jobTransactionId, activeHolding?.id)

    if (error) {
      toast.error(error)
    } else {
      toast.success("Hold lifted successfully.")
      router.refresh()
    }

    setIsPending(false)
  }

  return (
    <div className="px-4 py-3">
      <Item variant="outline" className="bg-orange-50 border-orange-500">
        <ItemMedia variant="icon" className="bg-orange-500 border-orange-50 animate-pulse">
          <LucideAlarmClockOff className=" text-orange-50" />
        </ItemMedia>
        <ItemContent className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 py-2">
          <ItemTitle className="w-full">
            <div className="flex flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-1.5 text-sm leading-none">
                <span className="text-muted-foreground">Currently held by</span>
                <UserHoverCard data={activeHolding?.creator.appSuiteEmployeeMaster} />
              </div>

              <div className="text-xs text-orange-700 font-medium mt-1">
                {formatLongDate(activeHolding?.holdFrom)} — {formatLongDate(activeHolding?.holdUntil)}
              </div>
            </div>
          </ItemTitle>
          {canLift &&
            <ItemActions>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50" disabled={isPending}>Lift Hold</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="sm:max-w-sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to lift hold status?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogDescription>
                    This will resume the transaction process for <strong>Series #{activeHolding?.jobTransactionId}</strong>.
                    The "On-Hold" status will be cleared, allowing the next workflow actions to proceed.
                  </AlertDialogDescription>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClick}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isPending ? <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </> : "Confirm"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </ItemActions>
          }
        </ItemContent>
      </Item>
    </div>
  )
}