"use client"

import { useEffect, useMemo } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { BaseFilterOption } from "@/server-actions/common"
import { Label } from "./ui/label"

interface FilterSelectProps {
  label: string
  name: string
  options: BaseFilterOption[]
  selectedCompanyId?: string | null
  selected?: string[] | null
  onSelectedChange: (selected: string[] | null) => void
}

export function MultiFilterSelect({ label, name, options, selectedCompanyId, selected, onSelectedChange }: FilterSelectProps) {
  const requiresCompany = selectedCompanyId !== undefined
  const missingCompany = requiresCompany && !selectedCompanyId
  const optionsSelected = selected || []

  let placeholder = `Select ${label.toLowerCase()}`
  let isDisabled = false

  if (missingCompany) {
    placeholder = "Select company first"
    isDisabled = true
  }

  useEffect(() => {
    if (requiresCompany && optionsSelected.length > 0) {
      onSelectedChange([])
    }
  }, [selectedCompanyId])

  const filteredData = useMemo(() => {
    return options.filter((item) => {
      if (missingCompany) return false
      if (item.companyId && selectedCompanyId) {
        if (item.companyId.toString() !== selectedCompanyId) return false
      }
      return true
    })
  }, [options, selectedCompanyId, missingCompany])

  return (
    <div className="flex flex-col gap-2">
      <Label className={isDisabled ? "text-muted-foreground" : ""}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between min-h-10 h-auto flex-wrap gap-1">
            <div className="flex flex-wrap gap-1">
              {optionsSelected.length > 0 ? (
                optionsSelected.map((val: string) => (
                  <Badge key={val} variant="secondary" className="mr-1 border-muted bg-muted">
                    {options.find((o: any) => o.id.toString() === val)?.name}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground font-normal">Select {label}...</span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command key={`${name}-${selectedCompanyId ?? 'all'}`}>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {filteredData.map((option: any) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      const id = option.id.toString()
                      onSelectedChange(optionsSelected.includes(id) ? optionsSelected.filter((s: any) => s !== id) : [...optionsSelected, id])
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", optionsSelected.includes(option.id.toString()) ? "opacity-100" : "opacity-0")} />
                    {option.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}