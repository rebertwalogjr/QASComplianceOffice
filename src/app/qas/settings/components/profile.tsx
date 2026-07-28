"use client"

import { useState } from "react"
import { updateUserProfile, UserDetailsPayload } from "@/server-actions/profile"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2Icon, X } from "lucide-react"
import { toast } from "sonner"

export default function PersonalDetailsContainer({ userData }: { userData: UserDetailsPayload | null }) {
  const [serverError, setServerError] = useState<string | null>(null)

  const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(1, "Last name is required"),
    employeeNumber: z.string().min(1, "Employee number is required"),
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required to confirm changes"),
  })

  type ProfileFormValues = z.infer<typeof profileSchema>

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting, dirtyFields } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: userData?.firstName ?? "",
      middleName: userData?.middleName ?? "",
      lastName: userData?.lastName ?? "",
      employeeNumber: userData?.employeeNumber,
      email: userData?.emailAddress || "",
      password: "",
    }
  })

  const passwordValue = watch("password")

  const isProfileChanged = Object.keys(dirtyFields).some((key) => key !== "password")
  const hasProfileErrors = Object.keys(errors).some((key) => key !== "password")

  const isDisabled = isSubmitting || !passwordValue.trim() || !isProfileChanged || hasProfileErrors

  const onSubmit = async (values: ProfileFormValues) => {
    const formData = new FormData()

    formData.append("firstName", values.firstName)
    formData.append("middleName", values.middleName ?? "")
    formData.append("lastName", values.lastName)
    formData.append("employeeNumber", values.employeeNumber)
    formData.append("email", values.email)
    formData.append("password", values.password)

    const result = await updateUserProfile(formData)

    if (result.error) {
      // toast.error(result.error)
      setServerError(result.error)
    } else {
      toast.success("User profile updated", { position: "top-center" })
      reset({
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        employeeNumber: values.employeeNumber,
        email: values.email,
        password: "",
      })
      setServerError(null)
    }
  }

  const handleClose = () => {
    setServerError(null)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="px-4 mx-4 py-2">
      <div className="flex flex-col gap-4 px-4">
        <div className="flex flex-col gap-2">
          <Label>First Name</Label>
          <Input
            {...register("firstName")}
            className="w-full"
          />
          {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Middle Name</Label>
          <Input
            {...register("middleName")}
            className="w-full"
          />
          {errors.middleName && <p className="text-xs text-destructive mt-1">{errors.middleName.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Last Name</Label>
          <Input
            {...register("lastName")}
            className="w-full"
          />
          {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Employee Number</Label>
          <Input
            {...register("employeeNumber")}
            className="w-full"
          />
          {errors.employeeNumber && <p className="text-xs text-destructive mt-1">{errors.employeeNumber.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            {...register("email")}
            className="w-full"
          />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-normal text-muted-foreground">Password is required to update.</Label>
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
            {isSubmitting && <Loader2Icon className="mr-2 size-4 animate-spin" />}
            Update Profile
          </Button>
        </div>
      </div>
    </form>
  )
}