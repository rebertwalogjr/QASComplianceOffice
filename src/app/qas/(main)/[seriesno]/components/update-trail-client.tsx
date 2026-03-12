"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { createUpdateTrail, UpdateTrailPayload } from "@/server-actions/update-trail"
import { format } from "date-fns";

import { TextAreaComposerWithButton } from "@/components/textarea-composer"
import { Item, ItemContent } from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { groupUpdateTrails } from "@/lib/utils";
import { UserHoverCard } from "@/components/user-hover-card"

interface UpdateTrailProps {
  initialTrails: UpdateTrailPayload[],
  jobTransactionId: number,
  currentUserId: number,
}

export default function UpdateTrailClient({ initialTrails, jobTransactionId, currentUserId }: UpdateTrailProps) {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  const groupedData = groupUpdateTrails(initialTrails ?? [])

  const handleSendMessage = async (message: string) => {
    const formData = new FormData
    formData.append("jobTransactionId", jobTransactionId.toString())
    formData.append("message", message)

    const { data, error } = await createUpdateTrail(formData)

    if (error) {
      toast.error(error)
    } else {
      router.refresh()
    }

  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [initialTrails])

  return (
    <div className="flex flex-col h-[600px] max-h-screen pt-3 gap-0 md:px-2 border rounded-lg bg-background">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-muted">

        {Object.entries(groupedData).map(([label, trails]) => (
          <div key={label} className="space-y-3">

            {/* Divider Label: "Today", "Yesterday", or actual date */}
            <div className="flex items-center justify-center gap-4 select-none">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 whitespace-nowrap">
                {label}
              </span>
              {/* <div className="h-px w-full bg-border/60" /> */}
            </div>

            {trails.map((trail) => {
              const isMe = trail.createdBy === currentUserId
              return (
                <div key={trail.id} className={cn("w-full flex", isMe ? "justify-end" : "justify-start")}>
                  <div className="flex flex-col gap-1.5 w-[80%] lg:w-[75%]">
                    <div className={cn("flex justify-between", isMe && "flew-row-reverse")}>
                      <Label className="text-xs font-bold text-primary">
                        { !isMe ?
                        <UserHoverCard data={trail.creator.appSuiteEmployeeMaster} /> :
                          // trail.creator.appSuiteEmployeeMaster.fullName :
                          ""}
                      </Label>
                      <span className="text-[10px] font-normal text-muted-foreground">{format(new Date(trail.createOn), "h:mm a")}</span>
                    </div>
                    <Item variant="outline"
                      className={cn("relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500",
                        isMe ? "bg-primary/10 border-primary/30 rounded-tr-none" : "rounded-tl-none"
                      )}>
                      <ItemContent>
                        <Label className="text-sm font-normal tracking-wide leading-6 whitespace-pre-wrap">{trail.message}</Label>
                      </ItemContent>
                    </Item>
                  </div>
                </div>
              )
            })}

          </div>
        ))}

        {/* {initialTrails.map((trail) => {
          const isMe = trail.createdBy === currentUserId

          return (
            <div key={trail.id} className={cn("w-full flex", isMe ? "justify-end" : "justify-start")}>
              <div className="flex flex-col gap-1.5 w-[80%] lg:w-[75%]">
                <div className={cn("flex justify-between", isMe && "flew-row-reverse")}>
                  <Label className="text-xs font-bold text-primary">{isMe ? "You" : trail.creator.appSuiteEmployeeMaster.fullName}</Label>
                  <span className="text-[10px] font-normal text-muted-foreground">{trail.createOn.toDateString()}</span>
                </div>
                <Item variant="outline"
                  className={cn("relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500",
                    isMe ? "bg-primary/10 border-primary/30 rounded-tr-none" : "rounded-tl-none"
                  )}>
                  <ItemContent>
                    <Label className="text-sm font-normal tracking-wide leading-6 whitespace-pre-wrap">{trail.message}</Label>
                  </ItemContent>
                </Item>
              </div>
            </div>
          )
        })} */}

      </div>

      <div id="fixed-at-the-bottom" className="w-full p-2 bg-background">
        <TextAreaComposerWithButton name="message" onSend={handleSendMessage} />
      </div>

    </div>
  )
}

