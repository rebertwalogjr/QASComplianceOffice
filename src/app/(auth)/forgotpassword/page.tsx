"use client"

import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import ForgotPasswordForm from "./forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-20 w-20 animate-spin" />
          </div>
        }
      >
        <ForgotPasswordForm />
      </Suspense>
    </div>
  )
}