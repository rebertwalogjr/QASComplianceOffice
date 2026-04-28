"use client"

import * as React from "react"
import { Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDebounce } from "@/hooks/use-debounce" // See hook below
import { search, TransactionBasicPaylod } from "@/server-actions/transaction"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

export function SeriesSearchField() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<TransactionBasicPaylod[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  
  const debouncedQuery = useDebounce(query, 500)
  const router = useRouter()

  // Effect to handle the searching
  React.useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length < 2) {
        setResults([])
        return
      }

      setIsLoading(true)
      const data = await search(debouncedQuery)
      setResults(data.data || [])
      setIsLoading(false)
    }

    fetchResults()
  }, [debouncedQuery])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[300px] justify-start text-muted-foreground font-normal">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          Search series...
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <Command shouldFilter={false}> {/* Disable internal filtering since we filter on server */}
          <CommandInput 
            placeholder="Type ID or title..." 
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
            
            {!isLoading && query.length > 0 && results.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}

            {!isLoading && query.length === 0 && (
              <div className="p-4 text-xs text-center text-muted-foreground">
                Start typing to search (min. 2 characters)
              </div>
            )}

            <CommandGroup>
              {results.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => {
                    setOpen(false)
                    router.push(`/qas/${item.id}`)
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{item.id}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      ID: {item.id}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}