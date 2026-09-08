"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { toast } from "sonner"
import {
  ArrowLeftIcon,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { resetPassword } from "@/server-actions/account"

// import { resetPassword } from "@/server-actions/account"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get("token")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Invalid or expired password reset request.", {
        position: "top-center",
      })
      return
    }

    const result = await resetPassword(
      token,
      values.password
    )

    if (result.success) {
      toast.success(result.message, {
        position: "top-center",
      })

      router.push("/signin")
    } else {
      toast.error(result.message, {
        position: "top-center",
      })
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

        <div className="flex items-center gap-2">
          <LockKeyhole className="size-5" />

          <CardTitle>Reset password</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <FieldSet>
          <FieldGroup>
            <div className="text-sm text-muted-foreground">
              Enter a new password for your account.
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* New Password */}
              <Field>
                <FieldLabel htmlFor="password">
                  New Password
                </FieldLabel>

                <div className="relative">
                  <Input
                    {...register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Enter your new password"
                    disabled={isSubmitting}
                    className="pr-10"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    tabIndex={-1}
                    disabled={isSubmitting}
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}

                    <span className="sr-only">
                      {showPassword
                        ? "Hide password"
                        : "Show password"}
                    </span>
                  </Button>
                </div>

                {errors.password && (
                  <FieldError>
                    {errors.password.message}
                  </FieldError>
                )}
              </Field>

              {/* Confirm Password */}
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>

                <div className="relative">
                  <Input
                    {...register("confirmPassword")}
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    placeholder="Confirm your new password"
                    disabled={isSubmitting}
                    className="pr-10"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    tabIndex={-1}
                    disabled={isSubmitting}
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}

                    <span className="sr-only">
                      {showConfirmPassword
                        ? "Hide password"
                        : "Show password"}
                    </span>
                  </Button>
                </div>

                {errors.confirmPassword && (
                  <FieldError>
                    {errors.confirmPassword.message}
                  </FieldError>
                )}
              </Field>

              {/* Password requirements */}
              <div className="rounded-md border bg-muted/50 p-3">
                <p className="text-sm font-medium mb-2">
                  Password requirements
                </p>

                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• At least 8 characters</li>
                  <li>• At least one uppercase letter</li>
                  <li>• At least one lowercase letter</li>
                  <li>• At least one number</li>
                </ul>
              </div>

              {/* Submit */}
              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting || !token}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Resetting password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </Field>
            </form>

            {/* Back to login */}
            <Field>
              <Button
                type="button"
                variant="ghost"
                disabled={isSubmitting}
                onClick={() => router.push("/signin")}
              >
                <ArrowLeftIcon />
                Back to login
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}