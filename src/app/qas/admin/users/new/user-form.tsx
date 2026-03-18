"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { generateUserName } from "@/lib/utils"
import { FolderLock, Group, Loader2, Megaphone, User as UserIcon } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import { EmployeeCommand } from "@/components/employeeMaster-command"
import { MultiSelectCommand } from "@/components/multiselect-command"
import { EscalationCommand } from "@/components/escalations-command"

import { createUser } from "@/server-actions/user"
import { ActiveCompanyPayload } from "@/server-actions/company"
import { ActiveGroupPayload } from "@/server-actions/group"
import { ActiveProjectPayload } from "@/server-actions/project"
import { ActiveRolePayload } from "@/server-actions/role"

type SelectedEmployee = {
  employeeNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  position: string | null;
  emailAddress: string | null;
} | null;

interface UserFormProps {
  companies: ActiveCompanyPayload[] | null
  groups: ActiveGroupPayload[] | null
  projects: ActiveProjectPayload[] | null
  roles: ActiveRolePayload[] | null
}

export default function UserForm({ companies, groups, projects, roles }: UserFormProps) {
  const router = useRouter()

  const userSchema = z.object({
    employeeNumber: z.string().min(1, "Please select employee"),
    username: z.string().min(1, "Please select employee first to generate username"),
    emailAddress: z.email("Invalid email address").min(1, "Email is required"),
    companyId: z.string().min(1, "Please select a company"),
    isEscalation: z.boolean(),
    roleIds: z.array(z.number()).min(1, "At least on user level is required"),
    groupIds: z.array(z.number()).nullable(),
    projectIds: z.array(z.number()).nullable(),
    escalations: z.object({
      first: z.any().nullable(),
      second: z.any().nullable(),
      third: z.any().nullable(),
      fourth: z.any().nullable(),
    }),
  }).superRefine((data, ctx) => {
    const isSecretariat = data.roleIds.includes(1001)
    const isRecipient = data.roleIds.includes(1004)

    if (isSecretariat && (!data.projectIds || data.projectIds?.length === 0)) {
      ctx.addIssue({
        code: "custom",
        message: "At least one project is required for secretariat",
        path: ["projectIds"]
      })
    }

    if (isRecipient) {
      if (data.groupIds?.length === 0) {
        ctx.addIssue({ code: "custom", message: "At least one group is required for recipient", path: ["groupIds"] })
      }
      if (!data.escalations.first) {
        ctx.addIssue({ code: "custom", message: "First escalation is required for recipient", path: ["escalations.first"] })
      }
      if (!data.escalations.second) {
        ctx.addIssue({ code: "custom", message: "Second escalation is required for recipient", path: ["escalations.second"] })
      }
      if (!data.escalations.third) {
        ctx.addIssue({ code: "custom", message: "Third escalation is required for recipient", path: ["escalations.third"] })
      }
      if (!data.escalations.fourth) {
        ctx.addIssue({ code: "custom", message: "Fourth escalation is required for recipient", path: ["escalations.fourth"] })
      }
    }
  })

  type UserFormValues = z.infer<typeof userSchema>

  const [selectedEmployee, setSelectedEmployee] = useState<SelectedEmployee>(null)

  const { register, handleSubmit, control, setValue, watch, clearErrors, resetField, formState: { errors, isSubmitting }, } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      employeeNumber: "",
      username: "",
      emailAddress: "",
      companyId: "",
      isEscalation: false,
      roleIds: [],
      projectIds: [],
      groupIds: [],
      escalations: { first: null, second: null, third: null, fourth: null }
    }
  })

  const handleEmployeeSelect = (emp: SelectedEmployee) => {
    setSelectedEmployee(emp)
    if (emp) {
      setValue("employeeNumber", emp.employeeNumber, { shouldValidate: true })
      setValue("username", generateUserName(emp.firstName, emp.middleName, emp.lastName), { shouldValidate: true })
      setValue("emailAddress", emp.emailAddress ?? "", { shouldValidate: true })
    } else {
      setValue("employeeNumber", "", { shouldValidate: true })
      setValue("username", "", { shouldValidate: true })
      setValue("emailAddress", "", { shouldValidate: true })
    }
  }

  const onSubmit = async (values: UserFormValues) => {
    const response = await createUser({ ...values })

    if (response.error) {
      toast.error("Error: " + response.error)
    } else {
      toast.success("User created successfully!");
      router.push("/qas/admin/users")
      router.refresh()
    }
  }

  const roleIdsSelected = watch("roleIds")
  const isSecretariat = roles?.some(r => roleIdsSelected.includes(r.id) && r.id === 1001)
  const isRecipient = roles?.some(r => roleIdsSelected.includes(r.id) && r.id === 1004)

  useEffect(() => {
    if (!isRecipient) {
      clearErrors(["groupIds", "escalations.first", "escalations.second", "escalations.third", "escalations.fourth"])
      resetField("groupIds")
      resetField("escalations.first")
      resetField("escalations.second")
      resetField("escalations.third")
      resetField("escalations.fourth")
    }
    if (!isSecretariat) {
      clearErrors("projectIds")
      resetField("projectIds")
    }
  }, [isRecipient, isSecretariat, clearErrors])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="@container/main pt-10 pb-6">
      <div className="flex flex-col gap-8 px-3 md:px-32">

        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
          <div className="flex flex-col gap-4">

            <div className="flex items-center gap-2">
              <div className="rounded-md border p-2 bg-primary/10 text-primary border-primary">
                <UserIcon size={16} />
              </div>
              <Label className="text-lg">Personal Information</Label>
            </div>

            <Card className="shadow-none">
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel>Select Employee</FieldLabel>
                    <EmployeeCommand onSelect={handleEmployeeSelect} />
                    {errors.employeeNumber && <p className="text-xs text-destructive">{errors.employeeNumber.message}</p>}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="empId">Employee Id</FieldLabel>
                    <Input
                      id="empId"
                      value={(selectedEmployee?.employeeNumber ?? "")}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="firtname">First Name</FieldLabel>
                    <Input
                      id="firtname"
                      value={(selectedEmployee?.firstName ?? "")}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="lastname">Last Name</FieldLabel>
                    <Input
                      id="lastname"
                      value={(selectedEmployee?.lastName ?? "")}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="position">Position</FieldLabel>
                    <Input
                      id="position"
                      value={(selectedEmployee?.position ?? "")}
                      className="bg-muted"
                      readOnly />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <Input
                      {...register("emailAddress")}
                      placeholder="employee@company.com"
                    />
                    {errors.emailAddress && <p className="text-xs text-destructive">{errors.emailAddress.message}</p>}
                  </Field>

                </FieldGroup>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4">

            <div className="flex items-center gap-2">
              <div className="rounded-md border p-2 bg-cyan-500/10 text-cyan-500 border-cyan-500">
                <FolderLock size={16} />
              </div>
              <Label className="text-lg">Access Information</Label>
            </div>

            {/* Access Information Card  */}
            <Card className="shadow-none">
              <CardContent>
                <FieldSet>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="company">Company</FieldLabel>
                      <Controller
                        name="companyId"
                        control={control}
                        render={({ field }) => (
                          <Select
                            required
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select company..." />
                            </SelectTrigger>
                            <SelectContent
                              className="w-[calc(100vw-32px)] md:w-full p-0"
                              align="start"
                              position="popper"
                              sideOffset={4}
                            >
                              {companies?.map((company: any) => (
                                <SelectItem key={company.id} value={company.id.toString()}>
                                  <span className="truncate inline-block max-w-[80vw] md:max-w-none">
                                    {company.name}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.companyId && <p className="text-xs text-destructive">{errors.companyId.message}</p>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="userlevel">User Level</FieldLabel>
                      <Controller
                        name="roleIds"
                        control={control}
                        render={({ field }) => (
                          <MultiSelectCommand
                            records={roles ?? []}
                            selectedIds={field.value}
                            onChange={field.onChange} />
                        )}
                      />
                      {errors.roleIds && <p className="text-xs text-destructive">{errors.roleIds.message}</p>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="username">Username</FieldLabel>
                      <Input {...register("username")} />
                      {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="addEmail">Escalation</FieldLabel>
                      <div className="flex gap-3 items-center">
                        <Controller
                          name="isEscalation"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              id="isEscalation"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          )}
                        />
                        <FieldDescription>Add to Escalation?</FieldDescription>
                      </div>
                    </Field>

                  </FieldGroup>

                </FieldSet>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-green-500/10 text-green-500 border-green-500">
              <Group size={16} />
            </div>
            <Label className="text-lg">Groups & Projects</Label>
          </div>

          <Card className="shadow-none">
            <CardContent>
              <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                <Field>
                  <FieldLabel htmlFor="group">User Group</FieldLabel>
                  <Controller
                    name="groupIds"
                    control={control}
                    render={({ field }) => (
                      <MultiSelectCommand
                        records={groups ?? []}
                        selectedIds={field.value ?? []}
                        onChange={field.onChange}
                        disabled={!isRecipient}
                      />
                    )}
                  />
                  {errors.groupIds && <p className="text-xs text-destructive">{errors.groupIds.message}</p>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="project">Project</FieldLabel>
                  <Controller
                    name="projectIds"
                    control={control}
                    render={({ field }) => (
                      <MultiSelectCommand
                        records={projects ?? []}
                        selectedIds={field.value ?? []}
                        onChange={field.onChange}
                        disabled={!isSecretariat}
                      />
                    )}
                  />
                  {errors.projectIds && <p className="text-xs text-destructive">{errors.projectIds.message}</p>}
                </Field>
              </div>
            </CardContent>
          </Card>

        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-orange-500/10 text-orange-500 border-orange-500">
              <Megaphone size={16} />
            </div>
            <Label className="text-lg">Set Escalation</Label>
          </div>

          {/* Set Escalation Card */}
          <Card className="shadow-none">
            <CardContent>
              <FieldSet>
                <FieldGroup>

                  <Field>
                    <FieldLabel htmlFor="escalation">First Escalation</FieldLabel>
                    <Controller
                      name="escalations.first"
                      control={control}
                      render={({ field }) => (
                        <EscalationCommand
                          defaultValue={field.value}
                          onSelect={field.onChange}
                          disabled={!isRecipient}
                        />
                      )}
                    />
                    {errors.escalations?.first && <p className="text-xs text-destructive">{String(errors.escalations.first.message)}</p>}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="escalation">Second Escalation</FieldLabel>
                    <Controller
                      name="escalations.second"
                      control={control}
                      render={({ field }) => (
                        <EscalationCommand
                          defaultValue={field.value}
                          onSelect={field.onChange}
                          disabled={!isRecipient}
                        />
                      )}
                    />
                    {errors.escalations?.second && <p className="text-xs text-destructive">{String(errors.escalations.second.message)}</p>}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="escalation">Third Escalation</FieldLabel>
                    <Controller
                      name="escalations.third"
                      control={control}
                      render={({ field }) => (
                        <EscalationCommand
                          defaultValue={field.value}
                          onSelect={field.onChange}
                          disabled={!isRecipient}
                        />
                      )}
                    />
                    {errors.escalations?.third && <p className="text-xs text-destructive">{String(errors.escalations.third.message)}</p>}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="escalation">Fourth Escalation</FieldLabel>
                    <Controller
                      name="escalations.fourth"
                      control={control}
                      render={({ field }) => (
                        <EscalationCommand
                          defaultValue={field.value}
                          onSelect={field.onChange}
                          disabled={!isRecipient}
                        />
                      )}
                    />
                    {errors.escalations?.fourth && <p className="text-xs text-destructive">{String(errors.escalations.fourth.message)}</p>}
                  </Field>

                </FieldGroup>

              </FieldSet>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" disabled={isSubmitting} asChild><Link href="/qas/admin/users">Cancel</Link></Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Save
          </Button>
        </div>

      </div>
    </form>
  );
}