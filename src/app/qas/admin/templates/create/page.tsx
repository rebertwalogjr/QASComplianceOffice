import PageHeader from "@/components/page-header"
import TemplateEditorPageHeaderContent from "./page-header-content"
import TemplateFormContext from "./template-form-context"
import TemplateContent from "./template-content"

export default async function TemplateCreatorPage({ params }: { params: Promise<{ id?: string[] }> }) {
  return (
    <TemplateFormContext>
      <PageHeader>
        <TemplateEditorPageHeaderContent />
      </PageHeader>
      <div className="flex-1 min-h-0">
        <TemplateContent />
      </div>
    </TemplateFormContext>
  )
}