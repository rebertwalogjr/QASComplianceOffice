"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateUsername } from "@/server-actions/account"
import { toast } from "sonner"
import { Loader2Icon, X } from "lucide-react"
import { Label } from "@/components/ui/label"

interface UsernameClientUpdateSectionProps {
  username: string
  onSuccess?: () => void
}

export default function UsernameClientUpdateSection({ username, onSuccess }: UsernameClientUpdateSectionProps) {
  const { update } = useSession()
  const [serverError, setServerError] = useState<string | null>(null)

  const usernameUpdateSchema = z.object({
    username: z.string().min(6, "Username must be atleast 6 characters"),
    password: z.string().min(1, "Password is required to confirm changes"),
  })

  type UsernameUpdateFormValues = z.infer<typeof usernameUpdateSchema>

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting, dirtyFields } } = useForm<UsernameUpdateFormValues>({
    resolver: zodResolver(usernameUpdateSchema),
    mode: "onChange",
    defaultValues: {
      username: username,
      password: "",
    }
  })

  const passwordValue = watch("password")
  const hasFieldErrors = Object.keys(errors).length > 0
  const isUsernameChanged = !!dirtyFields.username

  const isDisabled = isSubmitting || !isUsernameChanged || !passwordValue.trim() || hasFieldErrors

  const onSubmit = async (values: UsernameUpdateFormValues) => {
    const formData = new FormData()

    formData.append("username", values.username)
    formData.append("password", values.password)

    const result = await updateUsername(formData)

    if (result.error) {
      setServerError(result.error)
    } else {
      toast.success("Username updated successfully", { position: "top-center" })
      reset({
        username: values.username,
        password: "",
      })
      setServerError(null)
      await update()
      onSuccess?.()
    }
  }

  const handleClose = () => {
    setServerError(null)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col px-12 my-4 gap-4">
      <div className="flex flex-col gap-2">
        <Label>Username</Label>
        <Input
          {...register("username")}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Password</Label>
        <Input
          {...register("password")}
          type="password"
        />
        {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
      </div>
      {serverError && (
        <div className="flex justify-between text-sm border border-red-500 text-red-500 bg-red-500/10 py-3 px-4 rounded-md font-medium">
          {serverError}
          <Button onClick={handleClose} variant="ghost" size="icon-xs"><X /></Button>
        </div>
      )}
      <div className="flex justify-end">
        <Button type="submit" disabled={isDisabled}>
          {isSubmitting ? <><Loader2Icon className="size-4 animate-spin" />Processing...</> : "Update Username"}
        </Button>
      </div>
    </form>
  )
}