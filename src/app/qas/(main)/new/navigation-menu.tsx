"use client"

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { set } from "zod";


export default function NavigationMenu({ onSectionChange }: { onSectionChange?: (section: string) => void }) {
  const [activeSection, setActiveSection] = useState("findings")

  const hadleSectionChange = (section: string) => {
    setActiveSection(section)
    onSectionChange?.(section)
  }

  return (
    <RadioGroup className="flex flex-col gap-4" value={activeSection} onValueChange={hadleSectionChange}>
      <div className={`flex items-center px-4 py-2 gap-3 border-2 ${activeSection === 'findings' ? 'border-gray-200 bg-muted rounded-sm' : 'border-transparent'}`}>
        <RadioGroupItem value="findings" className="sr-only" id="findings" />
        <Label htmlFor="findings" className="cursor-pointer">
          Findings
        </Label>
      </div>
      <div className={`flex items-center px-4 py-2 gap-3 border-2 ${activeSection === 'auditinfo' ? 'border-gray-200 bg-muted rounded-sm' : 'border-transparent'}`}>
        <RadioGroupItem value="auditinfo" className="sr-only" id="auditinfo" />
        <Label htmlFor="auditinfo" className="cursor-pointer">
          Audit Info.
        </Label>
      </div>
      <div className={`flex items-center px-4 py-2 gap-3 border-2 ${activeSection === 'additionaldetails' ? 'border-gray-200 bg-muted rounded-sm' : 'border-transparent'}`}>
        <RadioGroupItem value="additionaldetails" className="sr-only" id="additionaldetails" />
        <Label htmlFor="additionaldetails" className="cursor-pointer">
          Additional Details
        </Label>
      </div>
      <div className={`flex items-center px-4 py-2 gap-3 border-2 ${activeSection === 'responsibleperson' ? 'border-gray-200 bg-muted rounded-sm' : 'border-transparent'}`}>
        <RadioGroupItem value="responsibleperson" className="sr-only" id="responsibleperson" />
        <Label htmlFor="responsibleperson" className="cursor-pointer">
          Responsible Person
        </Label>
      </div>
      <div className={`flex items-center px-4 py-2 gap-3 border-2 ${activeSection === 'escalations' ? 'border-gray-200 bg-muted rounded-sm' : 'border-transparent'}`}>
        <RadioGroupItem value="escalations" className="sr-only" id="escalations" />
        <Label htmlFor="escalations" className="cursor-pointer">
          Escalations
        </Label>
      </div>
    </RadioGroup>
  )
}