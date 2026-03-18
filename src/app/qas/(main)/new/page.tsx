import { getActiveComplianceOfficers, getActiveRecipients, getActiveSupervisors } from "@/server-actions/user";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { getActiveProjects } from "@/server-actions/project";
import { getActiveCompanies } from "@/server-actions/company";
import { getActiveAuditEngagements } from "@/server-actions/engagement";
import { getActiveFindingTypes } from "@/server-actions/finding-type";
import { getActiveFindingCategories } from "@/server-actions/finding-category";
import { getActiveGroups } from "@/server-actions/group";
import { getActiveAuditRatings } from "@/server-actions/rating";
import { getActiveAuditReport } from "@/server-actions/audit-report";

import EntryForm from "./entry-form";
import { getSession } from "@/server-actions/get-session";

export default async function NewQASForm() {

  const [companies, projects, engagements, findings, categories, groups, officers, supervisors, recipients, ratings, reports] = await Promise.all([
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

  const result = [companies, projects, engagements, findings, categories, groups, officers, supervisors, recipients, ratings]
  const firstError = result.find(r => r.error)?.error

  return (
    <div className="@container/main py-6">
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
          <EntryForm
            options={{
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
              session: session
            }}
          />
        </>
      )}
    </div>
  )
}