import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

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
    }
  },
  { accessorKey: "auditNo", header: "Audit Finding No."},
  { accessorKey: "company", header: "Company" },
  { accessorKey: "project", header: "Project / Department" },
  { accessorKey: "resposiblePerson", header: "Responsible Person" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "engagement", header: "Audit Engagement" },
  { accessorKey: "rating", header: "Audit Rating" },
  { accessorKey: "category", header: "Findings Category" },
  { accessorKey: "details", header: "Details of Findings" },
  { accessorKey: "approvedDate", header: "Date Approved" },
]