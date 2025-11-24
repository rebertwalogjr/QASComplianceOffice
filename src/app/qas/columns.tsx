import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CircleCheck, CircleX, Hand, Loader, ThumbsUp } from "lucide-react";
import { z } from "zod";
import TableCellViewer from "./table-cell-viewer";
import StatusBadge from "@/components/status-badge";

export type Transaction = {
  id: string,
  auditNo: string,
  company: string,
  project: string,
  resposiblePerson: string,
  status: "new" | "outstanding" | "cancelled" | "closed" | "for approval" | "closing approval",
  engagement: string,
  rating: string,
  category: string,
  details: string,
  approvedDate: string
}


export const columns: ColumnDef<Transaction>[] = [
  { accessorKey: "id", 
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Series No.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
      return <TableCellViewer item={row.original as Transaction} />;
    }
  },
  { accessorKey: "auditNo", header: "Audit Finding No."},
  { accessorKey: "status", 
    header: "Status",
    cell: ({row}) => (
      StatusBadge({ status: row.original.status })
    )
  },
  { accessorKey: "company", header: "Company" },
  { accessorKey: "project", header: "Project / Department" },
  // { accessorKey: "resposiblePerson", header: "Responsible Person" },
  // { accessorKey: "engagement", header: "Audit Engagement" },
  // { accessorKey: "rating", header: "Audit Rating" },
  // { accessorKey: "category", header: "Findings Category" },
  // { accessorKey: "details", header: "Details of Findings" },
  // { accessorKey: "approvedDate", header: "Date Approved" },
]