"use client"

import { useEffect, useRef, useState } from "react"
import { Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce" // See hook below
import { search, TransactionBasicPaylod } from "@/server-actions/transaction"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "../ui/input"

export function SeriesSearchField() {
  const [results, setResults] = useState<TransactionBasicPaylod[]>([])
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const debouncedQuery = useDebounce(query, 500)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  // Effect to handle the searching
  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      const data = await search(debouncedQuery)
      setResults(data.data || [])
      setIsLoading(false)

      if (debouncedQuery.length >= 2) {
        setIsOpen(true)
      }
    }

    fetchResults()
  }, [debouncedQuery])

  return (
    <div className="relative w-full max-w-sm" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search Series No. or Audit Finding No."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="pl-9 h-9"
        />
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Manual Dropdown - No Radix/Popover event hijacking */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          <div className="max-h-[300px] overflow-y-auto p-1">
            {results.length === 0 && !isLoading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No matches found for "{query}"
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setQuery("")
                      setIsOpen(false)
                      router.push(`/qas/${item.id}`)
                    }}
                    className="flex w-full flex-col rounded-sm px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground outline-none focus:bg-accent"
                  >
                    <span className="font-medium">{`Series No: ${item.id} – ${item.jobStatus}`}</span>
                    <span className="text-medium text-muted-foreground">
                      Finding No: {item.auditReport.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}