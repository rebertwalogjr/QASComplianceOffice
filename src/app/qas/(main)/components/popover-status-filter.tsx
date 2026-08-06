"use client"

import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, FilterIcon, FilterX } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Column } from "@tanstack/react-table";
import { TransactionBasicPaylod } from "@/server-actions/transaction";
import { toTitleCase } from "@/lib/utils";

type PopoverStatusFilterProps = {
  column: Column<TransactionBasicPaylod, unknown>
}

export default function PopoverStatusFilter({ column }: PopoverStatusFilterProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [temp, setTemp] = useState<string[]>([])
  
  useEffect(() => {
    if (open) {
      setTemp(selected)
    }
  }, [open])

  const statuses = ["open", "on-hold", "accepted", "for closing", "closed", "cancelled"]

  const toggleStatus = (value: string) => {
    setTemp(prev => 
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    )
  }

  const handleApply = () => {
    setSelected(temp)
    column.setFilterValue(temp.length ? temp : undefined)
    setOpen(false)
  }

  const handleClear = () => {
    setSelected([])
    setTemp([])
    setOpen(false)
    column.setFilterValue(undefined)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-background"
          size="icon-sm"
        >
          <FilterIcon /> 
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0">
        <div className="flex flex-col gap-1 p-3">
          {statuses.map((status) => (
            <Button 
              key={ status } 
              variant="ghost" 
              size="sm"
              onClick={() => toggleStatus(status)}
            >
            <div className="w-full flex items-center gap-3 justify-between">
               { toTitleCase(status) }
               { temp.includes(status) && <Check /> }
            </div>
          </Button>
          ))}
        </div>
        <Separator />
        <div className="flex p-2 gap-2">
          <Button
            className="flex-1"
            onClick={() => handleApply() }
          >Apply</Button>
            <Button variant="outline" size="icon" onClick={() => handleClear() }>
            <FilterX />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}