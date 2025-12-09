import Group from "@/lib/group";

const groups: Group[] = [
  
{
    id: "1001",
    groupCode: "ITDGROUP",
    groupName: "Information Technology Group",
    groupInCharge: "ITGroup",
    groupInChargeEmail: "itgroup@dmcihomes.com",
    status: "Active",
    remarks: "Handles all IT-related operations"
  },
  {
    id: "1002",
    groupCode: "HRGROUP",
    groupName: "Human Resources Group",
    groupInCharge: "HRTeam",
    groupInChargeEmail: "hrteam@dmcihomes.com",
    status: "Active",
    remarks: "Responsible for employee management"
  },
  {
    id: "1003",
    groupCode: "FINGROUP",
    groupName: "Finance Group",
    groupInCharge: "FinanceDept",
    groupInChargeEmail: "finance@dmcihomes.com",
    status: "Inactive",
    remarks: "Currently under restructuring"
  },
  {
    id: "1004",
    groupCode: "ENGGROUP",
    groupName: "Engineering Group",
    groupInCharge: "EngTeam",
    groupInChargeEmail: "engineering@dmcihomes.com",
    status: "Active",
    remarks: "Oversees construction and design"
  },
  {
    id: "1005",
    groupCode: "MKTGROUP",
    groupName: "Marketing Group",
    groupInCharge: "MarketingTeam",
    groupInChargeEmail: "marketing@dmcihomes.com",
    status: "Active",
    remarks: "Handles promotions and campaigns"
  },
  {
    id: "1006",
    groupCode: "PRGROUP",
    groupName: "Public Relations Group",
    groupInCharge: "PRTeam",
    groupInChargeEmail: "prteam@dmcihomes.com",
    status: "Active",
    remarks: "Manages company image and media"
  },
  {
    id: "1007",
    groupCode: "LEGALGROUP",
    groupName: "Legal Group",
    groupInCharge: "LegalDept",
    groupInChargeEmail: "legal@dmcihomes.com",
    status: "Inactive",
    remarks: "Handles legal compliance"
  },
  {
    id: "1008",
    groupCode: "OPS",
    groupName: "Operations Group",
    groupInCharge: "OpsTeam",
    groupInChargeEmail: "operations@dmcihomes.com",
    status: "Active",
    remarks: "Coordinates daily operations"
  },
  {
    id: "1009",
    groupCode: "QA",
    groupName: "Quality Assurance Group",
    groupInCharge: "QATeam",
    groupInChargeEmail: "qa@dmcihomes.com",
    status: "Active",
    remarks: "Ensures product quality"
  },
  {
    id: "1010",
    groupCode: "RND",
    groupName: "Research and Development Group",
    groupInCharge: "RnDTeam",
    groupInChargeEmail: "rnd@dmcihomes.com",
    status: "Inactive",
    remarks: "Focuses on innovation"
  },
  {
    id: "1011",
    groupCode: "SALES",
    groupName: "Sales Group",
    groupInCharge: "SalesTeam",
    groupInChargeEmail: "sales@dmcihomes.com",
    status: "Active",
    remarks: "Handles client acquisition"
  },
  {
    id: "1012",
    groupCode: "SUPPLY",
    groupName: "Supply Chain Group",
    groupInCharge: "SupplyTeam",
    groupInChargeEmail: "supply@dmcihomes.com",
    status: "Active",
    remarks: "Manages procurement and logistics"
  },
  {
    id: "1013",
    groupCode: "CSR",
    groupName: "Customer Service Group",
    groupInCharge: "CSRTeam",
    groupInChargeEmail: "csr@dmcihomes.com",
    status: "Active",
    remarks: "Handles customer inquiries"
  },
  {
    id: "1014",
    groupCode: "TRAINING",
    groupName: "Training Group",
    groupInCharge: "TrainingDept",
    groupInChargeEmail: "training@dmcihomes.com",
    status: "Inactive",
    remarks: "Provides employee training"
  },
  {
    id: "1015",
    groupCode: "SECURITY",
    groupName: "Security Group",
    groupInCharge: "SecurityTeam",
    groupInChargeEmail: "security@dmcihomes.com",
    status: "Active",
    remarks: "Ensures safety and security"
  },
  {
    id: "1016",
    groupCode: "FACILITY",
    groupName: "Facilities Management Group",
    groupInCharge: "FacilityTeam",
    groupInChargeEmail: "facility@dmcihomes.com",
    status: "Active",
    remarks: "Maintains company facilities"
  },
  {
    id: "1017",
    groupCode: "ENV",
    groupName: "Environmental Group",
    groupInCharge: "EnvTeam",
    groupInChargeEmail: "environment@dmcihomes.com",
    status: "Inactive",
    remarks: "Focuses on sustainability"
  },
  {
    id: "1018",
    groupCode: "PROC",
    groupName: "Procurement Group",
    groupInCharge: "ProcTeam",
    groupInChargeEmail: "procurement@dmcihomes.com",
    status: "Active",
    remarks: "Handles purchasing"
  },
  {
    id: "1019",
    groupCode: "AUDIT",
    groupName: "Audit Group",
    groupInCharge: "AuditTeam",
    groupInChargeEmail: "audit@dmcihomes.com",
    status: "Active",
    remarks: "Conducts internal audits"
  },
  {
    id: "1020",
    groupCode: "COMPLIANCE",
    groupName: "Compliance Group",
    groupInCharge: "ComplianceTeam",
    groupInChargeEmail: "compliance@dmcihomes.com",
    status: "Inactive",
    remarks: "Ensures regulatory compliance"
  },
  {
    id: "1021",
    groupCode: "BILLING",
    groupName: "Billing Group",
    groupInCharge: "BillingDept",
    groupInChargeEmail: "billing@dmcihomes.com",
    status: "Active",
    remarks: "Handles invoicing and payments"
  },
  {
    id: "1022",
    groupCode: "PAYROLL",
    groupName: "Payroll Group",
    groupInCharge: "PayrollDept",
    groupInChargeEmail: "payroll@dmcihomes.com",
    status: "Active",
    remarks: "Manages employee salaries"
  },
  {
    id: "1023",
    groupCode: "ARCH",
    groupName: "Architecture Group",
    groupInCharge: "ArchTeam",
    groupInChargeEmail: "architecture@dmcihomes.com",
    status: "Active",
    remarks: "Designs building plans"
  },
  {
    id: "1024",
    groupCode: "LEGALOPS",
    groupName: "Legal Operations Group",
    groupInCharge: "LegalOpsTeam",
    groupInChargeEmail: "legalops@dmcihomes.com",
    status: "Inactive",
    remarks: "Supports legal processes"
  },
  {
    id: "1025",
    groupCode: "DOCS",
    groupName: "Documentation Group",
    groupInCharge: "DocsTeam",
    groupInChargeEmail: "docs@dmcihomes.com",
    status: "Active",
    remarks: "Manages company documents"
  }
]

export default groups