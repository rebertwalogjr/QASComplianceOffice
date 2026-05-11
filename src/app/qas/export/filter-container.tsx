"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MultiFilterSelect } from "@/components/multi-filter-select"
import { BaseFilterOption, FilterOptionsPayload } from "@/server-actions/common"
import FilterSelect from "@/components/filter-select"
import { getExportData, TransactionExportPayload } from "@/server-actions/export"
import { toast } from "sonner"

export default function ExportFilterContainer({ options }: { options: FilterOptionsPayload }) {
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<{ [key: string]: any }>({
    company: "",
    projects: [],
    status: [],
    findings: [],
    categories: [],
  })

  const handleFieldChange = (name: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleExport = async () => {
    setLoading(true)
    const { data, error } = await getExportData(filters)

    if (error) {
      toast.error(error)
      setLoading(false)
      return
    }

    if (!data || data.length === 0) {
      toast.info("No records found for the selected filters.", { position: "bottom-center" })
      setLoading(false)
      return
    }

    const excelData = data.map((item: TransactionExportPayload) => ({
      "Series Id": item.id,
      "Status": item.jobStatus,
      "Company": item.company.name,
      "Project": item.project.name,
      "Type of finding": item.typeOfFinding.name,
      "Category": item.findingCategory.name
    }))

    const worksheet = XLSX.utils.json_to_sheet(excelData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "QAS Export")

    const maxWidths = Object.keys(excelData[0]).map(key => ({
      wch: Math.max(key.length, 15)
    }))
    worksheet["!cols"] = maxWidths

    XLSX.writeFile(workbook, `QAS_Export_${new Date().toISOString().split('T')[0]}.xlsx`)

    setLoading(false)
  }

  const statuses: BaseFilterOption[] = [
    { id: "open", name: "Open" },
    { id: "accepted", name: "Accepted" },
    { id: "for closing", name: "For Closing" },
    { id: "closed", name: "Closed" },
    { id: "on-hold", name: "On-Hold" },
    { id: "cancelled", name: "Cancelled" },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <MultiFilterSelect
        label="Status"
        name="status"
        options={statuses}
        selected={filters.status}
        onSelectedChange={(val: any) => setFilters({ ...filters, status: val })}
      />

      <FilterSelect
        label="Company"
        name="company"
        options={options.companies}
        selected={filters.company}
        onValueChange={(val) => handleFieldChange("company", val)}
      />

      <MultiFilterSelect
        label="Projects"
        name="projects"
        options={options.projects}
        selected={filters.projects}
        selectedCompanyId={filters.company}
        onSelectedChange={(val: any) => setFilters({ ...filters, projects: val })}
      />

      <MultiFilterSelect
        label="Finding Types"
        name="findings"
        options={options.findings}
        selected={filters.findings}
        onSelectedChange={(val: any) => setFilters({ ...filters, findings: val })}
      />

      <MultiFilterSelect
        label="Finding Categories"
        name="categories"
        options={options.categories}
        selected={filters.categories}
        onSelectedChange={(val: any) => setFilters({ ...filters, categories: val })}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Created Date Range</label>
        <div className="flex gap-2">
          <Input type="date" onChange={(e) => setFilters({ ...filters, createdFrom: e.target.value })} />
          <Input type="date" onChange={(e) => setFilters({ ...filters, createdUntil: e.target.value })} />
        </div>
      </div>

      <Button onClick={handleExport} className="md:col-span-3 mt-4" disabled={loading}>
        {loading ? "Generating Excel..." : "Download Excel (.xlsx)"}
      </Button>
    </div>
  )
}