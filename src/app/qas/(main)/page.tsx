"use client"

import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import qas_series from "@/dummy/qas-series";
import { useDataClient, useDataServer } from "@/hooks/get-list";
// import Transaction from "@/lib/transaction";


export default function Default() {
  const qData = useDataClient()

  // const qasSeries = () => {
  //   return qas_series.map((item: any) => ({
  //     id: item.JobTransactionId,
  //     auditNo: item.AuditFindingNumber,
  //     company: item.CompanyName,
  //     project: item.ProjectDepartmentName,
  //     resposiblePerson: item.ResponsiblePerson,
  //     status: item.Status,
  //     secondaryStatus: item.SecondaryStatus,
  //     engagement: item.EngagementName,
  //     rating: item.RatingName,
  //     category: item.CategoryName,
  //     details: item.ProblemDescription,
  //     approvedDate: item.ApprovedDate || "",
  //   }))
  // }

  return (

    <div className="@container/main flex flex-1 flex-col gap-2">
      <DataTable
        columns={columns}
        data={qData}
        getRowClassName={(row) => {
          if (row.status === "Closed" || row.status === "Cancelled") return "bg-accent"
          // if (row.status === "Open" && row.secondaryStatus === "New") return "bg-primary/20"
          return ""
        }}
      />
    </div>
  )
}