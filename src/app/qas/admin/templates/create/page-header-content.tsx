"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { EmailTemplateFormValues } from "./template-form-context"
import { ArrowLeft, Loader2, SaveIcon } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export default function TemplateEditorPageHeaderContent() {
  const isMobile = useIsMobile()
  const router = useRouter()
  const { formState: { errors, isSubmitting } } = useFormContext<EmailTemplateFormValues>()

  const hasFieldErrors = Object.keys(errors).length > 0

  const isDisabled = isSubmitting || hasFieldErrors

  return (
    <div className="flex gap-2 justify-between items-center w-full">
      <Label className="text-md">Email Template Editor</Label>
      <div className="flex gap-2">
        <Button
          type="button"
          size={isMobile ? "icon-sm" : "sm"}
          variant="outline"
          className={!isMobile ? "w-32" : ""}
          onClick={() => router.push("/qas/admin/templates")}
          disabled={isSubmitting}
        >
          {isMobile ? <ArrowLeft /> : "Back"}
        </Button>
        <Button
          type="submit"
          size={isMobile ? "icon-sm" : "sm"}
          className={!isMobile ? "w-32" : ""}
          form="template-editor-form"
          disabled={isDisabled}
        >
          {isSubmitting ?
            (
              isMobile ?
                <Loader2 className="size-4 animate-spin mr-2" /> :
                <>
                  <Loader2 className="size-4 animate-spin mr-2" /> Saving ...
                </>
            ) :
            isMobile ? <SaveIcon /> : "Save"
          }
        </Button>
      </div>
    </div>
  )
}