"use client"

import { useSession } from "next-auth/react"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Loader2, ShieldCheckIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { activateAccount } from "@/server-actions/user"

const activateSchema = z.object({
  npassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  cpassword: z.string(),
}).refine((data) => data.npassword === data.cpassword, {
  error: "Password do not match.",
  path: ["cpassword"]
})

type ActivateFormValues = z.infer<typeof activateSchema>

export function ActivateForm() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/qas"

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<ActivateFormValues>({
    resolver: zodResolver(activateSchema),
    mode: "onChange",
    defaultValues: {
      npassword: "",
      cpassword: "",
    },
  })

  const onSubmit = async (data: ActivateFormValues) => {

    const result = await activateAccount(data.npassword)

    if (result.error === "PASSWORD_SAME_AS_CURRENT") {
      setError("npassword", {
        type: "validate",
        message: "New password cannot be the same as your current password"
      })
      return
    }

    if (result?.error) {
      toast.error(result.error)
      return
    }

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
  }

  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <div className="flex gap-2 mb-4">
          <Image src="/DMCILogo.png" width={128} height={32} alt="DMCI Logo" priority className="object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="size-5" />

          <CardTitle>Activate your account</CardTitle>
        </div>
      </CardHeader>
      <CardContent>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <div className="text-sm text-muted-foreground">
                Enter a new password for your account.
              </div>

              <Field>
                <FieldLabel htmlFor="npassword">New Password</FieldLabel>

                <div className="relative">
                  <Input 
                  {...register("npassword")} 
                  id="npassword" 
                  type={showPassword ? "text" : "password"}
                  placeholder="********" 
                  disabled={isSubmitting} 
                  tabIndex={1} />

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
                {errors.npassword && (
                  <FieldError>{errors.npassword.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="cpassword">Confirm Password</FieldLabel>
                <div className="relative">
                  <Input
                    {...register("cpassword")}
                    id="password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    disabled={isSubmitting}
                    tabIndex={2} />
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
                {errors.cpassword && (
                  <FieldError>{errors.cpassword.message}</FieldError>
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

              <Field>
                <Button type="submit" disabled={isSubmitting} tabIndex={3}>
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : "Continue"}
                </Button>
              </Field>

            </FieldGroup>
          </FieldSet>
        </form>

      </CardContent>
    </Card>
  )
}