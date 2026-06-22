"use client"

import { useMemo, useState } from "react"
import * as XLSX from "xlsx"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MultiFilterSelect } from "@/components/multi-filter-select"
import { BaseFilterOption, FilterOptionsPayload } from "@/server-actions/common"
import FilterSelect from "@/components/filter-select"
import { getExportData, getExportDatav2, jobTransactionViewSelect, TransactionExportPayload } from "@/server-actions/export"
import { toast } from "sonner"
import { Undo2Icon } from "lucide-react"
import { Field, FieldError } from "@/components/ui/field"

export default function ExportFilterContainer({ options }: { options: FilterOptionsPayload }) {
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<{ [key: string]: any }>({
    company: "",
    projects: [],
    status: [],
    findings: [],
    categories: [],
    createdFrom: "",
    createdUntil: "",
  })

  const handleFieldChange = (name: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const filterValidation = useMemo(() => {
    const fromStr = filters.createdFrom
    const untilStr = filters.createdUntil

    const hasFrom = !!fromStr
    const hasUntil = !!untilStr

    const hasCompany = !!filters.company
    const hasStatus = filters.status?.length > 0
    const hasProjects = filters.projects?.length > 0
    const hasFindings = filters.findings?.length > 0
    const hasCategories = filters.categories?.length > 0
    const hasDates = hasFrom || hasUntil

    const isAnyFilterActive = hasCompany || hasStatus || hasProjects || hasFindings || hasCategories || hasDates

    if (!isAnyFilterActive) {
      return { isValid: false, error: "Please select at least one filter before exporting data." }
    }

    // If neither date has a value, it is completely valid (optional)
    if (!hasFrom && !hasUntil) {
      return { isValid: true, error: "" }
    }

    // If one has a value but the other is empty, they are invalid
    if (hasFrom && !hasUntil) {
      return { isValid: false, error: "Please provide and end date." }
    }
    if (!hasFrom && hasUntil) {
      return { isValid: false, error: "Please provide and start date." }
    }

    // Convert string inputs ("YYYY-MM-DD") safely to midnight dates for precise validation
    const fromDate = new Date(fromStr)
    const untilDate = new Date(untilStr)

    if (fromDate.getTime() > untilDate.getTime()) {
      return { isValid: false, error: "End date must be greater than or equal to the start date." }
    }

    return { isValid: true, error: "" }
  }, [filters])

  const handleResetDate = () => {
    setFilters({ ...filters, createdFrom: "", createdUntil: "" })
  }

  const handleExport = async () => {
    setLoading(true)
    // const { data, error } = await getExportData(filters)
    const { data, error } = await getExportDatav2(filters)

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
    

    const excelData = data.map((item: jobTransactionViewSelect) => ({
      "Series Id": item.jobTransactionID,
      "Audit Report No.": item.auditReportNumber,
      "Compliance Secretariat": item.complianceSecretariat,
      "Company": item.company,
      "Project / Department": item.project,
      "Audit Engagement": item.auditEngagement,
      "Type of Findings": item.typeOfFinding,
      "Findings Category": item.findingCategory,
      "Audit Rating": item.auditRating,
      "Details of Findings": item.problemFindings,
      "Responsible Person": item.responsiblePerson,
      "Responsible Department": item.responsibleDepartment,
      "Project Mngr. / Dept. Head": item.projectManagerDepartmentHead,
      "Date Issued": item.createdOn,
      "Target Close Out Date": item.targetDate,
      "Actual Close Date": item.closedOn,
      "Date Approved": item.approvedOn,
      "Actual Aging": item.jobStatus === 'open' ? item.agingDays : "",
      "Status": item.jobStatus,
      "Recurring Per Process": item.recurringPerProcess ? "yes" : "no",
      "Recurring Per Person": item.recurringPerPerson ? "yes" : "no",
      "Cancel Reason": item.cancelReason,
      "Issued To": item.recipient,
      "Corrective Action": item.correctiveAction,
      "Corrective Commitment Date": item.correctiveCommitmentDate,
      "Preventive Action": item.preventiveAction,
      "Preventive Commitment Date": item.preventiveCommitmentDate,
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

  const isButtonDisabled = loading || !filterValidation.isValid

  return (
    <div className="flex flex-col gap-6 p-6 w-2xl border rounded-2xl">
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
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Created Date Range</label>
          <Button variant="ghost" size="xs" onClick={handleResetDate}><Undo2Icon size="2" /></Button>
        </div>
        <div className="flex gap-2">
          <Input type="date" value={filters.createdFrom} onChange={(e) => setFilters({ ...filters, createdFrom: e.target.value })} />
          <Input type="date" value={filters.createdUntil} onChange={(e) => setFilters({ ...filters, createdUntil: e.target.value })} />
        </div>
      </div>

      {!filterValidation.isValid && filterValidation.error &&
        <Field>
          <FieldError>{filterValidation.error}</FieldError>
        </Field>
      }
      
      <Button onClick={handleExport} className="md:col-span-3 mt-4" disabled={isButtonDisabled}>
        {loading ? "Generating Excel..." : "Download Excel (.xlsx)"}
      </Button>
    </div>
  )
}