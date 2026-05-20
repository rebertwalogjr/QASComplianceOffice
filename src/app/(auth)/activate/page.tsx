"use client"

import { Suspense } from "react"
import { ActivateForm } from "./activate-form"
import { Loader2 } from "lucide-react"

export default function ActivatePage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-20 w-20 animate-spin" />
          </div>
        }
      >
        <ActivateForm />
      </Suspense>
    </div>
  )
}