"use client"

import { useSession } from "next-auth/react";
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react";
import Image from "next/image"

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { activateAccount } from "@/server-actions/user";

const activateSchema = z.object({
  npassword: z.string().min(8, "Password must be at least 8 characters long"),
  cpassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.npassword === data.cpassword, {
  error: "Password do not match.",
  path: ["cpassword"]
})

type ActivateFormValues = z.infer<typeof activateSchema>

export function ActivateForm() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/qas"

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<ActivateFormValues>({
    resolver: zodResolver(activateSchema),
    defaultValues: {
      npassword: "",
      cpassword: "",
    },
  })

  const onSubmit = async (data: ActivateFormValues) => {
    setIsLoading(true)

    const result = await activateAccount(data.npassword)

    if (result.error === "PASSWORD_SAME_AS_CURRENT") {
      setError("npassword", {
        type: "validate",
        message: "New password cannot be the same as your current password"
      })
      setIsLoading(false)
      return
    }

    if (result?.error) {
      toast.error(result.error)
      setIsLoading(false)
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

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <div className="flex gap-2 mb-4">
          <Image src="/DMCILogo.png" width={128} height={32} alt="DMCI Logo" priority className="object-contain" />
        </div>
        <CardTitle>Activate your account</CardTitle>
      </CardHeader>
      <CardContent>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="npassword">New Password</FieldLabel>
                <Input id="npassword" type="password" placeholder="********" {...register("npassword")} disabled={isLoading} tabIndex={1} />
                {errors.npassword && (
                  <FieldError>{errors.npassword.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="cpassword">Confirm Password</FieldLabel>
                <Input id="password" type="password" placeholder="********" {...register("cpassword")} disabled={isLoading} tabIndex={2} />
                {errors.cpassword && (
                  <FieldError>{errors.cpassword.message}</FieldError>
                )}
              </Field>


              <Field>
                <Button type="submit" disabled={isLoading} tabIndex={3}>
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Activating...
                    </>
                  ) : "Activate"}
                </Button>
              </Field>

            </FieldGroup>
          </FieldSet>
        </form>

      </CardContent>
    </Card>
  )
}