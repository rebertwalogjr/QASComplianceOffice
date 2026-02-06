"use client"

import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
// import Transaction from "@/lib/transaction";


export default function Default() {

  return (

    <div className="@container/main flex flex-1 flex-col gap-2">
      {/* <DataTable
        columns={columns}
        data={qData}
        getRowClassName={(row) => {
          if (row.status === "Closed" || row.status === "Cancelled") return "bg-accent"
          // if (row.status === "Open" && row.secondaryStatus === "New") return "bg-primary/20"
          return ""
        }}
      /> */}
    </div>
  )
}