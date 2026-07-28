"use client"

import { useState, useEffect } from "react"
import { canUpdatePassword, changePassword } from "@/server-actions/password"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2Icon, X } from "lucide-react"

export default function ChangePasswordPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [isCheckingAccess, setIsCheckingAccess] = useState(true)
  const [canUpdate, setCanUpdate] = useState(false)
  const [restrictionError, setRestrictionError] = useState<string | null>(null)

  const passwordSchema = z.object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(8, "New password must be 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be 8 characters"),
  })

  type PasswordFormValues = z.infer<typeof passwordSchema>

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  })

  useEffect(() => {
    async function verifyEligibility() {
      setIsCheckingAccess(true)
      const res = await canUpdatePassword()

      if (!res.result) {
        setCanUpdate(false)
        setRestrictionError(res.error)
      } else {
        setCanUpdate(true)
      }
      setIsCheckingAccess(false)
    }

    verifyEligibility()
  }, [])

  const passwordValue = watch("oldPassword")
  const newPasswordValue = watch("newPassword")
  const confirmPasswordValue = watch("confirmPassword")

  const hasEmptyFields = !passwordValue.trim() || !newPasswordValue.trim() || !confirmPasswordValue.trim()

  const hasFieldErrors = Object.keys(errors).length > 0

  const isDisabled = isSubmitting || hasFieldErrors || hasEmptyFields

  const onSubmit = async (values: PasswordFormValues) => {
    const formData = new FormData()

    if (values.newPassword !== values.confirmPassword) {
      setErrorMessage("New passwords do not match.")
      return
    }

    formData.append("oldPassword", values.oldPassword)
    formData.append("newPassword", values.newPassword)
    formData.append("confirmPassword", values.confirmPassword)

    const res = await changePassword(formData)

    if (!res.success) {
      setErrorMessage(res.error || "Failed to update password.")
    } else {
      setSuccess(res.message || "Password updated successfully!")
    }
  }

  const handleClose = () => {
    setErrorMessage(null)
  }

  if (isCheckingAccess) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground gap-2">
        <Loader2Icon className="size-5 animate-spin" />
        <span>Checking eligibility...</span>
      </div>
    )
  }

  if (!canUpdate) {
    return (
      <div className="px-4 mx-4 py-2">
        <div className="text-sm border border-primary text-primary bg-primary/10 p-4 rounded-md font-medium">
          {restrictionError}
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="px-4 mx-4">
        <div className="px-4">
          <div className="text-sm border border-emerald-600 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-md font-medium">
            {success}
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-4 mx-4 py-2">
      <div className="flex flex-col gap-4 px-4">
        {/* {success && (
          <div className="text-sm border border-emerald-600 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-md font-medium">
            {success}
          </div>
        )} */}
        <div className="flex flex-col gap-2">
          <Label>Old Password</Label>
          <Input
            {...register("oldPassword")}
            type="password"
            className="w-full"
            disabled={isSubmitting}
          />
          {errors.oldPassword && <p className="text-xs text-destructive mt-1">{errors.oldPassword.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label>New Password</Label>
          <Input
            {...register("newPassword")}
            type="password"
            className="w-full"
            disabled={isSubmitting}
          />
          {errors.newPassword && <p className="text-xs text-destructive mt-1">{errors.newPassword.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Confirm New Password</Label>
          <Input
            {...register("confirmPassword")}
            type="password"
            className="w-full"
            disabled={isSubmitting}
          />
          {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
        </div>
        {errorMessage && (
          <div className="flex justify-between text-sm border border-red-500 text-red-500 bg-red-500/10 py-3 px-4 rounded-md font-medium">
            {errorMessage}
            <Button onClick={handleClose} variant="ghost" size="icon-xs"><X /></Button>
          </div>
        )}
        <div className="flex justify-end">
          <Button type="submit" disabled={isDisabled}>
            {isSubmitting && <Loader2Icon className="mr-2 size-4 animate-spin" />}
            Update Password
          </Button>
        </div>
      </div>
    </form >
  )
}