import { notFound } from "next/navigation"
import PageHeader from "@/components/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import TemplateEditorPageHeaderContent from "./page-header-content"
import { getTemplateById } from "@/server-actions/template"
import { EmailTemplate } from "../../../../../../generated/prisma/client"
import TemplateFormContext from "./template-form-context"
import TemplateContent from "./template-content"

export default async function TemplateEditorPage({ params }: { params: Promise<{ id?: string[] }> }) {
  const resolvedParams = await params
  const slug = resolvedParams.id?.[0]
  const templateId = Number(slug)

  if (isNaN(templateId)) {
    notFound()
  }

  const { data, error } = await getTemplateById(templateId)

  return (

    <TemplateFormContext template={data as EmailTemplate}>
      <PageHeader>
        <TemplateEditorPageHeaderContent />
      </PageHeader>
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
        <div className="flex-1 min-h-0">
          <TemplateContent />
        </div>
      )}
    </TemplateFormContext>
  )
}