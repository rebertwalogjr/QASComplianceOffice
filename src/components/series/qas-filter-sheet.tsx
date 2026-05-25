"use client"

import { useState, useEffect } from "react"
import { FilterIcon } from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { Button } from "../ui/button"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { BaseFilterOption, FilterOptionsPayload } from "@/server-actions/common"
import FilterSelect from "../filter-select"

export default function QASFilterSheet({ options }: { options: FilterOptionsPayload }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const [filters, setFilters] = useState<{ [key: string]: string | null }>({
    company: searchParams.get("company"),
    project: searchParams.get("project"),
    status: searchParams.get("status"),
    type: searchParams.get("type"),
    category: searchParams.get("category"),
    report: searchParams.get("report"),
    engagement: searchParams.get("engagement"),
    rating: searchParams.get("rating"),
    group: searchParams.get("group"),
    creator: searchParams.get("creator"),
    assignedTo: searchParams.get("assignedTo"),
  })

  useEffect(() => {
    const current: any = {}
    searchParams.forEach((selected, key) => (current[key] = selected))
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
      creator: searchParams.get("creator"),
      assignedTo: searchParams.get("assignedTo")
    })
  }, [searchParams])

  const handleFieldChange = (name: string, selected: string | null) => {
    setFilters((prev) => ({ ...prev, [name]: selected }))
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(filters).forEach(([key, selected]) => {
      if (selected) params.set(key, selected)
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

  const hasActiveFilters = Object.values(filters).some(value => value !== null && value !== "")

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
            <SheetDescription></SheetDescription>
            {hasActiveFilters && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetAll}
                className="h-8 text-xs text-muted-foreground hover:text-primary"
              >
                Reset All
              </Button>
            )}
          </SheetHeader>
          <div className="flex-1 overflow-y-auto space-y-6 px-4">
            {/* Assigned To */}
            <FilterSelect
              label="Created by"
              name="creator"
              options={options.users}
              selected={filters.creator}
              onValueChange={(val) => handleFieldChange("creator", val)}
            />
            {/* Company Field */}
            <FilterSelect
              label="Company"
              name="company"
              options={options.companies}
              selected={filters.company}
              onValueChange={(val) => handleFieldChange("company", val)}
            />
            {/* Project Field */}
            <FilterSelect
              label="Project"
              name="project"
              options={options.projects}
              selected={filters.project}
              selectedCompanyId={filters.company}
              onValueChange={(val) => handleFieldChange("project", val)}
            />
            {/* Status Field */}
            <FilterSelect
              label="Status"
              name="status"
              options={statuses}
              selected={filters.status}
              onValueChange={(val) => handleFieldChange("status", val)}
            />
            {/* Type of Findings Field */}
            <FilterSelect
              label="Type of Findings"
              name="type"
              options={options.findings}
              selected={filters.type}
              onValueChange={(val) => handleFieldChange("type", val)}
            />
            {/* Findings Category Field */}
            <FilterSelect
              label="Findings category"
              name="category"
              options={options.categories}
              selected={filters.category}
              onValueChange={(val) => handleFieldChange("category", val)}
            />
            {/* Audit Report Number Field */}
            <FilterSelect
              label="Audit Report Number"
              name="report"
              options={options.reports}
              selected={filters.report}
              selectedCompanyId={filters.company}
              selectedProjectId={filters.project}
              onValueChange={(val) => handleFieldChange("report", val)}
            />
            {/* Audit Engagement */}
            <FilterSelect
              label="Audit Engagement"
              name="engagement"
              options={options.engagements}
              selected={filters.engagement}
              selectedCompanyId={filters.company}
              onValueChange={(val) => handleFieldChange("engagement", val)}
            />
            {/* Audit Rating */}
            <FilterSelect
              label="Audit Rating"
              name="rating"
              options={options.ratings}
              selected={filters.rating}
              selectedCompanyId={filters.company}
              onValueChange={(val) => handleFieldChange("rating", val)}
            />
            {/* Recipient Group */}
            <FilterSelect
              label="Recipient Group"
              name="group"
              options={options.groups}
              selected={filters.group}
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