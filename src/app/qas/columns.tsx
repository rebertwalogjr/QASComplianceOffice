import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, CircleCheck, CircleX, FilterIcon, FilterX, Hand, Loader, ThumbsUp } from "lucide-react";
import { z } from "zod";
import TableCellViewer from "./table-cell-viewer";
import StatusBadge from "@/components/status-badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import PopoverStatusFilter from "./popover-status-filter";
import { Transaction } from "@/lib/transaction";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-between">
          Series No.
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
    cell: ({ row }) => {
      return <TableCellViewer item={row.original as Transaction} className={row.original.status === "Closed" ? "opacity-50" : ""} />;
    }
  },
  {
    accessorKey: "auditNo",
    header: "Audit Finding No.",
    // cell: ({row}) => {
    //   return <div className={row.original.status === "Closed" ? "opacity-50" : ""}>{row.original.auditNo}</div>
    // }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-between">
          Status
          <PopoverStatusFilter column={column} />
        </div>
      )
    },
    cell: ({ row }) => {
      let main = row.original.status
      let secondary = row.original.secondaryStatus
      if (main === "Open") {
        if (secondary === "New") {
          return StatusBadge({ status: secondary })
        }
        if (secondary === "On-Hold") {
          return StatusBadge({ status: secondary })
        }
        return StatusBadge({ status: main })
      }
      return StatusBadge({ status: main })
    }
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "project",
    header: "Project / Department",
  },
  // { accessorKey: "resposiblePerson", header: "Responsible Person" },
  // { accessorKey: "engagement", header: "Audit Engagement" },
  // { accessorKey: "rating", header: "Audit Rating" },
  // { accessorKey: "category", header: "Findings Category" },
  // { accessorKey: "details", header: "Details of Findings" },
  // { accessorKey: "approvedDate", header: "Date Approved" },
]