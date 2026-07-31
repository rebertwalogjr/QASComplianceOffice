"use client"

import { useEffect, useRef } from "react"
import { cn, groupTrails } from "@/lib/utils"
import { format } from "date-fns"

import { TextAreaComposerWithButton } from "@/components/textarea-composer"
import { Item, ItemContent } from "@/components/ui/item"
import { Label } from "@/components/ui/label"
import { UserHoverCard } from "@/components/user-hover-card"
import { MessageSquareDashed } from "lucide-react"
import { UpdateTrailPayload } from "@/server-actions/update-trail"
import { ReviewTrailPayload } from "@/server-actions/review-trail"

interface BaseTrail {
  id: number
  createdBy: number
  jobTransactionId: number
  message: string
  createOn: Date
  creator: {
    id: number
    isActive: boolean
    emailAddress: string | null
    appSuiteEmployeeMaster: {
      employeeNumber: string
      emailAddress: string | null
      position: string | null
      fullName: string
      firstName: string
      lastName: string
      department: string | null
    }
  }
}

interface TrailContainerProps<T extends BaseTrail> {
  trails: UpdateTrailPayload[] | ReviewTrailPayload[]
  currentUserId: number
  canWrite?: boolean
  readonly?: boolean
  onSend: (message: string) => Promise<void>
}

export default function TrailContainer<T extends BaseTrail>({ trails, currentUserId, canWrite, readonly, onSend }: TrailContainerProps<T>) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const groupedData = groupTrails(trails ?? [])
  const isEmpty = trails.length === 0

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [trails])


  return (
    <div className="flex flex-col h-[calc(100vh-30vh)] max-h-screen pt-3 gap-0 md:px-2 border rounded-lg bg-background">
      <div ref={scrollRef}
        className={cn("flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-muted",
          isEmpty ? "flex items-center justify-center" : "space-y-6"
        )}>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
              <MessageSquareDashed className="size-8 text-muted-foreground/60" />
            </div>
            <h3 className="text-sm font-semibold text-muted-foreground">No updates yet</h3>
            <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
              Be the first to leave a comment or update regarding this transaction.
            </p>
          </div>
        ) : (
          Object.entries(groupedData).map(([label, trails]) => (
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
                    <div className={cn("flex flex-col gap-1.5 mx-w-[80%] lg:max-w-[75%]", isMe ? "items-end" : "items-start")}>
                      <div className={cn("flex justify-between gap-2", isMe && "flex-row-reverse")}>
                        <Label className="text-xs font-bold text-primary">
                          {!isMe ? <UserHoverCard data={trail.creator} /> : ""}
                        </Label>
                        <span className="text-[10px] font-normal text-muted-foreground">{format(new Date(trail.createOn), "h:mm a")}</span>
                      </div>
                      <Item variant="outline"
                        className={cn("relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500",
                          isMe ? "bg-primary/10 border-primary/30 rounded-tr-none" : "bg-muted rounded-tl-none"
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
          ))
        )}
      </div>

      {(canWrite && !readonly) &&
        <div id="fixed-at-the-bottom" className="w-full p-2 bg-background">
          <TextAreaComposerWithButton name="message" onSend={onSend} placeholder="Type here ..." />
        </div>
      }

    </div>
  )
}