import { getTransactions } from "@/server-actions/transaction"
import { columns } from "../columns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { TransactionTableWrapper } from "./transaction-table-wrapper"

export default async function TransactionList({ searchParamsPromise }: { searchParamsPromise: Promise<any> }) {
  const searchParams = await searchParamsPromise

  const page = Number(searchParams.page) || 1
  const pageSize = Number(searchParams.pageSize) || 10

  const { data: transactions, totalCount, error } = await getTransactions(page, pageSize, searchParams)
  const pageCount = Math.ceil((totalCount || 0) / pageSize)

  if (error) {
    return (
      <div className="mt-6 mx-4" >
        <Alert variant="destructive" className="bg-red-50 border-destructive">
          <AlertCircle />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <TransactionTableWrapper
      columns={columns}
      data={transactions ?? []}
      totalCount={totalCount}
      pageCount={pageCount}
      pageIndex={page - 1}
      pageSize={pageSize}
    />
  )
}