"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownAZ, ArrowDownZA, ArrowDown01, ArrowUpDown } from "lucide-react"
import TableCellViewer from "./table-cell-viewer"
import { Holiday } from "../../../../../generated/prisma/client"
import { formatLongDate, toTitleCase } from "@/lib/utils"

export const columns: ColumnDef<Holiday>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original as Holiday} />
    }
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-between">
          Date
          <Button
            variant="ghost"
            className="hover:bg-background"
            size="icon-sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown />
          </Button>
        </div>
      )
    },
    cell: ({ getValue }) => {
      const value = getValue<Date | string | undefined>()
      return formatLongDate(value)
    },
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
          {sorted === "asc" ? <ArrowDownAZ /> : sorted === "desc" ? <ArrowDownZA /> : <ArrowDown01 />}
        </Button>
      </div>
    },
    cell: ({ row }) => {
      return <Badge variant="outline"
        className={row.original.isActive === true ? "bg-green-50 text-green-500 border-green-500" : "bg-gray-50 text-gray-600 border-gray-600"} >
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    }
  },
]