"use client"
import { useState, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "./ui/button"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { EscalationUserPayload, getEscalationUser } from "@/server-actions/escalations"

interface EscalationCommandProps {
  onSelect: (data: any) => void
  defaultValue?: EscalationUserPayload | null
  disabled?: boolean
}

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export function EscalationCommand({ onSelect, defaultValue, disabled }: EscalationCommandProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [records, setRecords] = useState<EscalationUserPayload[]>([])
  const [selected, setSelected] = useState<EscalationUserPayload | null>(defaultValue || null)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const { ref, inView } = useInView()

  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    if (!open) {
      setSearch("")
    }
  }, [open])

  useEffect(() => {
    setSelected(defaultValue || null)
  }, [defaultValue])

  // Initial and Search fetch
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true)
      const res = await getEscalationUser(debouncedSearch, 0)
      setRecords(res.data || [])
      setHasMore((res.data || []).length === 20)
      setLoading(false)
    }
    fetchInitial()
  }, [debouncedSearch])

  // Load more when scrolling
  useEffect(() => {
    if (inView && hasMore && !loading) {
      const loadMore = async () => {
        setLoading(true)
        const res = await getEscalationUser(search, records.length)
        const newData = res.data || []
        setRecords((prev) => [...prev, ...newData])
        setHasMore(newData.length === 20)
        setLoading(false)
      }
      loadMore()
    }
  }, [inView, hasMore, loading, debouncedSearch, records.length])

  const getDisplayData = (user: any) => {
    if (!user) return null
    if (user.fullName && !user.lastName && !user.firstName) {
      return {
        name: user.fullName,
        number: user.employeeNumber
      }
    }
    const lastName = user.lastName?.trim()
    const firstName = user.firstName?.trim()
    const nameParts = [lastName, firstName].filter(Boolean)

    const name = nameParts.length > 0 ? nameParts.join(", ") : (user.fullName || "Unnamed User")
    return {
      name,
      number: user.employeeNumber
    }
  }

  const displayData = getDisplayData(selected)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          <span className="truncate mr-2">
            {displayData
              ? `${displayData.name} (${displayData.number})`
              : "Select employee..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-12px)] md:w-[400px] p-0"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}> {/* Important: Manual filtering */}
          <CommandInput
            value={search}
            placeholder="Search name or ID..."
            onValueChange={setSearch}
          />
          <CommandList>
            {loading && records.length === 0 && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">Searching...</span>
              </div>
            )}
            <CommandEmpty>No employee found.</CommandEmpty>
            <CommandGroup>
              {records.map((rec) => {
                const recDisplay = getDisplayData(rec)
                return (
                  <CommandItem
                    key={rec.employeeNumber}
                    value={rec.employeeNumber}
                    onSelect={() => {
                      setSelected(rec)
                      onSelect({
                        id: rec.id,
                        fullName: recDisplay?.name || "",
                        employeeNumber: rec.employeeNumber
                      })
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selected?.employeeNumber === rec.employeeNumber ? "opacity-100" : "opacity-0")}
                    />
                    <div className="flex flex-col">
                      <span>{recDisplay?.name}</span>
                      <span className="text-xs text-muted-foreground">{recDisplay?.number}</span>
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {/* The Invisible Intersection Target */}
            <div ref={ref} className="h-4 w-full">
              {loading && records.length > 0 && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}