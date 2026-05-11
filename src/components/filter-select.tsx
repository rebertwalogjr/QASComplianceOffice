"use client"

import { useMemo } from "react"
import { Label } from "./ui/label"
import { RotateCcw } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { BaseFilterOption } from "@/server-actions/common"

interface FilterSelectProps {
  label: string
  name: string
  options: BaseFilterOption[]
  selectedCompanyId?: string | null
  selectedProjectId?: string | null
  selected?: string | null
  onValueChange: (selected: string | null) => void
}

export default function FilterSelect({ label, name, options, selected, selectedCompanyId, selectedProjectId, onValueChange }: FilterSelectProps) {
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
    return options.filter((item) => {
      if (missingCompany || missingProject) return false
      if (item.companyId && selectedCompanyId) {
        if (item.companyId.toString() !== selectedCompanyId) return false
      }
      if (item.projectId && selectedProjectId) {
        if (item.projectId.toString() !== selectedProjectId) return false
      }
      return true
    })
  }, [options, selectedCompanyId, selectedProjectId, missingCompany, missingProject])

  return (
    <div className="grid gap-2 w-full">
      <div className="flex items-center justify-between">
        <Label className={isDisabled ? "text-muted-foreground" : ""}>{label}</Label>
        {selected && selected !== "" && (
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
        value={selected ?? ""}
        onValueChange={(val) => onValueChange(val)}
        key={`${name}-${selected ?? 'empty'}`}
        disabled={isDisabled}
      >
        <SelectTrigger className="w-full flex justify-between items-center overflow-hidden">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filteredData?.map((item: any) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {item.name ?? item.firstName}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}