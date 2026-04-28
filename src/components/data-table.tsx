"use client"

import * as React from "react"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, SortingState, getSortedRowModel, ColumnFiltersState, getFilteredRowModel, PaginationState } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalCount: number
  pageCount: number
  pageIndex: number
  pageSize: number
  onPaginationChange: import("@tanstack/react-table").OnChangeFn<PaginationState>
  defaultPageSize?: number
  getRowClassName?: (row: TData) => string | undefined
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void  
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  pageCount,
  pageIndex,
  pageSize,
  onPaginationChange,
  defaultPageSize = 10,
  getRowClassName,
  searchPlaceholder,
  searchValue,
  onSearchChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [localSearch, setLocalSearch] = React.useState(searchValue);
  const isFirstRender = React.useRef(true)

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (localSearch === searchValue) return

    const timeout = setTimeout(() => {
      onSearchChange(localSearch);
    }, 500);
    return () => clearTimeout(timeout);
  }, [localSearch, onSearchChange, searchValue]);

  React.useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  const table = useReactTable({
    data: data ?? [],
    columns,
    pageCount: pageCount ?? 0,
    manualPagination: true,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },
    state: {
      pagination: {
        pageIndex,
        pageSize
      },
      sorting,
      columnFilters,
    },
  })

  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    table.setPageSize(newSize);
    document.cookie = `pageSize=${newSize}; path=/; max-age=31536000`;
  }

  return (
    <div className="justify-start mt-2">

      {/* FIXED TOP SECTION */}
      {/* <div className="px-6 z-40 w-full h-18 flex items-center">
        <div className="flex items-center w-100">
          <Input
            placeholder={searchPlaceholder ?? "Type to search..."}
            // value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            value={localSearch}
            onChange={(e) =>
              // table.getColumn("id")?.setFilterValue(e.target.value)
              // table.setGlobalFilter(e.target.value)
              setLocalSearch(e.target.value)
            }
            className="max-w-sm"
          />
        </div>
      </div> */}

      {/* TABLE */}
      <div className="overflow-auto rounded-md border  mx-6">
        <Table>

          <TableHeader className="bg-muted sticky top-0 z-20">
            {(table.getHeaderGroups() || []).map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    getRowClassName?.(row.original)
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                {/* <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell> */}
                <TableCell
                  colSpan={columns.length}
                  className="h-[400px] text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    {/* You can add an icon or image here */}
                    <p className="text-lg font-medium text-muted-foreground">
                      No records found.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or add a new record to get started.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-4 mb-6 pt-4">
        <div className="text-muted-foreground text-sm whitespace-nowrap">
          Total of {totalCount.toLocaleString()} records
        </div>
        {/* <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        <div className="flex items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
                handlePageSizeChange
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}