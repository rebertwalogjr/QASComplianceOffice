import { ChevronDown, Circle, Dot, FileText } from "lucide-react";
import { SeriesDescription, SeriesGroup, SeriesHeader, SeriesLabel, SeriesMedia, SeriesContainer, SeriesTitle, SeriesValue } from "@/components/series-item";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import AttachmentViewer from "@/components/attachment-viewer";

const BadgeYesNo = (str: string) => {
  const val = str.toLowerCase()
  return <>
    <Badge className={`${ val === "yes" ? "bg-blue-500 text-white" : "bg-gray-500 text-white" } px-3`}>
      { str }
    </Badge>
  </>
}

export default function FormView() {

  return (

    <SeriesContainer>

      <SeriesHeader>
        <SeriesMedia>
          <FileText />
        </SeriesMedia>
        <SeriesTitle>Findings</SeriesTitle>
      </SeriesHeader>

      <SeriesGroup>
        <SeriesLabel>Auditor:</SeriesLabel>
        <SeriesValue>Juan Dela Cruz</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Company:</SeriesLabel>
        <SeriesValue>DMCI Project Developers, Inc.</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Project:</SeriesLabel>
        <SeriesValue>Construction</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Audit Report No.:</SeriesLabel>
        <SeriesValue>IAD-REPORT-2025-11</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Type of Findings:</SeriesLabel>
        <SeriesValue>Positive Observation</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Findings Category:</SeriesLabel>
        <SeriesValue>Operations</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Verified By:</SeriesLabel>
        <SeriesValue>Juan Dela Cruz</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Approved By:</SeriesLabel>
        <SeriesValue>Juan Dela Cruz</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Request for Closing:</SeriesLabel>
        <SeriesValue>{ BadgeYesNo("Yes") }</SeriesValue>
      </SeriesGroup>

      <SeriesHeader>
        <SeriesMedia>
          <FileText />
        </SeriesMedia>
        <SeriesTitle>Audit Information</SeriesTitle>
      </SeriesHeader>

      <SeriesGroup>
        <SeriesLabel>Audit Engagement:</SeriesLabel>
        <SeriesValue>Site Warehousing Audit Cycle 3</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Audit Finding No.:</SeriesLabel>
        <SeriesValue>IAD-REPORT-2005-11-46</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Date & Time Issued:</SeriesLabel>
        <SeriesValue>11/14/2025 5:03:00 PM</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Target Date:</SeriesLabel>
        <SeriesValue>11/18/2025</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Audit Rating:</SeriesLabel>
        <SeriesValue>Adequate</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Project Manager / Dept. Head:</SeriesLabel>
        <SeriesValue>Juan Dela Cruz</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Responsible Person:</SeriesLabel>
        <SeriesValue>Juan Dela Cruz</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Responsible Department:</SeriesLabel>
        <SeriesValue>Juan Dela Cruz</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Recurring Per Process:</SeriesLabel>
        <SeriesValue>{ BadgeYesNo("No") }</SeriesValue>
      </SeriesGroup>

      <SeriesGroup>
        <SeriesLabel>Recurring Per Person:</SeriesLabel>
        <SeriesValue>{ BadgeYesNo("No") }</SeriesValue>
      </SeriesGroup>

      <SeriesHeader>
        <SeriesMedia>
          <FileText />
        </SeriesMedia>
        <SeriesTitle>Additional Details</SeriesTitle>
      </SeriesHeader>

      <SeriesGroup orientation="vertical" className="">
        <SeriesLabel>Details of Findings</SeriesLabel>
        <SeriesDescription>Criteria:</SeriesDescription>
        <Textarea className="bg-muted min-h-25" value="Some text here..." readOnly />
        <SeriesDescription>Findings:</SeriesDescription>
        <Textarea className="bg-muted min-h-25" value="Some text here..." readOnly />
      </SeriesGroup>

      <SeriesGroup orientation="vertical" className="">
        <SeriesLabel>Recommendations</SeriesLabel>
        <Textarea className="bg-muted min-h-25" value="Some text here..." readOnly />
      </SeriesGroup>

      <SeriesGroup orientation="vertical" className="">
        <SeriesLabel>Attachments</SeriesLabel>
        
        <AttachmentViewer />

      </SeriesGroup>

    </SeriesContainer>

  )
}