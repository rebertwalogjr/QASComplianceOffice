"use client"

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { activateAccount } from "@/server-actions/user";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

export default function ActivatePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/qas"

  const handleActivate = async () => {
    setIsPending(true)

    const result = await activateAccount()

    if (!result.error) {
      await update({
        ...session,
        user: {
          ...session?.user,
          isActivated: true
        }
      })
    }

    toast.success("Account acticated successfully", { position: "top-center" })

    router.push(callbackUrl)

    setIsPending(false)
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-[400px]">
        <CardHeader>Activate your account</CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={handleActivate} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Activating...
              </>
            ) : "Complete Activation"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}