"use client"

import { FilterIcon } from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { BaseFilterOption, FilterOptionsPayload } from "@/server-actions/common"
import { useMemo, useState } from "react"

interface FilterSelectProps {
  label: string
  name: string
  data: BaseFilterOption[]
  selectedCompanyId?: string | null
  selectedProjectId?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string) => void
}
export default function QASFilterSheet({ options }: { options: FilterOptionsPayload }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCompanyId, setSelectedCompany] = useState<string | null>(searchParams.get("companyId"))
  const [selectedProjectId, setSelectedProject] = useState<string | null>(searchParams.get("projectId"))

  const statuses: BaseFilterOption[] = [
    { id: "open", name: "Open" },
    { id: "accepted", name: "Accepted" },
    { id: "for closing", name: "For Closing" },
    { id: "closed", name: "Closed" },
    { id: "on-hold", name: "On-Hold" },
    { id: "cancelled", name: "Cancelled" },
  ]

  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const params = new URLSearchParams(searchParams.toString())

    formData.forEach((value, key) => {
      if (value) params.set(key, value as string)
      else params.delete(key)
    })

    router.push(`?${params.toString()}`)
  }

  const handleReset = () => {
    setSelectedCompany(null)
    setSelectedProject(null)
    // router.push(window.location.pathname)
  }

  return (
    <Sheet>
      <form onSubmit={handleApply}>
        <SheetTrigger asChild>
          <Button variant="outline" onClick={handleReset}>
            <FilterIcon className="size-4" />QAS Filter
          </Button>
        </SheetTrigger>
        {/* <SheetTrigger type="button" className="">QAS Filter</SheetTrigger> */}
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Advance Filters</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto space-y-6 px-4">
            {/* Company Field */}
            <FilterSelect
              label="Company"
              name="companyId"
              data={options.companies}
              defaultValue={searchParams.get("companyId")}
              onValueChange={setSelectedCompany}
            />
            {/* Project Field */}
            <FilterSelect
              label="Project"
              name="projectId"
              data={options.projects}
              defaultValue={searchParams.get("projectId")}
              selectedCompanyId={selectedCompanyId}
              onValueChange={setSelectedProject}
            />
            {/* Status Field */}
            <FilterSelect
              label="Status"
              name="status"
              data={statuses}
              defaultValue={searchParams.get("status")}
            />
            {/* Type of Findings Field */}
            <FilterSelect
              label="Type of Findings"
              name="typeOfFindings"
              data={options.findings}
              defaultValue={searchParams.get("typeOfFindings")}
            />
            {/* Findings Category Field */}
            <FilterSelect
              label="Findings category"
              name="category"
              data={options.categories}
              defaultValue={searchParams.get("category")}
            />
            {/* Audit Report Number Field */}
            <FilterSelect
              label="Audit Report Number"
              name="report"
              data={options.reports}
              defaultValue={searchParams.get("reports")}
              selectedCompanyId={selectedCompanyId}
              selectedProjectId={selectedProjectId}
            />
            {/* Audit Engagement */}
            <FilterSelect
              label="Audit Engagement"
              name="engagement"
              data={options.engagements}
              defaultValue={searchParams.get("engagement")}
              selectedCompanyId={selectedCompanyId}
            />
            {/* Audit Rating */}
            <FilterSelect
              label="Audit Rating"
              name="rating"
              data={options.ratings}
              defaultValue={searchParams.get("rating")}
              selectedCompanyId={selectedCompanyId}
            />
            {/* Recipient Group */}
            <FilterSelect
              label="Recipient Group"
              name="group"
              data={options.groups}
              defaultValue={searchParams.get("group")}
              selectedProjectId={selectedProjectId}
            />
            {/* Recipient */}
            {/* <div className="grid gap-3">
              <Label>Recipient</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="proj 1">Project 1</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div> */}
          </div>
          <SheetFooter>
            <Button type="submit">Apply</Button>
            <SheetClose asChild>
              <Button variant="outline" onClick={handleReset}>Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </form>
    </Sheet >
  )
}

function FilterSelect({ label, name, data, defaultValue, selectedCompanyId, selectedProjectId, onValueChange }: FilterSelectProps) {
  const requiresCompany = selectedCompanyId !== undefined
  const requiresProject = selectedProjectId !== undefined
  const missingCompany = requiresCompany && !selectedCompanyId
  const missingProject = requiresProject && !selectedProjectId

  let placeholder = `Select ${label.toLowerCase()}`
  let isDisabled = false

  if (missingCompany) {
    placeholder = "Select company first"
    isDisabled = true
  } else if (missingProject) {
    placeholder = "Select project first"
    isDisabled = true
  }
  
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (missingCompany || missingProject) return false
      if (item.companyId && selectedCompanyId) {
        if (item.companyId.toString() !== selectedCompanyId) return false
      }
      if (item.projectId && selectedProjectId) {
        if (item.projectId.toString() !== selectedProjectId) return false
      }
      return true
    })
  }, [data, selectedCompanyId, selectedProjectId, missingCompany, missingProject])

  return (
    <div className="grid gap-2 w-full">
      <Label>{label}</Label>
      <Select
        name={name}
        defaultValue={defaultValue ?? undefined}
        onValueChange={onValueChange}
        key={`${name}-${selectedCompanyId}-${selectedProjectId}-${defaultValue}`}
        disabled={isDisabled}
      >
        <SelectTrigger className="w-full flex justify-between items-center overflow-hidden">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filteredData?.map((item: any) => (
              <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}