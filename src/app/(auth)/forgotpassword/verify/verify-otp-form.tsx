"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, ArrowLeftIcon, LockKeyhole } from "lucide-react"
import { toast } from "sonner"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Image from "next/image"

import { REGEXP_ONLY_DIGITS } from "input-otp"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { verifyOTPCode } from "@/server-actions/account"

const verifyOtpSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "Please enter a valid 6-digit code"),
})

type VerifyOtpFormValues = z.infer<typeof verifyOtpSchema>

export default function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpFormValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      code: "",
    },
  })

  const code = watch("code")

  const onSubmit = async (values: VerifyOtpFormValues) => {
    if (!token) {
      toast.error("Reset password token is missing.", {
        position: "top-center",
      })
      return
    }

    // Call server action here
    const result = await verifyOTPCode(token, values.code)

    if (result.success) {
      router.push(`/forgotpassword/reset?token=${result.token}`)
    } else {
      toast.error(result.message, { position: "top-center" })
    }
  }

  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <div className="flex gap-2 mb-4">
          <Image
            src="/DMCILogo.png"
            width={128}
            height={32}
            alt="DMCI Logo"
            priority
            className="object-contain"
          />
        </div>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>OTP code expires after 5 minutes</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to{" "}
            <span className="font-medium text-foreground">
              {email}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <InputOTP
              maxLength={6}
              value={code}
              pattern={REGEXP_ONLY_DIGITS}
              onChange={(value) =>
                setValue("code", value, {
                  shouldValidate: true,
                })
              }
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {errors.code && (
              <p className="text-sm text-destructive">
                {errors.code.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || code.length !== 6}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            disabled={isSubmitting}
            onClick={() => router.push("/signin")}
          >
            <ArrowLeftIcon />
            Back to login
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}