"use client"

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, FilterIcon, FilterX } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Column } from "@tanstack/react-table";
import { Transaction } from "@/lib/transaction";

type PopoverStatusFilterProps = {
  column: Column<Transaction, unknown>
}

export default function PopoverStatusFilter({ column }: PopoverStatusFilterProps) {
  const [open, setOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<number[]>([])

  const toggleStatus = (id: number) => {
    setSelectedStatus(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const statuses = [
    { id: 1, value: "All" },
    { id: 2, value: "New" },
    { id: 3, value: "Open" },
    { id: 4, value: "Request for Hold" },
    { id: 5, value: "On-Hold" },
    { id: 6, value: "Accepted" },
    { id: 7, value: "For Closing" },
    { id: 8, value: "Closed" },
    { id: 9, value: "Cancelled" },
  ]

  const handleApplyFilter = () => {
    column.setFilterValue(selectedStatus.map(id => statuses.find(s => s.id === id)?.value))
    setOpen(false)
  }

  const handleClearFilter = () => {
    column.setFilterValue(undefined)
    setOpen(false)
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
              key={ status.id } 
              variant="ghost" 
              size="sm"
              onClick={() => toggleStatus(status.id)}
            >
            <div className="w-full flex items-center gap-3 justify-between">
               { status.value }
               { selectedStatus.includes(status.id) && <Check /> }
            </div>
          </Button>
          ))}
        </div>
        <Separator />
        <div className="flex p-2 gap-2">
          <Button
            className="flex-1"
            onClick={() => handleApplyFilter() }
          >Apply</Button>
          <Button variant="outline" size="icon" onClick={() => handleClearFilter() }>
            <FilterX />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}