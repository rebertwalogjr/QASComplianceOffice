import { getTransactions } from "@/prisma-actions/transaction"
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"


export default async function Default() {

  const { data: transactions, error } = await getTransactions()

  return (

    <div className="@container/main flex flex-1 flex-col gap-2">
      <DataTable
        columns={columns}
        data={transactions}
        // getRowClassName={(row) => {
        //   if (row.jobStatus === "Closed" || row.jobStatus === "Cancelled") return "bg-accent"
        //   // if (row.status === "Open" && row.secondaryStatus === "New") return "bg-primary/20"
        //   return ""
        // }}
      />
    </div>
  )
}