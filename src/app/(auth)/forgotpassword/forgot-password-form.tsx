"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, Loader2, LockKeyhole } from "lucide-react"
import { sendOTPCode } from "@/server-actions/account"

const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordForm() {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    }
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    const result = await sendOTPCode(values.email)

    if (result.success) {
      toast.success(result.message, {
        position: "top-center",
      })
      router.push(`/forgotpassword/verify?token=${encodeURIComponent(result.token)}&email=${encodeURIComponent(values.email)}`)
    } else {
      toast.error(result.message, {
        position: "top-center",
      })
    }
  }

  return (
    <Card className="w-full max-w-[400px]">
      {/* <CardHeader>
        <div className="flex gap-2 mb-4">
          <Image src="/DMCILogo.png" width={128} height={32} alt="DMCI Logo" priority className="object-contain" />
        </div>
        <CardTitle>Forgot password?</CardTitle>
      </CardHeader> */}
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
        <CardTitle>Reset password</CardTitle>
        <CardDescription>To reset password please enter your email address</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldSet>
          <FieldGroup>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...register("email")}
                  type="email"
                  tabIndex={1}
                  placeholder="Enter you email address"
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>

              <Field>
                <Button type="submit" disabled={isSubmitting} tabIndex={2}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending code...
                    </>
                  ) : "Send Code"}
                </Button>
              </Field>

            </form>

            <Field>
              <Button
                variant="ghost"
                disabled={isSubmitting}
                tabIndex={3}
                onClick={() => {
                  router.push("/signin")
                }}
              >
                <ArrowLeftIcon />
                back to login
              </Button>
            </Field>

          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}