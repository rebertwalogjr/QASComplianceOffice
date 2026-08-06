"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { DataTable } from "@/components/data-table"
// import { search } from "@/server-actions/transaction"

export function TransactionTableWrapper({ data, totalCount, pageCount, pageIndex, pageSize, columns }: any) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set("search", value)
      params.set("page", "1")
    } else {
      params.delete("search")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

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
      searchValue={searchParams.get("search") ?? ""}
      onSearchChange={handleSearch}
    />
  )
}