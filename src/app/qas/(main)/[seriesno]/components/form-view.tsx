import { File, Group, LucideBadgeInfo, MegaphoneIcon, TextSelection } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import AttachmentViewer from "@/components/series/attachments-viewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TransactionPayload } from "@/server-actions/transaction";
import { UserHoverCard } from "@/components/user-hover-card";
import { formatLongDate } from "@/lib/utils";

const BadgeYesNo = (str: string) => {
  const val = str.toLowerCase()
  return <>
    <Badge className={`${val === "yes" ? "bg-primary/80 text-white" : "bg-gray-500/80 text-white"} px-3`}>
      {str}
    </Badge>
  </>
}

export default function FormView({ data }: { data: TransactionPayload | null }) {
  return (
    <div className="flex flex-col gap-4 md:px-12">

      <Card className="shadow-none animate-in fade-in slide-in-from-top-2 duration-500 hover:border-dashed hover:border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-primary/10 text-primary border-primary">
              <File size={16} />
            </div>
            Findings
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Compliance Secretariat</Label>
            <UserHoverCard data={data?.complianceSecretariat.appSuiteEmployeeMaster} />
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Company</Label>
            <Label className="col-span-2">{data?.company.name}</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Project</Label>
            <Label className="col-span-2">{data?.project.name}</Label>
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
            <Label className="col-span-2">{data?.typeOfFinding.name}</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Findings Category</Label>
            <Label className="col-span-2">{data?.findingCategory.name}</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Supervisor</Label>
            <UserHoverCard data={data?.supervisor?.appSuiteEmployeeMaster} />
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Compliance Officer</Label>
            <UserHoverCard data={data?.complianceOfficer?.appSuiteEmployeeMaster} />
          </div>
        </CardContent>
        {data?.verifiedOn && (
          <CardContent className="">
            <div className="grid md:grid-cols-3 gap-2 items-start">
              <Label className="text-muted-foreground">Verified By</Label>
              {data?.verifier
                ? (
                  <div className="flex gap-2">
                    <UserHoverCard data={data?.verifier?.appSuiteEmployeeMaster} />
                    <Label className="text-muted-foreground text-xs whitespace-nowrap"> — { formatLongDate(data?.verifiedOn) }</Label>
                  </div>
                ) : <Label>--</Label>
              }
            </div>
          </CardContent>
        )}
        {data?.approvedOn && (
          <CardContent className="">
            <div className="grid md:grid-cols-3 gap-2 items-start">
              <Label className="text-muted-foreground">Approved By</Label>
              {data?.approver
                ? (
                  <div className="flex gap-2">
                    <UserHoverCard data={data?.approver?.appSuiteEmployeeMaster} />
                    <Label className="text-muted-foreground text-xs whitespace-nowrap"> — { formatLongDate(data?.approvedOn) }</Label>
                  </div>
                )
                : <Label>--</Label>}
            </div>
          </CardContent>
        )}
        {data?.closedOn && (
          <CardContent className="">
            <div className="grid md:grid-cols-3 gap-2 items-start">
              <Label className="text-muted-foreground">Closed By</Label>
              {data?.approver
                ? (
                  <div className="flex gap-2">
                    <UserHoverCard data={data?.supervisor?.appSuiteEmployeeMaster} />
                    <Label className="text-muted-foreground text-xs whitespace-nowrap"> — { formatLongDate(data?.closedOn) }</Label>
                  </div>
                )
                : <Label>--</Label>}
            </div>
          </CardContent>
        )}

      </Card>

      <Card className="shadow-none animate-in fade-in slide-in-from-top-2 duration-500 hover:border-dashed hover:border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-cyan-500/10 text-cyan-500 border-cyan-500">
              <TextSelection size={16} />
            </div>
            Audit Information
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Audit Engagement</Label>
            <Label className="col-span-2">{data?.auditEngagement.name}</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Audit Report No.</Label>
            <Label className="col-span-2">{data?.auditReport.name}</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Audit Finding No.</Label>
            <Label className="col-span-2">{data?.auditFindingNumber ?? "--"}</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Audit Rating</Label>
            <Label className="col-span-2">{data?.auditRating.name}</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Date & Time Issued</Label>
            <Label className="col-span-2">{data?.issuedOn?.toDateString() ?? "--"}</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Target Date</Label>
            <Label className="col-span-2">{data?.targetDate?.toDateString() ?? "--"}</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none animate-in fade-in slide-in-from-top-2 duration-500 hover:border-dashed hover:border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-orange-500/10 text-orange-500 border-orange-500">
              <MegaphoneIcon size={16} />
            </div>
            Recipient & Escalation
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Recipient Group</Label>
            <Label className="col-span-2">{data?.group?.name}</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Issued To</Label>
            <UserHoverCard data={data?.recipient?.appSuiteEmployeeMaster} />
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">First Escalation</Label>
            {data?.recipient?.escalation1User ? <UserHoverCard data={data?.jobEscalation1User?.appSuiteEmployeeMaster} /> : <Label>--</Label>}
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Second Escalation</Label>
            {data?.recipient?.escalation2User ? <UserHoverCard data={data?.jobEscalation2User?.appSuiteEmployeeMaster} /> : <Label>--</Label>}
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Third Escalation</Label>
            {data?.recipient?.escalation3User ? <UserHoverCard data={data?.jobEscalation3User?.appSuiteEmployeeMaster} /> : <Label>--</Label>}
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Fouth Escalation</Label>
            {data?.recipient?.escalation4User ? <UserHoverCard data={data?.jobEscalation4User?.appSuiteEmployeeMaster} /> : <Label>--</Label>}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none animate-in fade-in slide-in-from-top-2 duration-500 hover:border-dashed hover:border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-yellow-500/10 text-yellow-500 border-yellow-500">
              <Group size={16} />
            </div>
            Responsible Person
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Project Manager / Department Head</Label>
            <Label className="col-span-2">{data?.projectManagerDepartmentHead ?? "--"}</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Responsible Person</Label>
            <Label className="col-span-2">{data?.responsiblePerson ?? "--"}</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Responsible Department</Label>
            <Label className="col-span-2">{data?.responsibleDepartment ?? "--"}</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Recurring Per Process</Label>
            <Label className="col-span-2">{BadgeYesNo(data?.recurringPerPerson ? "Yes" : "No")}</Label>
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid md:grid-cols-3 gap-2 items-start">
            <Label className="text-muted-foreground">Recurring Per Person</Label>
            <Label className="col-span-2">{BadgeYesNo(data?.recurringPerPerson ? "Yes" : "No")}</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none animate-in fade-in slide-in-from-top-2 duration-500 hover:border-dashed hover:border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-md border p-2 bg-green-500/10 text-green-500 border-green-500">
              <LucideBadgeInfo size={16} />
            </div>
            Additional Details
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="grid gap-2 items-start">
            <Label className="text-muted-foreground">Criteria</Label>
            <Textarea className="bg-muted resize-none min-h-24" value={data?.problemCriteria ?? ""} readOnly />
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid gap-2 items-start">
            <Label className="text-muted-foreground">Findings</Label>
            <Textarea className="bg-muted resize-none min-h-24" value={data?.problemFindings ?? ""} readOnly />
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid gap-2 items-start">
            <Label className="text-muted-foreground">Recommendations</Label>
            <Textarea className="bg-muted resize-none min-h-24" value={data?.recommendations ?? ""} readOnly />
          </div>
        </CardContent>
        <CardContent className="">
          <div className="grid gap-2 items-start">
            <Label className="text-muted-foreground">Attachments</Label>
            <AttachmentViewer
              jobTransactionId={data?.id ?? 0}
              attachments={data?.attachments ? data.attachments.filter(e => !e.fromRecipient && e.isActive) : []}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}