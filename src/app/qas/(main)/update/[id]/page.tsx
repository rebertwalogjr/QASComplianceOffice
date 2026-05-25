import { notFound } from "next/navigation"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

import { getActiveAuditReport } from "@/server-actions/audit-report"
import { getActiveCompanies } from "@/server-actions/company"
import { getActiveAuditEngagements } from "@/server-actions/engagement"
import { getActiveFindingCategories } from "@/server-actions/finding-category"
import { getActiveFindingTypes } from "@/server-actions/finding-type"
import { getActiveGroups } from "@/server-actions/group"
import { getActiveProjects } from "@/server-actions/project"
import { getActiveAuditRatings } from "@/server-actions/rating"
import { getActiveComplianceOfficers, getActiveRecipients, getActiveSupervisors } from "@/server-actions/user"

import { getSession } from "@/server-actions/get-session"
import { getTransactionById } from "@/server-actions/transaction"
import UpdateForm from "./update-form"

export default async function FindingsUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const slug = resolvedParams.id
  const transId = Number(slug)

  if (isNaN(transId)) {
    notFound()
  }


  const [initialData, companies, projects, engagements, findings, categories, groups, officers, supervisors, recipients, ratings, reports] = await Promise.all([
    getTransactionById(transId),
    getActiveCompanies(),
    getActiveProjects(),
    getActiveAuditEngagements(),
    getActiveFindingTypes(),
    getActiveFindingCategories(),
    getActiveGroups(),
    getActiveComplianceOfficers(),
    getActiveSupervisors(),
    getActiveRecipients(),
    getActiveAuditRatings(),
    getActiveAuditReport(),
  ]);

  const session = await getSession()

  const result = [initialData, companies, projects, engagements, findings, categories, groups, officers, supervisors, recipients, ratings, reports]
  const firstError = result.find(r => r.error)?.error

  return (
    <div className="@container/main  py-6">
      {firstError ? (
        <div className="mt-6 mx-4" >
          <Alert variant="destructive" className="bg-red-50 border-destructive">
            <AlertCircle />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              {firstError}
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <>
          <UpdateForm
            options={{
              initialData: initialData.data,
              companies: companies.data ?? [],
              projects: projects.data ?? [],
              engagements: engagements.data ?? [],
              findings: findings.data ?? [],
              categories: categories.data ?? [],
              groups: groups.data ?? [],
              officers: officers.data ?? [],
              supervisors: supervisors.data ?? [],
              recipients: recipients.data ?? [],
              ratings: ratings.data ?? [],
              reports: reports.data ?? [],
              session: session ?? null
            }}
          />
        </>
      )}
    </div>
  )
}