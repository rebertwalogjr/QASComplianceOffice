import { getFilterOptions } from "@/server-actions/common"
import ExportFilterContainer from "./filter-container"

export default async function ExportPage() {
  const filterOptions = await getFilterOptions()

  return (
    <div className="@container/main flex flex-col p-6 items-center">
      <ExportFilterContainer options={filterOptions} />
    </div>
  )
}