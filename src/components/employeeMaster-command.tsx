"use client";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEmployees } from "@/server-actions/appsuite";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function EmployeeCommand({ onSelect }: { onSelect: (emp: any) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView();
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  // Initial and Search fetch
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      const res = await getEmployees(debouncedSearch, 0);
      setEmployees(res.data || []);
      setHasMore((res.data || []).length === 20);
      setLoading(false);
    };
    fetchInitial();
  }, [debouncedSearch]);

  // Load more when scrolling
  useEffect(() => {
    if (inView && hasMore && !loading) {
      const loadMore = async () => {
        setLoading(true);
        const res = await getEmployees(search, employees.length);
        const newData = res.data || [];
        setEmployees((prev) => [...prev, ...newData]);
        setHasMore(newData.length === 20);
        setLoading(false);
      };
      loadMore();
    }
  }, [inView, hasMore, loading, debouncedSearch, employees.length]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate mr-2">
            {selectedEmp
              ? `${selectedEmp.fullName} (${selectedEmp.employeeNumber})`
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
        <Command shouldFilter={false} className="w-full"> {/* Important: Manual filtering */}
          <CommandInput
            value={search}
            placeholder="Search name or ID..."
            onValueChange={setSearch}
          />
          <CommandList>
            {loading && employees.length === 0 && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">Searching...</span>
              </div>
            )}
            <CommandEmpty>No employee found.</CommandEmpty>
            <CommandGroup>
              {employees.map((emp) => (
                <CommandItem
                  key={emp.employeeNumber}
                  value={emp.employeeNumber}
                  onSelect={() => {
                    setSelectedEmp(emp)
                    onSelect(emp)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedEmp?.employeeNumber === emp.employeeNumber ? "opacity-100" : "opacity-0")}
                  />
                  <div className="flex flex-col">
                    <span>{emp.fullName}</span>
                    <span className="text-xs text-muted-foreground">{emp.employeeNumber}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {/* The Invisible Intersection Target */}
            <div ref={ref} className="h-4 w-full">
              {loading && employees.length > 0 && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}