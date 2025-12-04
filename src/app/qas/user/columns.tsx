"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, AArrowDown, AArrowUp  } from "lucide-react"
import User from "@/lib/user"
import TableCellViewerUser from "./table-cell-viewer"

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "empId",
    header: "Employee Id",
    cell: ({ row }) => {
      return <TableCellViewerUser item={row.original as User} />
    }
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "firstname",
    header: "Firstname",
  },
  {
    accessorKey: "lastname",
    header: "Lastname",
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <div className="flex items-center justify-between">
          Status
          <Button
            variant="ghost"
            className="hover:bg-background"
            size="icon-sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            { column.getIsSorted() === "asc" ? <AArrowDown /> : <AArrowUp /> }
          </Button>
        </div>
    },
    cell: ({ row }) => {
      return <Badge variant="outline" className={ row.original.status === "Active" ? "bg-green-50 text-green-500 border-green-500" : "bg-gray-50 text-gray-600 border-gray-600" } >{ row.original.status }</Badge>
    }
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
]