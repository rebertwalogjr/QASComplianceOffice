import { ChevronDown, Circle, Dot, FileText } from "lucide-react";
import { SeriesDescription, SeriesGroup, SeriesHeader, SeriesLabel, SeriesMedia, SeriesContainer, SeriesValue, SeriesItem } from "@/components/series-item";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import AttachmentViewer from "@/components/attachment-viewer";

const BadgeYesNo = (str: string) => {
  const val = str.toLowerCase()
  return <>
    <Badge className={`${val === "yes" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"} px-3`}>
      {str}
    </Badge>
  </>
}

export default function FormView() {

  return (

    <SeriesContainer>

      <SeriesGroup>
        <SeriesHeader>
          <SeriesMedia>
            <FileText />
          </SeriesMedia>
          Findings
        </SeriesHeader>

        <SeriesItem>
          <SeriesLabel>Auditor:</SeriesLabel>
          <SeriesValue>Juan Dela Cruz</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Company:</SeriesLabel>
          <SeriesValue>DMCI Project Developers, Inc.</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Project:</SeriesLabel>
          <SeriesValue>Construction</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Audit Report No.:</SeriesLabel>
          <SeriesValue>IAD-REPORT-2025-11</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Type of Findings:</SeriesLabel>
          <SeriesValue>Positive Observation</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Findings Category:</SeriesLabel>
          <SeriesValue>Operations</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Verified By:</SeriesLabel>
          <SeriesValue>Juan Dela Cruz</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Approved By:</SeriesLabel>
          <SeriesValue>Juan Dela Cruz</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Request for Closing:</SeriesLabel>
          <SeriesValue>{BadgeYesNo("Yes")}</SeriesValue>
        </SeriesItem>
      </SeriesGroup>

      <SeriesGroup>

        <SeriesHeader>
          <SeriesMedia>
            <FileText />
          </SeriesMedia>
          Audit Information
        </SeriesHeader>

        <SeriesItem>
          <SeriesLabel>Audit Engagement:</SeriesLabel>
          <SeriesValue>Site Warehousing Audit Cycle 3</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Audit Finding No.:</SeriesLabel>
          <SeriesValue>IAD-REPORT-2005-11-46</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Date & Time Issued:</SeriesLabel>
          <SeriesValue>11/14/2025 5:03:00 PM</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Target Date:</SeriesLabel>
          <SeriesValue>11/18/2025</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Audit Rating:</SeriesLabel>
          <SeriesValue>Adequate</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Project Manager / Dept. Head:</SeriesLabel>
          <SeriesValue>Juan Dela Cruz</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Responsible Person:</SeriesLabel>
          <SeriesValue>Juan Dela Cruz</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Responsible Department:</SeriesLabel>
          <SeriesValue>Juan Dela Cruz</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Recurring Per Process:</SeriesLabel>
          <SeriesValue>{BadgeYesNo("No")}</SeriesValue>
        </SeriesItem>

        <SeriesItem>
          <SeriesLabel>Recurring Per Person:</SeriesLabel>
          <SeriesValue>{BadgeYesNo("No")}</SeriesValue>
        </SeriesItem>

      </SeriesGroup>

      <SeriesGroup>

        <SeriesHeader>
          <SeriesMedia>
            <FileText />
          </SeriesMedia>
          Additional Details
        </SeriesHeader>

        <SeriesItem orientation="vertical" className="">
          <SeriesLabel>Details of Findings</SeriesLabel>
          <SeriesDescription>Criteria:</SeriesDescription>
          <Textarea className="bg-muted min-h-25" value="Some text here..." readOnly />
          <SeriesDescription>Findings:</SeriesDescription>
          <Textarea className="bg-muted min-h-25" value="Some text here..." readOnly />
        </SeriesItem>

        <SeriesItem orientation="vertical" className="">
          <SeriesLabel>Recommendations</SeriesLabel>
          <Textarea className="bg-muted min-h-25" value="Some text here..." readOnly />
        </SeriesItem>

        <SeriesItem orientation="vertical" className="">
          <SeriesLabel>Attachments</SeriesLabel>
          <AttachmentViewer />
        </SeriesItem>
      </SeriesGroup>

    </SeriesContainer>

  )
}