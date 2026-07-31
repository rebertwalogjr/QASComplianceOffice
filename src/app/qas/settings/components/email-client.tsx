"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2Icon, RefreshCcwIcon } from "lucide-react"

interface EmailClientUpdateSectionProps {
  email: string
  onSuccess?: () => void
}

export default function EmailClientUpdateSection({ email, onSuccess }: EmailClientUpdateSectionProps) {
  const [serverError, setServerError] = useState<string | null>(null)
  const [codeSent, setCodeSent] = useState(false)
  const [cooldown, setCooldown] = useState(60)

  useEffect(() => {
    if (cooldown <= 0) return

    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [cooldown])

  const emailUpdateSchema = z.object({
    email: z.email("Invalid email address"),
    code: z.string().regex(/^\d{6}$/, "Please enter a valid 6-digit code"),
  })

  type EmailUpdateFormValues = z.infer<typeof emailUpdateSchema>

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting, dirtyFields } } = useForm<EmailUpdateFormValues>({
    resolver: zodResolver(emailUpdateSchema),
    mode: "onChange",
    defaultValues: {
      email: email,
      code: "",
    }
  })

  const codeValue = watch("code")
  const emailValue = watch("email")
  const hasFieldErrors = Object.keys(errors).length > 0
  const isEmailChanged = !!dirtyFields.email

  const canSendCode = isEmailChanged && emailValue.trim()
  const isDisabled = isSubmitting || !isEmailChanged || !codeValue.trim() || hasFieldErrors || !codeSent

  const onSubmit = async (values: EmailUpdateFormValues) => {
    const formData = new FormData()

    formData.append("email", values.email)
    formData.append("code", values.code)
  }

  const onHandleSendCode = async () => {
    if (cooldown > 0) return

    setCooldown(60)

    setCodeSent(true)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-12 my-4 gap-4">
      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <Input
          {...register("email")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Enter 6 digit code sent to your email.</Label>
        <Input
          maxLength={6}
          inputMode="numeric"
          {...register("code")}
        />
        {errors.code && <p className="text-xs text-destructive mt-1">{errors.code.message}</p>}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onHandleSendCode} disabled={!canSendCode || cooldown > 0}>
          {cooldown > 0 ? (
            <>Resend in {cooldown}s</>
          ) : codeSent ? (
            <><RefreshCcwIcon />Resend Code</>
          ) : (
            <>Send Code</>
          )}
        </Button>
        <Button type="submit" disabled={isDisabled}>
          {isSubmitting ? <><Loader2Icon className="size-4 animate-spin" />Processing...</> : "Update Email"}
        </Button>
      </div>
    </form>
  )
}