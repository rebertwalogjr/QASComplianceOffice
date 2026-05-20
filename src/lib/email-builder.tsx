import { render } from 'react-email'
import { TransactionEmailPayload } from '@/server-actions/transaction';

interface ApprovalEmailProps {
  seriesId: string;
  creator: string;
  projectName: string;
}

const genlink = (series: string) => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  return `${cleanBaseUrl}/qas/${series}`;
}

// Compliance Secretariat to Superisor: Open
const SupervisorVerificationRequest = ({ job }: { job: TransactionEmailPayload }) => (
  <html>
    <body>
      <div style={{ backgroundColor: '#ffffff', margin: '1rem' }}>
        <p>Hi {job.supervisor.appSuiteEmployeeMaster.firstName},</p>
        <br />
        <p>This is to notify you that the finding is waiting for your review and verification.</p>
        <br />
        <table style={{ width: '100%', borderCollapse: 'separate', border: '1px solid #e5e7eb' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top', width: '33.333333%' }}>Series number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.id.toString()}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Finding number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditReport.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit engagement</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditEngagement.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Type of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.typeOfFinding.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Findings category</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.findingCategory.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit rating</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditRating.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Details of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.problemCriteria}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Please click the link below</p>
        <a href={genlink(job.id.toString())} style={{ color: '#0066cc', textDecoration: 'underline' }} target='_blank'>{genlink(job.id.toString())}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p style={{ color: '#ef4444' }}>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

// Supervisor to Alternate Compliance Officer: Open
const OfficerApprovalRequest = ({ job }: { job: TransactionEmailPayload }) => (
  <html>
    <body>
      <div style={{ backgroundColor: '#ffffff', margin: '1rem' }}>
        <p>Hi {job.complianceOfficer.appSuiteEmployeeMaster.firstName},</p>
        <br />
        <p>This is to notify you that the finding has been verified by the supervisor and is waiting for your approval.</p>
        <br />
        <table style={{ width: '100%', borderCollapse: 'separate', border: '1px solid #e5e7eb' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top', width: '33.333333%' }}>Series number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.id.toString()}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Finding number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditReport.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit engagement</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditEngagement.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Type of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.typeOfFinding.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Findings category</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.findingCategory.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit rating</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditRating.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Details of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.problemCriteria}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Last comment by supervisor</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{ }</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Please click the link below</p>
        <a href={genlink(job.id.toString())} style={{ color: '#0066cc', textDecoration: 'underline' }} target='_blank'>{genlink(job.id.toString())}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p style={{ color: '#ef4444' }}>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

// Alternate Compliance Officer: Open
const FindingsApproved = ({ job }: { job: TransactionEmailPayload }) => (
  <html>
    <body>
      <div style={{ backgroundColor: '#ffffff', margin: '1rem' }}>
        <p>Hi {job.creator.appSuiteEmployeeMaster.firstName},</p>
        <br />
        <p>This is to notify you that the finding has been endorsed for approval.</p>
        <br />
        <table style={{ width: '100%', borderCollapse: 'separate', border: '1px solid #e5e7eb' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top', width: '33.333333%' }}>Series number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.id.toString()}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Finding number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditReport.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit engagement</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditEngagement.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Type of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.typeOfFinding.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Findings category</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.findingCategory.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit rating</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditRating.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Details of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.problemCriteria}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Last comment by supervisor</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{ }</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Please click the link below</p>
        <a href={genlink(job.id.toString())} style={{ color: '#0066cc', textDecoration: 'underline' }} target='_blank'>{genlink(job.id.toString())}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p style={{ color: '#ef4444' }}>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

// Alternate Compliance Officer to Recipient: Open
const RecipientApprovalRequest = ({ job }: { job: TransactionEmailPayload }) => (
  <html>
    <body>
      <div style={{ backgroundColor: '#ffffff', margin: '1rem' }}>
        <p>Hi {job.recipient?.appSuiteEmployeeMaster.firstName},</p>
        <br />
        <p>This is to notify you that the finding has been approved. Kindly respond to the finding within 2 working days in accordance with the requirement of QM-PR-004 Handling of Audit Findings</p>
        <br />
        <table style={{ width: '100%', borderCollapse: 'separate', border: '1px solid #e5e7eb' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top', width: '33.333333%' }}>Series number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.id.toString()}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Finding number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditReport.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit engagement</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditEngagement.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Type of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.typeOfFinding.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Findings category</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.findingCategory.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit rating</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditRating.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Details of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.problemCriteria}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Please click the link below</p>
        <a href={genlink(job.id.toString())} style={{ color: '#0066cc', textDecoration: 'underline' }} target='_blank'>{genlink(job.id.toString())}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p style={{ color: '#ef4444' }}>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

// Recipient to Compliance Secretariat: Accepted
const SecretariatApprovalRequest = ({ job }: { job: TransactionEmailPayload }) => (
  <html>
    <body>
      <div style={{ backgroundColor: '#ffffff', margin: '1rem' }}>
        <p>Hi {job.complianceSecretariat.appSuiteEmployeeMaster.firstName},</p>
        <br />
        <p>This is to notify you that the finding has been responded by the auditee and is waiting for your action.</p>
        <br />
        <table style={{ width: '100%', borderCollapse: 'separate', border: '1px solid #e5e7eb' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top', width: '33.333333%' }}>Series number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.id.toString()}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Finding number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditReport.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit engagement</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditEngagement.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Type of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.typeOfFinding.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Findings category</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.findingCategory.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit rating</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditRating.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Details of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.problemCriteria}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Corrective Action</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.correctiveAction}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Preventive Action</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.preventiveAction}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Please click the link below</p>
        <a href={genlink(job.id.toString())} style={{ color: '#0066cc', textDecoration: 'underline' }} target='_blank'>{genlink(job.id.toString())}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p style={{ color: '#ef4444' }}>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

// Compliance Secretariat to Supervisor: Request Closing
const SupervisorForClosingRequest = ({ job }: { job: TransactionEmailPayload }) => (
  <html>
    <body>
      <div style={{ backgroundColor: '#ffffff', margin: '1rem' }}>
        <p>Hi {job.supervisor.appSuiteEmployeeMaster.firstName},</p>
        <br />
        <p>This is to notify you that the Compliance Secretariat is requesting for your closing approval.</p>
        <br />
        <table style={{ width: '100%', borderCollapse: 'separate', border: '1px solid #e5e7eb' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top', width: '33.333333%' }}>Series number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.id.toString()}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Finding number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditReport.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit engagement</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditEngagement.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Type of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.typeOfFinding.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Findings category</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.findingCategory.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit rating</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditRating.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Details of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.problemCriteria}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Compliance Secretariat:</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.complianceSecretariat.appSuiteEmployeeMaster.fullName}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Last comment</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{ }</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Please click the link below</p>
        <a href={genlink(job.id.toString())} style={{ color: '#0066cc', textDecoration: 'underline' }} target='_blank'>{genlink(job.id.toString())}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p style={{ color: '#ef4444' }}>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

// Supervisor: Closed
const OfficerForClosingApproved = ({ job }: { job: TransactionEmailPayload }) => (
  <html>
    <body>
      <div style={{ backgroundColor: '#ffffff', margin: '1rem' }}>
        <p>Hi {job.complianceSecretariat.appSuiteEmployeeMaster.firstName},</p>
        <br />
        <p>This is to notify you that your request for closing approval has been approve</p>
        <br />
        <table style={{ width: '100%', borderCollapse: 'separate', border: '1px solid #e5e7eb' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top', width: '33.333333%' }}>Series number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.id.toString()}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Finding number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditReport.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit engagement</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditEngagement.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Type of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.typeOfFinding.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Findings category</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.findingCategory.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit rating</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditRating.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Details of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.problemCriteria}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Corrective Action</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.correctiveAction}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Preventive Action</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.preventiveAction}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Please click the link below</p>
        <a href={genlink(job.id.toString())} style={{ color: '#0066cc', textDecoration: 'underline' }} target='_blank'>{genlink(job.id.toString())}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p style={{ color: '#ef4444' }}>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

const NewlyCreatedTemplate = ({ job }: { job: TransactionEmailPayload }) => (
  <html>
    <body>
      <div style={{ backgroundColor: '#ffffff', margin: '1rem' }}>
        <p>Hi {job.creator.appSuiteEmployeeMaster.firstName},</p>
        <br />
        <p>You have successfully created a finding <strong>{job.id.toString()}</strong></p>
        <br />
        <table style={{ width: '100%', borderCollapse: 'separate', border: '1px solid #e5e7eb' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top', width: '33.333333%' }}>Series number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.id.toString()}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Finding number</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditReport.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit engagement</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditEngagement.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Type of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.typeOfFinding.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Findings category</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.findingCategory.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Audit rating</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.auditRating.name}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>Details of finding</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '0.25rem', verticalAlign: 'top' }}>{job.problemCriteria}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>While waiting to complete, you can review your series by clicking the link below.</p>
        <a href={genlink(job.id.toString().toString())} style={{ color: '#0066cc', textDecoration: 'underline' }} target='_blank'>{genlink(job.id.toString().toString())}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p style={{ color: '#ef4444' }}>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

// 0. Newly created finding
export async function getNewlyCreatedEmailHtml(job: TransactionEmailPayload) {
  return {
    subject: `[QAS Compliancec Office] QA Entry Created ${job.id}`,
    recipient: job.complianceSecretariat.emailAddress || "rlwalog@dmcihomes.com",
    template: await render(<NewlyCreatedTemplate job={job} />)
  }
}

// 1. Review request for supervisor
export async function getSupervisorVerificationRequestEmailHtml(job: TransactionEmailPayload) {
  return {
    subject: `[QAS Compliance Office] ${job.project.name}, QA Entry for Review ${job.id}`,
    recipient: job.supervisor.emailAddress || "rlwalog@dmcihomes.com",
    cc: job.complianceSecretariat.emailAddress || "",
    template: await render(<SupervisorVerificationRequest job={job} />)
  }
}

// 2. Approval request for compliance officer
export async function getOfficerApprovalRequestEmailHtml(job: TransactionEmailPayload) {
  return {
    subject: `[QAS Compliance Office] ${job.project.name}, QA Entry for Update ${job.id}`,
    recipient: job.complianceOfficer.emailAddress || "rlwalog@dmcihomes.com",
    cc: job.complianceSecretariat.emailAddress || "",
    template: await render(<OfficerApprovalRequest job={job} />)
  }
}

// Include compliance secretariat on recipient approval request as CC
// 3. Finding approved email to compliance secretariat
// export async function getFindingsApprovedEmailHtml(job: TransactionEmailPayload) {
//   return {
//     subject: `[QAS Compliance Office] ${job.project.name}, QA Entry for Final approval ${job.id}`,
//     recipient: job.complianceOfficer.emailAddress || "rlwalog@dmcihomes.com",
//     template: await render(<FindingsApproved job={job} />)
//   }
// }

// 4. Request approval to recipient
export async function getRecipientApprovalRequestEmailHtml(job: TransactionEmailPayload) {
  return {
    subject: `[QAS Compliance Office] ${job.project.name}, Approved QA Entry for Acceptance ${job.id}`,
    recipient: job.recipient?.emailAddress || "rlwalog@dmcihomes.com",
    cc: job.complianceSecretariat.emailAddress || "",
    template: await render(<RecipientApprovalRequest job={job} />)
  }
}

// 5. Request approval to compliance secretariat
export async function getSecretariatApprovalRequestEmailHtml(job: TransactionEmailPayload) {
  return {
    subject: `[QAS Compliance Office] ${job.project.name}, Responded QA Entry ${job.id}`,
    recipient: job.complianceOfficer.emailAddress || "rlwalog@dmcihomes.com",
    template: await render(<SecretariatApprovalRequest job={job} />)
  }
}

// 6. Request supervisor approval for closing
export async function getSupervisorForClosingRequestEmailHtml(job: TransactionEmailPayload) {
  return {
    subject: `[QAS Compliance Office] ${job.project.name}, Closing Request QA Entry ${job.id}`,
    recipient: job.supervisor.emailAddress || "rlwalog@dmcihomes.com",
    template: await render(<SupervisorForClosingRequest job={job} />)
  }
}

// 7. Supervisor Closed
export async function getOfficerForClosingApprovedEmailHtml(job: TransactionEmailPayload) {
  return {
    subject: `[QAS Compliance Office] ${job.project.name}, Approved Closing Approval QA Entry ${job.id}`,
    recipient: job.supervisor.emailAddress || "rlwalog@dmcihomes.com",
    cc: job.complianceSecretariat.emailAddress || "",
    template: await render(<OfficerForClosingApproved job={job} />)
  }
}