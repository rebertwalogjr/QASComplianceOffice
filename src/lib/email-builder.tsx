import { render } from 'react-email'
import { TransactionEmailPayload } from '@/server-actions/transaction';
import { UserInfoPayload } from '@/server-actions/user';
import { UpdateTrailPayload } from '@/server-actions/update-trail';
import { ReviewTrailPayload } from '@/server-actions/review-trail';

interface EmailProps {
  job: TransactionEmailPayload
  comment?: string
}

const genlink = (series: string) => {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  return `${cleanBaseUrl}/qas/${series}`;
}

// Compliance Secretariat to Superisor: Open
const SupervisorVerificationRequest = ({ job }: EmailProps) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style={{
      backgroundColor: '#f6f9fc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      margin: 0,
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>

        {/* Header / Brand Area */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '700',
            color: '#64748b'
          }}>
            QA Compliance Office Notification
          </span>
        </div>

        {/* Greeting */}
        <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#1e293b', margin: '0 0 1rem 0' }}>
          Hi <strong>{job.supervisor.appSuiteEmployeeMaster.firstName}</strong>,
        </p>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 1.5rem 0' }}>
          An audit finding has been submitted and is currently <strong>awaiting your review and verification</strong>.
        </p>

        {/* Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1.5rem 0',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <tbody>
            {[
              { label: "Series number", value: job.id.toString(), highlight: true },
              { label: "Finding number", value: job.auditReport.name },
              { label: "Audit engagement", value: job.auditEngagement.name },
              { label: "Type of finding", value: job.typeOfFinding.name },
              { label: "Findings category", value: job.findingCategory.name },
              { label: "Audit rating", value: job.auditRating.name }
            ].map((row, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#64748b',
                  width: '35%',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.label}
                </td>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: row.highlight ? '700' : '500',
                  color: '#1e293b',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.value}
                </td>
              </tr>
            ))}

            {/* Detailed Row Blockout (Problem Details) */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '1rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>
                  Details of finding:
                </div>
                <div style={{
                  backgroundColor: '#f1f5f9',
                  padding: '1rem',
                  borderRadius: '6px',
                  color: '#334155',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {job.problemCriteria}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 2rem 0' }}>
          Please access the portal dashboard to review full criteria scope, logs, and process the workflow stage verification step:
        </p>

        {/* Call-to-Action Button */}
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <a href={genlink(job.id.toString())} target='_blank' rel="noopener noreferrer" style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            borderRadius: '6px',
            display: 'inline-block',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Review & Verify Finding
          </a>
        </div>

        {/* Sign-off */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#64748b', margin: 0 }}>Regards,</p>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', fontWeight: '600', color: '#334155', margin: '2px 0 0 0' }}>
            QA Compliance Office System Administrator
          </p>
        </div>

        {/* Footer / Disclaimer */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.75rem',
            lineHeight: '1.4',
            backgroundColor: '#fff1f2',
            border: '1px solid #ffe4e6',
            color: '#e11d48',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            display: 'inline-block',
            margin: 0
          }}>
            This is an automated system notification. Please do not reply directly to this email.
          </p>
        </div>

      </div>
    </body>
  </html>
)

// Supervisor to Alternate Compliance Officer: Open
const OfficerApprovalRequest = ({ job, comment }: EmailProps) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style={{
      backgroundColor: '#f6f9fc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      margin: 0,
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>

        {/* Header / Brand Area */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '700',
            color: '#64748b'
          }}>
            QA Compliance Office Notification
          </span>
        </div>

        {/* Greeting */}
        <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#1e293b', margin: '0 0 1rem 0' }}>
          Hi <strong>{job.complianceOfficer.appSuiteEmployeeMaster.firstName}</strong>,
        </p>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 1.5rem 0' }}>
          This is to notify you that a finding has been verified by the supervisor and is now <strong>awaiting your final approval</strong>.
        </p>

        {/* Detailed Metadata Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1.5rem 0',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <tbody>
            {[
              { label: "Series number", value: job.id.toString(), highlight: true },
              { label: "Finding number", value: job.auditReport.name },
              { label: "Audit engagement", value: job.auditEngagement.name },
              { label: "Type of finding", value: job.typeOfFinding.name },
              { label: "Findings category", value: job.findingCategory.name },
              { label: "Audit rating", value: job.auditRating.name }
            ].map((row, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#64748b',
                  width: '35%',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.label}
                </td>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: row.highlight ? '700' : '500',
                  color: '#1e293b',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.value}
                </td>
              </tr>
            ))}

            {/* Details of Finding Boxout */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '1rem 1rem 0.5rem 1rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Details of finding:
                </div>
                <div style={{
                  backgroundColor: '#f1f5f9',
                  padding: '1rem',
                  borderRadius: '6px',
                  color: '#334155',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {job.problemCriteria}
                </div>
              </td>
            </tr>

            {/* Supervisor Comments Boxout */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '0.5rem 1rem 1rem 1rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Last comment by supervisor:
                </div>
                <div style={{
                  backgroundColor: '#fdf8f2',
                  borderLeft: '4px solid #d97706',
                  padding: '1rem',
                  borderRadius: '0 6px 6px 0',
                  color: '#451a03',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  fontStyle: 'italic'
                }}>
                  "{comment}"
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 2rem 0' }}>
          Please review the completed verification trail and log entry records to update this workflow cycle:
        </p>

        {/* Styled Call-to-Action Button */}
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <a href={genlink(job.id.toString())} target='_blank' rel="noopener noreferrer" style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            borderRadius: '6px',
            display: 'inline-block',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Review & Approve Finding
          </a>
        </div>

        {/* Sign-off */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#64748b', margin: 0 }}>Regards,</p>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', fontWeight: '600', color: '#334155', margin: '2px 0 0 0' }}>
            QA Compliance Office System Administrator
          </p>
        </div>

        {/* Footer / Disclaimer */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.75rem',
            lineHeight: '1.4',
            backgroundColor: '#fff1f2',
            border: '1px solid #ffe4e6',
            color: '#e11d48',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            display: 'inline-block',
            margin: 0
          }}>
            This is an automated system notification. Please do not reply directly to this email.
          </p>
        </div>

      </div>
    </body>
  </html>
)

// Alternate Compliance Officer: Open
const FindingsApproved = ({ job, comment }: EmailProps) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style={{
      backgroundColor: '#f6f9fc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      margin: 0,
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>

        {/* Header / Brand Area */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '700',
            color: '#64748b'
          }}>
            QA Compliance Office Notification
          </span>
        </div>

        {/* Greeting */}
        <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#1e293b', margin: '0 0 1rem 0' }}>
          Hi <strong>{job.creator.appSuiteEmployeeMaster.firstName}</strong>,
        </p>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 1.5rem 0' }}>
          This is to notify you that your submitted finding has been <strong>endorsed for approval</strong> and is progressing through the workflow.
        </p>

        {/* Detailed Metadata Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1.5rem 0',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <tbody>
            {[
              { label: "Series number", value: job.id.toString(), highlight: true },
              { label: "Finding number", value: job.auditReport.name },
              { label: "Audit engagement", value: job.auditEngagement.name },
              { label: "Type of finding", value: job.typeOfFinding.name },
              { label: "Findings category", value: job.findingCategory.name },
              { label: "Audit rating", value: job.auditRating.name }
            ].map((row, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#64748b',
                  width: '35%',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.label}
                </td>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: row.highlight ? '700' : '500',
                  color: '#1e293b',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.value}
                </td>
              </tr>
            ))}

            {/* Details of Finding Boxout */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '1rem 1rem 0.5rem 1rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Details of finding:
                </div>
                <div style={{
                  backgroundColor: '#f1f5f9',
                  padding: '1rem',
                  borderRadius: '6px',
                  color: '#334155',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {job.problemCriteria}
                </div>
              </td>
            </tr>

            {/* Supervisor Comments Boxout */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '0.5rem 1rem 1rem 1rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Last comment by supervisor:
                </div>
                <div style={{
                  backgroundColor: '#fdf8f2',
                  borderLeft: '4px solid #d97706',
                  padding: '1rem',
                  borderRadius: '0 6px 6px 0',
                  color: '#451a03',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  fontStyle: 'italic'
                }}>
                  "{comment}"
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 2rem 0' }}>
          You can track the ongoing verification logs and full audit trail timeline directly via the tracking portal link below:
        </p>

        {/* Styled Call-to-Action Button */}
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <a href={genlink(job.id.toString())} target='_blank' rel="noopener noreferrer" style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            borderRadius: '6px',
            display: 'inline-block',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            View Finding Status
          </a>
        </div>

        {/* Sign-off */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#64748b', margin: 0 }}>Regards,</p>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', fontWeight: '600', color: '#334155', margin: '2px 0 0 0' }}>
            QA Compliance Office System Administrator
          </p>
        </div>

        {/* Footer / Disclaimer */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.75rem',
            lineHeight: '1.4',
            backgroundColor: '#fff1f2',
            border: '1px solid #ffe4e6',
            color: '#e11d48',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            display: 'inline-block',
            margin: 0
          }}>
            This is an automated system notification. Please do not reply directly to this email.
          </p>
        </div>

      </div>
    </body>
  </html>
)

// Alternate Compliance Officer to Recipient: Open
const RecipientApprovalRequest = ({ job, comment }: EmailProps) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style={{
      backgroundColor: '#f6f9fc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      margin: 0,
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>

        {/* Header / Brand Area */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '700',
            color: '#64748b'
          }}>
            QA Compliance Office Notification
          </span>
        </div>

        {/* Greeting */}
        <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#1e293b', margin: '0 0 1rem 0' }}>
          Hi <strong>{job.recipient?.appSuiteEmployeeMaster.firstName}</strong>,
        </p>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 1.5rem 0' }}>
          This is to notify you that the audit finding has been officially approved. Kindly respond to this finding within <span style={{ backgroundColor: '#fef08a', color: '#854d0e', padding: '0.125rem 0.35rem', borderRadius: '4px', fontWeight: '600' }}>2 working days</span> in accordance with the standard requirement of <strong>QM-PR-004 Handling of Audit Findings</strong>.
        </p>

        {/* Detailed Metadata Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1.5rem 0',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <tbody>
            {[
              { label: "Series number", value: job.id.toString(), highlight: true },
              { label: "Finding number", value: job.auditReport.name },
              { label: "Audit engagement", value: job.auditEngagement.name },
              { label: "Type of finding", value: job.typeOfFinding.name },
              { label: "Findings category", value: job.findingCategory.name },
              { label: "Audit rating", value: job.auditRating.name }
            ].map((row, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#64748b',
                  width: '35%',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.label}
                </td>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: row.highlight ? '700' : '500',
                  color: '#1e293b',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.value}
                </td>
              </tr>
            ))}

            {/* Details of Finding Boxout */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '1rem 1rem 0.5rem 1rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Details of finding:
                </div>
                <div style={{
                  backgroundColor: '#f1f5f9',
                  padding: '1rem',
                  borderRadius: '6px',
                  color: '#334155',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {job.problemCriteria}
                </div>
              </td>
            </tr>

            {/* Compliance Officer Comments Boxout */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '0.5rem 1rem 1rem 1rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Last comment by compliance officer:
                </div>
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderLeft: '4px solid #64748b',
                  padding: '1rem',
                  borderRadius: '0 6px 6px 0',
                  color: '#334155',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  fontStyle: 'italic'
                }}>
                  "{comment}"
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 2rem 0' }}>
          Please log into the system to draft and submit your corrective action plan or acknowledgment response:
        </p>

        {/* Styled Call-to-Action Button */}
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <a href={genlink(job.id.toString())} target='_blank' rel="noopener noreferrer" style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            borderRadius: '6px',
            display: 'inline-block',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Respond to Finding
          </a>
        </div>

        {/* Sign-off */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#64748b', margin: 0 }}>Regards,</p>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', fontWeight: '600', color: '#334155', margin: '2px 0 0 0' }}>
            QA Compliance Office System Administrator
          </p>
        </div>

        {/* Footer / Disclaimer */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.75rem',
            lineHeight: '1.4',
            backgroundColor: '#fff1f2',
            border: '1px solid #ffe4e6',
            color: '#e11d48',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            display: 'inline-block',
            margin: 0
          }}>
            This is an automated system notification. Please do not reply directly to this email.
          </p>
        </div>

      </div>
    </body>
  </html>
)

// Recipient to Compliance Secretariat: Accepted
const SecretariatApprovalRequest = ({ job, comment }: EmailProps) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style={{
      backgroundColor: '#f6f9fc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      margin: 0,
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>

        {/* Header / Brand Area */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '700',
            color: '#64748b'
          }}>
            QA Compliance Office Notification
          </span>
        </div>

        {/* Greeting */}
        <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#1e293b', margin: '0 0 1rem 0' }}>
          Hi <strong>{job.complianceSecretariat.appSuiteEmployeeMaster.firstName}</strong>,
        </p>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 1.5rem 0' }}>
          This is to notify you that the finding has been officially responded to by the auditee and is currently <strong>awaiting your administrative review and processing action</strong>.
        </p>

        {/* Detailed Metadata Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1.5rem 0',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <tbody>
            {[
              { label: "Series number", value: job.id.toString(), highlight: true },
              { label: "Finding number", value: job.auditReport.name },
              { label: "Audit engagement", value: job.auditEngagement.name },
              { label: "Type of finding", value: job.typeOfFinding.name },
              { label: "Findings category", value: job.findingCategory.name },
              { label: "Audit rating", value: job.auditRating.name }
            ].map((row, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#64748b',
                  width: '35%',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.label}
                </td>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: row.highlight ? '700' : '500',
                  color: '#1e293b',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.value}
                </td>
              </tr>
            ))}

            {/* Details of Finding Boxout */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '1rem 1rem 0.5rem 1rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Details of finding:
                </div>
                <div style={{
                  backgroundColor: '#f1f5f9',
                  padding: '1rem',
                  borderRadius: '6px',
                  color: '#334155',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {job.problemCriteria}
                </div>
              </td>
            </tr>

            {/* Auditee Response Boxouts */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '0.5rem 1rem 1rem 1rem', fontSize: '0.85rem' }}>

                {/* Corrective Action Sub-block */}
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Corrective Action:
                </div>
                <div style={{
                  backgroundColor: '#f0fdfa',
                  borderLeft: '4px solid #0d9488',
                  padding: '1rem',
                  borderRadius: '0 6px 6px 0',
                  color: '#115e59',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  marginBottom: '1rem'
                }}>
                  {job.correctiveAction}
                </div>

                {/* Preventive Action Sub-block */}
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Preventive Action:
                </div>
                <div style={{
                  backgroundColor: '#f0fdfa',
                  borderLeft: '4px solid #0d9488',
                  padding: '1rem',
                  borderRadius: '0 6px 6px 0',
                  color: '#115e59',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {job.preventiveAction}
                </div>

              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 2rem 0' }}>
          Please review the execution metrics and update the action tracking status on the secretariat management panel:
        </p>

        {/* Styled Call-to-Action Button */}
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <a href={genlink(job.id.toString())} target='_blank' rel="noopener noreferrer" style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            borderRadius: '6px',
            display: 'inline-block',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Process Action Plans
          </a>
        </div>

        {/* Sign-off */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#64748b', margin: 0 }}>Regards,</p>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', fontWeight: '600', color: '#334155', margin: '2px 0 0 0' }}>
            QA Compliance Office System Administrator
          </p>
        </div>

        {/* Footer / Disclaimer */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.75rem',
            lineHeight: '1.4',
            backgroundColor: '#fff1f2',
            border: '1px solid #ffe4e6',
            color: '#e11d48',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            display: 'inline-block',
            margin: 0
          }}>
            This is an automated system notification. Please do not reply directly to this email.
          </p>
        </div>

      </div>
    </body>
  </html>
)

// Compliance Secretariat to Supervisor: Request Closing
const SupervisorForClosingRequest = ({ job, comment }: EmailProps) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style={{
      backgroundColor: '#f6f9fc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      margin: 0,
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>

        {/* Header / Brand Area */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '700',
            color: '#64748b'
          }}>
            QA Compliance Office Notification
          </span>
        </div>

        {/* Greeting */}
        <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#1e293b', margin: '0 0 1rem 0' }}>
          Hi <strong>{job.supervisor.appSuiteEmployeeMaster.firstName}</strong>,
        </p>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 1.5rem 0' }}>
          This is to notify you that the Compliance Secretariat is requesting your <strong>final closing approval</strong> for this finding lifecycle.
        </p>

        {/* Detailed Metadata Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1.5rem 0',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <tbody>
            {[
              { label: "Series number", value: job.id.toString(), highlight: true },
              { label: "Finding number", value: job.auditReport.name },
              { label: "Audit engagement", value: job.auditEngagement.name },
              { label: "Type of finding", value: job.typeOfFinding.name },
              { label: "Findings category", value: job.findingCategory.name },
              { label: "Audit rating", value: job.auditRating.name },
              { label: "Compliance Secretariat", value: job.complianceSecretariat.appSuiteEmployeeMaster.fullName }
            ].map((row, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#64748b',
                  width: '35%',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.label}
                </td>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: row.highlight ? '700' : '500',
                  color: '#1e293b',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.value}
                </td>
              </tr>
            ))}

            {/* Details of Finding Boxout */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '1rem 1rem 0.5rem 1rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Details of finding:
                </div>
                <div style={{
                  backgroundColor: '#f1f5f9',
                  padding: '1rem',
                  borderRadius: '6px',
                  color: '#334155',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {job.problemCriteria}
                </div>
              </td>
            </tr>

            {/* Last Secretariat Comment Boxout */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '0.5rem 1rem 1rem 1rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Last comment from Secretariat:
                </div>
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderLeft: '4px solid #475569',
                  padding: '1rem',
                  borderRadius: '0 6px 6px 0',
                  color: '#334155',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  fontStyle: 'italic'
                }}>
                  "{comment}"
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 2rem 0' }}>
          Please review the resolution details and close out the record via the dashboard portal link below:
        </p>

        {/* Styled Call-to-Action Button */}
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <a href={genlink(job.id.toString())} target='_blank' rel="noopener noreferrer" style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            borderRadius: '6px',
            display: 'inline-block',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Review & Approve Closure
          </a>
        </div>

        {/* Sign-off */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#64748b', margin: 0 }}>Regards,</p>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', fontWeight: '600', color: '#334155', margin: '2px 0 0 0' }}>
            QA Compliance Office System Administrator
          </p>
        </div>

        {/* Footer / Disclaimer */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.75rem',
            lineHeight: '1.4',
            backgroundColor: '#fff1f2',
            border: '1px solid #ffe4e6',
            color: '#e11d48',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            display: 'inline-block',
            margin: 0
          }}>
            This is an automated system notification. Please do not reply directly to this email.
          </p>
        </div>

      </div>
    </body>
  </html>
)

// Supervisor: Closed
const OfficerForClosingApproved = ({ job, comment }: EmailProps) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style={{
      backgroundColor: '#f6f9fc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      margin: 0,
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>

        {/* Header / Brand Area */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '700',
            color: '#64748b'
          }}>
            QA Compliance Office Notification
          </span>
        </div>

        {/* Greeting */}
        <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#1e293b', margin: '0 0 1rem 0' }}>
          Hi <strong>{job.complianceSecretariat.appSuiteEmployeeMaster.firstName}</strong>,
        </p>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 1.5rem 0' }}>
          This is to notify you that your request for closing approval has been officially <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.125rem 0.35rem', borderRadius: '4px', fontWeight: '600' }}>approved</span>.
        </p>

        {/* Detailed Metadata Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1.5rem 0',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <tbody>
            {[
              { label: "Series number", value: job.id.toString(), highlight: true },
              { label: "Finding number", value: job.auditReport.name },
              { label: "Audit engagement", value: job.auditEngagement.name },
              { label: "Type of finding", value: job.typeOfFinding.name },
              { label: "Findings category", value: job.findingCategory.name },
              { label: "Audit rating", value: job.auditRating.name }
            ].map((row, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#64748b',
                  width: '35%',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.label}
                </td>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: row.highlight ? '700' : '500',
                  color: '#1e293b',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.value}
                </td>
              </tr>
            ))}

            {/* Details of Finding Boxout */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '1rem 1rem 0.5rem 1rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Details of finding:
                </div>
                <div style={{
                  backgroundColor: '#f1f5f9',
                  padding: '1rem',
                  borderRadius: '6px',
                  color: '#334155',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {job.problemCriteria}
                </div>
              </td>
            </tr>

            {/* Action Plans Implemented Boxouts */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '0.5rem 1rem 1rem 1rem', fontSize: '0.85rem' }}>

                {/* Corrective Action Sub-block */}
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Corrective Action Implemented:
                </div>
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderLeft: '4px solid #cbd5e1',
                  padding: '1rem',
                  borderRadius: '0 6px 6px 0',
                  color: '#475569',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  marginBottom: '1rem'
                }}>
                  {job.correctiveAction}
                </div>

                {/* Preventive Action Sub-block */}
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Preventive Action Implemented:
                </div>
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderLeft: '4px solid #cbd5e1',
                  padding: '1rem',
                  borderRadius: '0 6px 6px 0',
                  color: '#475569',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {job.preventiveAction}
                </div>

              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 2rem 0' }}>
          The finding item has been archived as resolved. You can review the historical completion records via the link below:
        </p>

        {/* Styled Success Call-to-Action Button */}
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <a href={genlink(job.id.toString())} target='_blank' rel="noopener noreferrer" style={{
            backgroundColor: '#059669',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            borderRadius: '6px',
            display: 'inline-block',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            View Closed Finding
          </a>
        </div>

        {/* Sign-off */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#64748b', margin: 0 }}>Regards,</p>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', fontWeight: '600', color: '#334155', margin: '2px 0 0 0' }}>
            QA Compliance Office System Administrator
          </p>
        </div>

        {/* Footer / Disclaimer */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.75rem',
            lineHeight: '1.4',
            backgroundColor: '#fff1f2',
            border: '1px solid #ffe4e6',
            color: '#e11d48',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            display: 'inline-block',
            margin: 0
          }}>
            This is an automated system notification. Please do not reply directly to this email.
          </p>
        </div>

      </div>
    </body>
  </html>
)

const NewlyCreatedTemplate = ({ job, comment }: EmailProps) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style={{
      backgroundColor: '#f6f9fc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      margin: 0,
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>

        {/* Header / Brand Area */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '700',
            color: '#64748b'
          }}>
            QA Compliance Office Notification
          </span>
        </div>

        {/* Greeting */}
        <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#1e293b', margin: '0 0 1rem 0' }}>
          Hi <strong>{job.creator.appSuiteEmployeeMaster.firstName}</strong>,
        </p>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 1.5rem 0' }}>
          You have successfully created finding <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.125rem 0.35rem', borderRadius: '4px', fontWeight: '700' }}>{job.id.toString()}</span> in the system.
        </p>

        {/* Detailed Metadata Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1.5rem 0',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <tbody>
            {[
              { label: "Series number", value: job.id.toString(), highlight: true },
              { label: "Finding number", value: job.auditReport.name },
              { label: "Audit engagement", value: job.auditEngagement.name },
              { label: "Type of finding", value: job.typeOfFinding.name },
              { label: "Findings category", value: job.findingCategory.name },
              { label: "Audit rating", value: job.auditRating.name }
            ].map((row, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#64748b',
                  width: '35%',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.label}
                </td>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: row.highlight ? '700' : '500',
                  color: '#1e293b',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.value}
                </td>
              </tr>
            ))}

            {/* Details of Finding Boxout */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '1rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.4rem' }}>
                  Details of finding:
                </div>
                <div style={{
                  backgroundColor: '#f1f5f9',
                  padding: '1rem',
                  borderRadius: '6px',
                  color: '#334155',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {job.problemCriteria}
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 2rem 0' }}>
          While waiting for the review process to complete, you can monitor your series lifecycle and details using the tracking dashboard below:
        </p>

        {/* Styled Call-to-Action Button */}
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <a href={genlink(job.id.toString())} target='_blank' rel="noopener noreferrer" style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            borderRadius: '6px',
            display: 'inline-block',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Review Submitted Finding
          </a>
        </div>

        {/* Sign-off */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#64748b', margin: 0 }}>Regards,</p>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', fontWeight: '600', color: '#334155', margin: '2px 0 0 0' }}>
            QA Compliance Office System Administrator
          </p>
        </div>

        {/* Footer / Disclaimer */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.75rem',
            lineHeight: '1.4',
            backgroundColor: '#fff1f2',
            border: '1px solid #ffe4e6',
            color: '#e11d48',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            display: 'inline-block',
            margin: 0
          }}>
            This is an automated system notification. Please do not reply directly to this email.
          </p>
        </div>

      </div>
    </body>
  </html>
)

const UserInvitationTemplate = ({ firstName, username, password }: { firstName: string, username: string, password: string }) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style={{
      backgroundColor: '#f6f9fc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      margin: 0,
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>

        {/* Header / Brand Area */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '700',
            color: '#64748b'
          }}>
            QA Compliance Office System
          </span>
        </div>

        {/* Greeting */}
        <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#1e293b', margin: '0 0 1rem 0' }}>
          Hi <strong>{firstName}</strong>,
        </p>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 1.5rem 0' }}>
          An administrative profile has been successfully provisioned for you within the **QAS Compliance Office System**. Please use the temporary system-generated credentials provided below to access your account:
        </p>

        {/* Credentials Grid Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1.5rem 0',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <tbody>
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td style={{
                padding: '0.85rem 1rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#64748b',
                width: '35%',
                borderBottom: '1px solid #e2e8f0',
                verticalAlign: 'middle'
              }}>
                Username
              </td>
              <td style={{
                padding: '0.85rem 1rem',
                fontSize: '0.9rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontWeight: '600',
                color: '#0f172a',
                borderBottom: '1px solid #e2e8f0',
                verticalAlign: 'middle'
              }}>
                {username}
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td style={{
                padding: '0.85rem 1rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#64748b',
                width: '35%',
                verticalAlign: 'middle'
              }}>
                Password
              </td>
              <td style={{
                padding: '0.85rem 1rem',
                fontSize: '0.9rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontWeight: '600',
                color: '#0f172a',
                verticalAlign: 'middle'
              }}>
                {password}
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 2rem 0' }}>
          To activate your account now, please visit the platform portal and update your password upon initial login:
        </p>

        {/* Styled Call-to-Action Portal Button */}
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <a href={process.env.NEXTAUTH_URL || 'http://localhost:3000'} target='_blank' rel="noopener noreferrer" style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.75rem 1.75rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            borderRadius: '6px',
            display: 'inline-block',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Go to Login Portal
          </a>
        </div>

        {/* Sign-off */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#64748b', margin: 0 }}>Regards,</p>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', fontWeight: '600', color: '#334155', margin: '2px 0 0 0' }}>
            QA Compliance Office System Administrator
          </p>
        </div>

        {/* Footer / Disclaimer */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.75rem',
            lineHeight: '1.4',
            backgroundColor: '#fff1f2',
            border: '1px solid #ffe4e6',
            color: '#e11d48',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            display: 'inline-block',
            margin: 0
          }}>
            This is an automated system notification. Please do not reply directly to this email.
          </p>
        </div>

      </div>
    </body>
  </html>
)

const TrailTemplate = ({ name, message, jobId }: { name: string, message: string, jobId: string }) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style={{
      backgroundColor: '#f6f9fc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      margin: 0,
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        maxWidth: '560px',
        margin: '0 auto',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>

        {/* Header / Brand Area */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '700',
            color: '#64748b'
          }}>
            QA Compliance Office Notification
          </span>
        </div>

        {/* Greeting */}
        <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#1e293b', margin: '0 0 1rem 0' }}>
          Hi <strong>{name}</strong>,
        </p>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 1.5rem 0' }}>
          A new comment or remark has been added to audit finding tracker reference: <strong style={{ color: '#0f172a' }}>{jobId}</strong>.
        </p>

        {/* Enhanced Message Bubble Container */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderLeft: '4px solid #0284c7',
          padding: '1.25rem',
          borderRadius: '0 8px 8px 0',
          margin: '1.5rem 0',
          borderTop: '1px solid #f1f5f9',
          borderRight: '1px solid #f1f5f9',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <p style={{
            fontSize: '0.925rem',
            lineHeight: '1.6',
            color: '#334155',
            margin: 0,
            whiteSpace: 'pre-wrap',
            fontStyle: 'italic'
          }}>
            "{message}"
          </p>
        </div>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 2rem 0' }}>
          Please review the updated details and take any necessary workflow action by accessing the link below:
        </p>

        {/* Styled Call-to-Action Button */}
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <a href={genlink(jobId)} target='_blank' rel="noopener noreferrer" style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            borderRadius: '6px',
            display: 'inline-block',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            View Finding Details
          </a>
        </div>

        {/* Sign-off */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#64748b', margin: 0 }}>Regards,</p>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', fontWeight: '600', color: '#334155', margin: '2px 0 0 0' }}>
            QA Compliance Office System Administrator
          </p>
        </div>

        {/* Footer / Disclaimer */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.75rem',
            lineHeight: '1.4',
            // color: '#94a3b8',
            backgroundColor: '#fff1f2',
            border: '1px solid #ffe4e6',
            color: '#e11d48',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            display: 'inline-block',
            margin: 0
          }}>
            This is an automated system notification. Please do not reply directly to this email.
          </p>
        </div>

      </div>
    </body>
  </html>
)

// Compliance Secretariat to Superisor: Open
const ReOpenSeriesRecipientNotif = ({ job }: EmailProps) => (
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    </head>
    <body style={{
      backgroundColor: '#f6f9fc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      margin: 0,
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>

        {/* Header / Brand Area */}
        <div style={{ marginBottom: '2rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
          <span style={{
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '700',
            color: '#64748b'
          }}>
            QA Compliance Office Notification
          </span>
        </div>

        {/* Greeting */}
        <p style={{ fontSize: '1rem', lineHeight: '1.5', color: '#1e293b', margin: '0 0 1rem 0' }}>
          Hi <strong>{job.recipient?.appSuiteEmployeeMaster.firstName}</strong>,
        </p>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 1.5rem 0' }}>
          An audit finding has been re-open and is currently <strong>waiting for your revision</strong>.
        </p>

        {/* Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          margin: '1.5rem 0',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <tbody>
            {[
              { label: "Series number", value: job.id.toString(), highlight: true },
              { label: "Finding number", value: job.auditReport.name },
              { label: "Audit engagement", value: job.auditEngagement.name },
              { label: "Type of finding", value: job.typeOfFinding.name },
              { label: "Findings category", value: job.findingCategory.name },
              { label: "Audit rating", value: job.auditRating.name }
            ].map((row, idx) => (
              <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: '#64748b',
                  width: '35%',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.label}
                </td>
                <td style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: row.highlight ? '700' : '500',
                  color: '#1e293b',
                  borderBottom: '1px solid #e2e8f0',
                  verticalAlign: 'top'
                }}>
                  {row.value}
                </td>
              </tr>
            ))}

            {/* Detailed Row Blockout (Problem Details) */}
            <tr style={{ backgroundColor: '#ffffff' }}>
              <td colSpan={2} style={{ padding: '1rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>
                  Details of finding:
                </div>
                <div style={{
                  backgroundColor: '#f1f5f9',
                  padding: '1rem',
                  borderRadius: '6px',
                  color: '#334155',
                  lineHeight: '1.6',
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {job.problemCriteria}
                </div>
              </td>
            </tr>

          </tbody>
        </table>

        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: '#475569', margin: '0 0 2rem 0' }}>
          Please access the portal dashboard to review full criteria scope, logs, and process the workflow stage verification step:
        </p>

        {/* Call-to-Action Button */}
        <div style={{ margin: '2rem 0', textAlign: 'center' }}>
          <a href={genlink(job.id.toString())} target='_blank' rel="noopener noreferrer" style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            borderRadius: '6px',
            display: 'inline-block',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Review & Verify Finding
          </a>
        </div>

        {/* Sign-off */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', color: '#64748b', margin: 0 }}>Regards,</p>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.5', fontWeight: '600', color: '#334155', margin: '2px 0 0 0' }}>
            QA Compliance Office System Administrator
          </p>
        </div>

        {/* Footer / Disclaimer */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.75rem',
            lineHeight: '1.4',
            backgroundColor: '#fff1f2',
            border: '1px solid #ffe4e6',
            color: '#e11d48',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            display: 'inline-block',
            margin: 0
          }}>
            This is an automated system notification. Please do not reply directly to this email.
          </p>
        </div>

      </div>
    </body>
  </html>
)

// 0. Newly created finding
export async function getNewlyCreatedEmailHtml(job: TransactionEmailPayload, comment: string) {
  return {
    subject: `[QAS Compliancec Office] QA Entry Created ${job.id}`,
    recipient: job.complianceSecretariat.emailAddress || "rlwalog@dmcihomes.com",
    template: await render(<NewlyCreatedTemplate job={job} comment={comment} />)
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
export async function getOfficerApprovalRequestEmailHtml(job: TransactionEmailPayload, comment: string) {
  return {
    subject: `[QAS Compliance Office] ${job.project.name}, QA Entry for Update ${job.id}`,
    recipient: job.complianceOfficer.emailAddress || "rlwalog@dmcihomes.com",
    cc: job.complianceSecretariat.emailAddress || "",
    template: await render(<OfficerApprovalRequest job={job} comment={comment} />)
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
export async function getRecipientApprovalRequestEmailHtml(job: TransactionEmailPayload, comment: string) {
  return {
    subject: `[QAS Compliance Office] ${job.project.name}, Approved QA Entry for Acceptance ${job.id}`,
    recipient: job.recipient?.emailAddress || "rlwalog@dmcihomes.com",
    cc: job.complianceSecretariat.emailAddress || "",
    template: await render(<RecipientApprovalRequest job={job} comment={comment} />)
  }
}

// 5. Request approval to compliance secretariat
export async function getSecretariatApprovalRequestEmailHtml(job: TransactionEmailPayload, comment: string) {
  return {
    subject: `[QAS Compliance Office] ${job.project.name}, Responded QA Entry ${job.id}`,
    recipient: job.complianceSecretariat.emailAddress || "rlwalog@dmcihomes.com",
    template: await render(<SecretariatApprovalRequest job={job} comment={comment} />)
  }
}

// 6. Request supervisor approval for closing
export async function getSupervisorForClosingRequestEmailHtml(job: TransactionEmailPayload, comment: string) {
  return {
    subject: `[QAS Compliance Office] ${job.project.name}, Closing Request QA Entry ${job.id}`,
    recipient: job.supervisor.emailAddress || "rlwalog@dmcihomes.com",
    template: await render(<SupervisorForClosingRequest job={job} comment={comment} />)
  }
}

// 7. Supervisor Closed
export async function getSupervisorForClosingApprovedEmailHtml(job: TransactionEmailPayload, comment: string) {
  return {
    subject: `[QAS Compliance Office] ${job.project.name}, Approved Closing Approval QA Entry ${job.id}`,
    recipient: job.complianceSecretariat.emailAddress || "rlwalog@dmcihomes.com",
    cc: job.supervisor.emailAddress || "",
    template: await render(<OfficerForClosingApproved job={job} comment={comment} />)
  }
}

// User Invitation Email
export async function getUserInvitationEmailHtml({ newUser, password }: { newUser: UserInfoPayload, password: string }) {
  return {
    subject: `[QAS Compliance Office] Account Activation Details ${newUser.employeeNumber}`,
    recipient: newUser.emailAddress || "rlwalog@dmcihomes.com",
    template: await render(<UserInvitationTemplate firstName={newUser.appSuiteEmployeeMaster.firstName} username={newUser.username} password={password} />)
  }
}

export async function getUpdateTrailEmailHtml({ data, message }: { data: UpdateTrailPayload, message: string }) {
  const recipientName = data.jobTransaction.recipient?.appSuiteEmployeeMaster.firstName
  return {
    subject: `[QAS Compliance Office] New comment for ${data.jobTransactionId}`,
    recipient: 'rlwalog@dmcihomes.com',
    template: await render(<TrailTemplate name={recipientName ?? ""} message={message} jobId={data.jobTransactionId.toString()} />)
  }
}

export async function getReviewTrailEmailHtml({ data, message }: { data: ReviewTrailPayload, message: string }) {
  const recipientName = data.jobTransaction.recipient?.appSuiteEmployeeMaster.firstName
  return {
    subject: `[QAS Compliance Office] New comment for ${data.jobTransactionId}`,
    recipient: 'rlwalog@dmcihomes.com',
    template: await render(<TrailTemplate name={recipientName ?? ""} message={message} jobId={data.jobTransactionId.toString()} />)
  }
}

export async function getReOpenSeriesRecipientEmailHtml(job: TransactionEmailPayload) {
  return {
    subject: `[QAS Compliance Office] ${job.project.name}, Re-open QA Entry ${job.id}`,
    recipient: job.recipient?.emailAddress || "rlwalog@dmcihomes.com",
    cc: job.complianceSecretariat.emailAddress || "",
    template: await render(<ReOpenSeriesRecipientNotif job={job} />)
  }
}