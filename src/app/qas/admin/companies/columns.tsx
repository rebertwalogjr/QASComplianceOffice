"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownAZ, ArrowDownZA, ArrowDown01  } from "lucide-react"
import TableCellViewer from "./table-cell-viewer"
import Company from "@/lib/company"

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original as Company} />
    }
  },
  {
    accessorKey: "code",
    header: "Code"
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return <div className="flex items-center justify-between">
          Status
          <Button
            variant="ghost"
            className="hover:bg-background"
            size="icon-sm"
            onClick={() => {
              sorted === "asc" 
              ? column.toggleSorting(true)
              : sorted === "desc" 
              ? column.clearSorting()
              : column.toggleSorting(false)
            }}
            aria-label={sorted === "asc" ? "Sorted status descending" : "Sort status ascending"}
          >
            { sorted === "asc" ? <ArrowDownAZ /> : sorted === "desc" ? <ArrowDownZA /> : <ArrowDown01 /> }
          </Button>
        </div>
    },
    cell: ({ row }) => {
      return <Badge variant="outline" className={ row.original.status === "Active" ? "bg-green-50 text-green-500 border-green-500" : "bg-gray-50 text-gray-600 border-gray-600" } >{ row.original.status }</Badge>
    }
  },
]