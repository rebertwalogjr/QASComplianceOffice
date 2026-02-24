"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DataTable } from "@/components/data-table"

export function TransactionTableWrapper({ data, totalCount, pageCount, pageIndex, pageSize, columns }: any) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePageSizeChange = (updater: any) => {
    const nextState = typeof updater === "function"
      ? updater({ pageIndex, pageSize })
      : updater

      const params = new URLSearchParams(searchParams.toString())
      params.set("page", (nextState.pageIndex + 1).toString())
      params.set("pageSize", nextState.pageSize.toString())

      router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      totalCount={totalCount}
      pageCount={pageCount}
      pageIndex={pageIndex}
      pageSize={pageSize}
      onPaginationChange={handlePageSizeChange}
    />
  )
}