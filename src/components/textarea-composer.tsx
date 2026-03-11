"use client"

import React, { useRef } from "react"
import { cn } from "@/lib/utils"
import { SendHorizonalIcon } from "lucide-react"
import { Button } from "./ui/button"

function TextAreaComposerWithButton({ className, ...props }: React.ComponentProps<"textarea">) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isMultiline, setIsMultiline] = React.useState(false)

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target
    target.style.height = "auto" // Reset height to recalculate
    const newHeight = target.scrollHeight
    target.style.height = `${Math.min(newHeight, 256)}px` // 256px = max-h-64

    setIsMultiline(newHeight > 45)
  }

  return (
    <div className={cn(
      "flex gap-2 border rounded-xl p-2 bg-background focus-within:ring-1 focus-within:ring-ring transition-all",
      isMultiline ? "flex-col items-stretch" : "flex-row items-end"
      )}>
      <textarea
        {...props}
        rows={1}
        ref={textareaRef}
        onInput={handleInput}
        className={cn(
          "flex min-h-6 w-full resize-none bg-transparent px-3 py-1 text-sm",
          "font-normal tracking-wide leading-6",
          "focus-visible:outline-none focus-visible:ring-0", // Removes focus border
          "scrollbar-thumb-rounded scrollbar-thin scrollbar-thumb-muted",
          className
        )}
      />
      <div className="flex justify-end items-center">
        <Button variant="ghost" size="icon-sm" className="h-8 w-8 shrink-0 hover:bg-primary/10 hover:text-primary">
          <SendHorizonalIcon size={8} />
        </Button>
      </div>
    </div>
  )
}



export { TextAreaComposerWithButton }