"use client";
import { EmployeeSearch } from "@/components/employee-infinite-search";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createUser } from "@/hooks/actions";
import { User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
// import { User, Company } from "../../../../../../generated/prisma/client";


export default function UserForm({ mode, initialData, companies }: any) {
  const isFormModeEdit = mode === "edit"

  const [selectedEmp, setSelectedEmp] = useState(initialData?.employeeNumber || "")

  const handleEmployeeSelect = (empNum: string) => {
    setSelectedEmp(empNum);
    // const emp = employeeMaster.find((e: any) => e.employeeNumber === empNum);
    // You could use a form library like react-hook-form here to update values
  };

  return (
    <div className="@container/main py-6 bg-muted">
      <div className="flex flex-col gap-4 px-3 md:px-40">

        <Label className="text-lg font-bold">
          {mode === "edit" ? "Update User" : "Create New User"}
        </Label>

        <div className="flex items-center gap-2">
          <div className="rounded-md border p-2 bg-primary/10 text-primary border-primary">
            <UserIcon size={16} />
          </div>
          <Label className="text-lg">Personal Information</Label>
        </div>

        <Card className="shadow-none">
          <CardContent className="pt-6">
            <FieldGroup>
              <Field>
                <FieldLabel>Select Employee</FieldLabel>
                { isFormModeEdit ?
                  <Input value={`${initialData.lastname}, ${initialData?.firstname} (${initialData.employeeNumber})`}  disabled className="bg-muted" />
                  : <EmployeeSearch onSelect={handleEmployeeSelect}/>
              }
                {/* <Select
                  defaultValue={selectedEmp}
                  disabled={isFormModeEdit}
                >
                  <SelectTrigger><SelectValue placeholder="Search employee..." /></SelectTrigger>
                  <SelectContent>
                    {employeeMaster.map((emp: any) => (
                      <SelectItem key={emp.employeeNumber} value={emp.employeeNumber}>
                        {emp.firstName} {emp.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
              </Field>

              {/* 2. Auto-filled Fields based on selection */}
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Employee ID</FieldLabel>
                  <Input value={selectedEmp} readOnly className="bg-muted" />
                </Field>
                <Field>
                  <FieldLabel>First Name</FieldLabel>
                  {/* <Input value={currentEmployee?.firstName || ""} readOnly className="bg-muted" /> */}
                </Field>
              </div>

              {/* 3. Company Selection */}
              <Field>
                <FieldLabel>Company</FieldLabel>
                <Select defaultValue={initialData?.companyId?.toString()}>
                  <SelectTrigger><SelectValue placeholder="Select company..." /></SelectTrigger>
                  <SelectContent>
                    {companies.map((comp: any) => (
                      <SelectItem key={comp.id} value={comp.id.toString()}>
                        {comp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* ... rest of your form fields ... */}

            </FieldGroup>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button variant="outline" asChild><Link href="/qas/admin/users">Cancel</Link></Button>
          <Button type="submit">Save User</Button>
        </div>
      </div>
    </div>
  );
}