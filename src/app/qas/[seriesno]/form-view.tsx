import { ChevronDown, Circle, Dot, File, FileText, LucideBadgeInfo, TextSelection } from "lucide-react";
import { SeriesDescription, SeriesGroup, SeriesHeader, SeriesLabel, SeriesMedia, SeriesContainer, SeriesValue, SeriesItem } from "@/components/series-item";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import AttachmentViewer from "@/components/attachment-viewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const BadgeYesNo = (str: string) => {
  const val = str.toLowerCase()
  return <>
    <Badge className={`${val === "yes" ? "bg-primary text-white" : "bg-gray-500 text-white"} px-3`}>
      {str}
    </Badge>
  </>
}

export default function FormView() {

  const lorem = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis sapiente ut ea commodi cum nam consequatur, dignissimos earum omnis quas, placeat odio necessitatibus rem ipsum voluptas odit quasi dolorum? Earum?"

  return (
    <div className="flex flex-col gap-4 md:px-12">

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-primary/10 text-primary border-primary">
              <File size={16}/>
            </div>
            Findings
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Auditor</Label>
            <Label className="col-span-2">Juan Dela Cruz</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Company</Label>
            <Label className="col-span-2">DMCI Homes Project Developers, Inc.</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Project</Label>
            <Label className="col-span-2">Construction</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Audit Report No.</Label>
            <Label className="col-span-2">IAD-REPORT-2025-11</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Type of Findings</Label>
            <Label className="col-span-2">Positive Observation</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Findings Category</Label>
            <Label className="col-span-2">Operations</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Verified By</Label>
            <Label className="col-span-2">Juan Dela Cruz</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Approved By</Label>
            <Label className="col-span-2">Juan Dela Cruz</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Request for Closing</Label>
            <Label className="col-span-2">{BadgeYesNo("Yes")}</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-cyan-500/10 text-cyan-500 border-cyan-500">
              <TextSelection size={16}/>
            </div>
            Audit Information
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Audit Engagement</Label>
            <Label className="col-span-2">Site Warehousing Audit Cycle 3</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Audit Finding No.</Label>
            <Label className="col-span-2">IAD-REPORT-2005-11-46</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Date & Time Issued</Label>
            <Label className="col-span-2">11/14/2025 5:03:00 PM</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Target Date</Label>
            <Label className="col-span-2">11/18/2025</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Audit Rating</Label>
            <Label className="col-span-2">Adequate</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Project Manager / Dept. Head</Label>
            <Label className="col-span-2">Juan Dela Cruz</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Responsible Person</Label>
            <Label className="col-span-2">Juan Dela Cruz</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Responsible Department</Label>
            <Label className="col-span-2">Information Technology</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Recurring Per Process</Label>
            <Label className="col-span-2">{BadgeYesNo("No")}</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Recurring Per Person</Label>
            <Label className="col-span-2">{BadgeYesNo("No")}</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-green-500/10 text-green-500 border-green-500">
              <LucideBadgeInfo size={16}/>
            </div>
            Additional Details
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="grid gap-2 items-start">
            <Label className="text-muted-foreground">Criteria</Label>
            <Textarea className="bg-muted resize-none min-h-24" value={lorem} readOnly />
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid gap-2 items-start">
            <Label className="text-muted-foreground">Findings</Label>
            <Textarea className="bg-muted resize-none min-h-24" value={lorem} readOnly />
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid gap-2 items-start">
            <Label className="text-muted-foreground">Recommendations</Label>
            <Textarea className="bg-muted resize-none min-h-24" value={lorem} readOnly />
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid gap-2 items-start">
            <Label className="text-muted-foreground">Attachments</Label>
            <AttachmentViewer />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}