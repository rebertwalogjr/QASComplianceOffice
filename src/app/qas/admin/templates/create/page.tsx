"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTemplate } from "@/server-actions/template"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function TemplateEditor(/*{ initialTemplate }*/) {
  const router = useRouter()
  // const [template, setTemplate] = useState(initialTemplate || {
  //   name: "",
  //   subject: "",
  //   content: "<html><body><h1>Hello World</h1></body></html>"
  // })

  const handleSave = async () => {
    // const result = await createTemplate(template)
    // if (!result.error) {
    //   toast.success("Created Succussfully", { position: "top-center" })
    //   router.push("/qas/admin/templates")
    // }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Edit Template</h2>

        <div>
          <Label>Template Name</Label>
          <Input
            // value={template.name}
            // onChange={(e) => setTemplate({ ...template, name: e.target.value })}
          />
        </div>

        <div>
          <Label>Email Subject</Label>
          <Input
            // value={template.subject}
            // onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
          />
        </div>

        <div>
          <Label>HTML Content</Label>
          <Textarea
            className="font-mono h-[500px]"
            // value={template.content}
            // onChange={(e) => setTemplate({ ...template, content: e.target.value })}
          />
        </div>

        <Button onClick={handleSave}>Save Template</Button>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Live Preview</h2>
        <div
          className="border rounded-md h-full bg-white overflow-auto p-4"
          // dangerouslySetInnerHTML={{ __html: template.content }}
        />
      </div>
    </div>
  )
}