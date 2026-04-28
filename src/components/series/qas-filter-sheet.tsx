"use client"

import { useMemo, useState, useEffect } from "react"
import { FilterIcon, RotateCcw } from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { BaseFilterOption, FilterOptionsPayload } from "@/server-actions/common"

interface FilterSelectProps {
  label: string
  name: string
  data: BaseFilterOption[]
  selectedCompanyId?: string | null
  selectedProjectId?: string | null
  value?: string | null
  onValueChange: (value: string | null) => void
}
export default function QASFilterSheet({ options }: { options: FilterOptionsPayload }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const [filters, setFilters] = useState<{[key: string]: string | null}>({
    company: searchParams.get("company"),
    project: searchParams.get("project"),
    status: searchParams.get("status"),
    type: searchParams.get("type"),
    category: searchParams.get("category"),
    report: searchParams.get("report"),
    engagement: searchParams.get("engagement"),
    rating: searchParams.get("rating"),
    group: searchParams.get("group"),
  })

  useEffect(() => {
    const current: any = {}
    searchParams.forEach((value, key) => (current[key] = value))
    // setFilters((prev) => ({ ...prev, ...current }))
    setFilters({
      company: searchParams.get("company"),
      project: searchParams.get("project"),
      status: searchParams.get("status"),
      type: searchParams.get("type"),
      category: searchParams.get("category"),
      report: searchParams.get("report"),
      engagement: searchParams.get("engagement"),
      rating: searchParams.get("rating"),
      group: searchParams.get("group"),
    })
  }, [searchParams])

  const handleFieldChange = (name: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
        else params.delete(key)
    })
    
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
  }

  const handleResetAll = () => {
    const cleared = Object.keys(filters).reduce((acc, key) => ({ ...acc, [key]: null }), {})
    setFilters(cleared)
    router.push(pathname)
    setIsOpen(false)
  }

  const statuses: BaseFilterOption[] = [
    { id: "open", name: "Open" },
    { id: "accepted", name: "Accepted" },
    { id: "for closing", name: "For Closing" },
    { id: "closed", name: "Closed" },
    { id: "on-hold", name: "On-Hold" },
    { id: "cancelled", name: "Cancelled" },
  ]
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <FilterIcon className="size-4" />Filter
        </Button>
      </SheetTrigger>
      {/* <SheetTrigger type="button" className="">QAS Filter</SheetTrigger> */}
      <SheetContent>
        <form onSubmit={handleApply} className="flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>Advance Filters</SheetTitle>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handleResetAll}
              className="h-8 text-xs text-muted-foreground hover:text-primary"
            >
              Reset All
            </Button>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto space-y-6 px-4">
            {/* Company Field */}
            <FilterSelect
              label="Company"
              name="company"
              data={options.companies}
              value={filters.company}
              onValueChange={(val) => handleFieldChange("company", val)}
            />
            {/* Project Field */}
            <FilterSelect
              label="Project"
              name="project"
              data={options.projects}
              value={filters.project}
              selectedCompanyId={filters.company}
              onValueChange={(val) => handleFieldChange("project", val)}
            />
            {/* Status Field */}
            <FilterSelect
              label="Status"
              name="status"
              data={statuses}
              value={filters.status}
              onValueChange={(val) => handleFieldChange("status", val)}
            />
            {/* Type of Findings Field */}
            <FilterSelect
              label="Type of Findings"
              name="type"
              data={options.findings}
              value={filters.type}
              onValueChange={(val) => handleFieldChange("type", val)}
            />
            {/* Findings Category Field */}
            <FilterSelect
              label="Findings category"
              name="category"
              data={options.categories}
              value={filters.category}
              onValueChange={(val) => handleFieldChange("category", val)}
            />
            {/* Audit Report Number Field */}
            <FilterSelect
              label="Audit Report Number"
              name="report"
              data={options.reports}
              value={filters.report}
              selectedCompanyId={filters.company}
              selectedProjectId={filters.project}
              onValueChange={(val) => handleFieldChange("report", val)}
            />
            {/* Audit Engagement */}
            <FilterSelect
              label="Audit Engagement"
              name="engagement"
              data={options.engagements}
              value={filters.engagement}
              selectedCompanyId={filters.company}
              onValueChange={(val) => handleFieldChange("engagement", val)}
            />
            {/* Audit Rating */}
            <FilterSelect
              label="Audit Rating"
              name="rating"
              data={options.ratings}
              value={filters.rating}
              selectedCompanyId={filters.company}
              onValueChange={(val) => handleFieldChange("rating", val)}
            />
            {/* Recipient Group */}
            <FilterSelect
              label="Recipient Group"
              name="group"
              data={options.groups}
              value={filters.group}
              selectedProjectId={filters.project}
              onValueChange={(val) => handleFieldChange("group", val)}
            />
          </div>
          <SheetFooter>
            <Button type="submit">Apply Filters</Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet >
  )
}

function FilterSelect({ label, name, data, value, selectedCompanyId, selectedProjectId, onValueChange }: FilterSelectProps) {
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
      <div className="flex items-center justify-between">
      <Label className={isDisabled ? "text-muted-foreground" : ""}>{label}</Label>
      {value && value !== "" && (
          <button
            type="button"
            onClick={() => onValueChange(null)}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <RotateCcw className="size-3" />
          </button>
        )}
      </div>
      <Select
        name={name}
        value={value ?? ""}
        onValueChange={(val) => onValueChange(val)}
        key={`${name}-${value ?? 'empty'}`}
        disabled={isDisabled}
      >
        <SelectTrigger className="w-full flex justify-between items-center overflow-hidden">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filteredData?.map((item: any) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}