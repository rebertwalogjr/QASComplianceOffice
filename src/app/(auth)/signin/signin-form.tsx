"use client"

import { useState, startTransition } from "react"
import Image from "next/image"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { getUserTheme } from "@/server-actions/theme"
import { useTheme } from "next-themes"

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function SignInForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/qas"
  const { theme, setTheme } = useTheme()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)

    const result = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      // Invalid credential
      if (result.error === "CredentialsSignin") {
        toast.error("Invalid username or password.", { position: "top-center" })
      } else { // Unexpected Error
        toast.error(result?.error, { position: "top-center" })
      }
      setIsLoading(false)
      return
    }

    startTransition(() => {
      router.push(callbackUrl)
    })

    const theme = await getUserTheme()
    setTheme(theme.toLowerCase())
  }

  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <div className="flex gap-2 mb-4">
          <Image
            src="/DMCILogo.png"
            width={128} height={32}
            alt="DMCI Logo"
            priority
            className="object-contain"
          />
        </div>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your username below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet className="">
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" type="text" placeholder="email or username" {...register("username")} disabled={isLoading} tabIndex={1} />
                {errors.username && (
                  <FieldError>{errors.username.message}</FieldError>
                )}
              </Field>

              <Field>
                <div className="flex justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Button variant="link" className="font-normal h-auto p-0" tabIndex={4} >
                    Forgot your password?
                  </Button>
                </div>
                <Input id="password" type="password" placeholder="********" {...register("password")} disabled={isLoading} tabIndex={2} />
                {errors.password && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>

              <Field>
                <Button type="submit" disabled={isLoading} tabIndex={3}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Field>

            </FieldGroup>
          </FieldSet>
        </form>

        <div className="flex justify-center mt-4 gap-1">
          <Label className="font-normal text-muted-foreground">Don't have an account?</Label>
          <Button variant="link" className="font-normal h-auto p-0" tabIndex={5}>
            Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}