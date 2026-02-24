import { getTransactions } from "@/prisma-actions/transaction"
import { columns } from "./columns"
import { DataTable } from "@/components/data-table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { TransactionTableWrapper } from "./transaction-table-wrapper"

export default async function TransactionPage(props: { searchParams: Promise<{ page?: string; pageSize?: string }> }) {

  const searchParams = await props.searchParams

  const page = Number(searchParams.page) || 1
  const pageSize = Number(searchParams.pageSize) || 10

  const { data: transactions, totalCount, error } = await getTransactions(page, pageSize)

  const pageCount = Math.ceil((totalCount || 0) / pageSize)

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      {error ? (
        <div className="mt-6 mx-4" >
          <Alert variant="destructive" className="bg-red-50 border-destructive">
            <AlertCircle />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <>
          <TransactionTableWrapper
            columns={columns}
            data={transactions ?? []}
            totalCount={totalCount}
            pageCount={pageCount}
            pageIndex={page - 1}
            pageSize={pageSize}
          />
          {/* <DataTable
            columns={columns}
            data={transactions ?? []}
            totalCount={totalCount}
            pageCount={pageCount}
            pageIndex={page - 1}
            pageSize={pageSize}
          // getRowClassName={(row) => {
          //   if (row.jobStatus === "Closed" || row.jobStatus === "Cancelled") return "bg-accent"
          //   // if (row.status === "Open" && row.secondaryStatus === "New") return "bg-primary/20"
          //   return ""
          // }}
          /> */}
        </>
      )}
    </div>
  )
}