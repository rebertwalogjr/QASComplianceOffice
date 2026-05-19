import { Body, Button, Container, Heading, Html, Text, Tailwind, Section, Row, Column, render } from 'react-email'
import { TransactionBasicPaylod } from '@/server-actions/transaction';

interface ApprovalEmailProps {
  seriesId: string;
  creator: string;
  projectName: string;
}

const EmailLayout = ({ children }: { children: React.ReactNode }) => (
  <Tailwind>
    <Html>
      <Body>
        <Container className='bg-white m-4'>
          {children}
        </Container>
      </Body>
    </Html>
  </Tailwind>
)

const genlink = (series: string) => {
  return `http://localhost:3000/qas/${series}`
}

// Newly created findings: Open
export const NewFindingCreated = ({ job }: { job: any }) => (
  <html>
    <body>
      <div className='bg-white m-4'>
        <p>Hi, {job.creator},</p>
        <br />
        <p>You have successfully created a finding <strong>{job.id}</strong></p>
        <br />
        <table className='w-full border-separate border'>
          <tbody>
            <tr>
              <td className='border p-1 align-text-top w-1/3'>Series number</td>
              <td className='border p-1 align-text-top'>1001</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Finding number</td>
              <td className='border p-1 align-text-top'>IAD-REPORT-2025-7-6</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit engagement</td>
              <td className='border p-1 align-text-top'>Compliance Testing and Review</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Type of finding</td>
              <td className='border p-1 align-text-top'>Non-compliance</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Findings category</td>
              <td className='border p-1 align-text-top'>Operations</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit rating</td>
              <td className='border p-1 align-text-top'>Critical</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Details of finding</td>
              <td className='border p-1 align-text-top'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint similique veniam tempora nobis, fugit consequuntur iusto id unde ea magnam sit, voluptatibus exercitationem, aut corporis neque soluta a dicta aliquam.</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>While waiting to complete, you can review your series by clicking the link below.</p>
        <a href={genlink(job.id)} className='text-primary underline' target='_blank'>{genlink(job.id)}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p className='text-red-500'>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

// Compliance Secretariat to Superisor: Open
export const SupervisorVerificationRequest = ({ job }: { job: any }) => (
  <html>
    <body>
      <div className='bg-white m-4'>
        <p>Hi, {job.creator},</p>
        <br />
        <p>This is to notify you that the finding is waiting for your review and verification.</p>
        <br />
        <table className='w-full border-separate border'>
          <tbody>
            <tr>
              <td className='border p-1 align-text-top w-1/3'>Series number</td>
              <td className='border p-1 align-text-top'>1001</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Finding number</td>
              <td className='border p-1 align-text-top'>IAD-REPORT-2025-7-6</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit engagement</td>
              <td className='border p-1 align-text-top'>Compliance Testing and Review</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Type of finding</td>
              <td className='border p-1 align-text-top'>Non-compliance</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Findings category</td>
              <td className='border p-1 align-text-top'>Operations</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit rating</td>
              <td className='border p-1 align-text-top'>Critical</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Details of finding</td>
              <td className='border p-1 align-text-top'>test</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Please click the link below</p>
        <a href={genlink(job.id)} className='text-primary underline' target='_blank'>{genlink(job.id)}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p className='text-red-500'>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

// Supervisor to Alternate Compliance Officer: Open
export const OfficerApprovalRequest = ({ job }: { job: any }) => (
  <html>
    <body>
      <div className='bg-white m-4'>
        <p>Hi, {job.creator},</p>
        <br />
        <p>This is to notify you that the finding has been verified by the supervisor and is waiting for your approval.</p>
        <br />
        <table className='w-full border-separate border'>
          <tbody>
            <tr>
              <td className='border p-1 align-text-top w-1/3'>Series number</td>
              <td className='border p-1 align-text-top'>1001</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Finding number</td>
              <td className='border p-1 align-text-top'>IAD-REPORT-2025-7-6</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit engagement</td>
              <td className='border p-1 align-text-top'>Compliance Testing and Review</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Type of finding</td>
              <td className='border p-1 align-text-top'>Non-compliance</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Findings category</td>
              <td className='border p-1 align-text-top'>Operations</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit rating</td>
              <td className='border p-1 align-text-top'>Critical</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Details of finding</td>
              <td className='border p-1 align-text-top'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque quae enim aliquam, deleniti sunt, quos tempora aspernatur soluta amet labore, hic asperiores quasi ex. Alias earum atque itaque quidem a.</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Last comment by supervisor</td>
              <td className='border p-1 align-text-top'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit ad id numquam ipsam quae, quos provident earum, ducimus odit illum distinctio quidem! Harum, dicta nihil! Voluptate, eveniet adipisci. Repudiandae, minima!</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Please click the link below</p>
        <a href={genlink(job.id)} className='text-primary underline' target='_blank'>{genlink(job.id)}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p className='text-red-500'>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

// Alternate Compliance Officer: Open
export const FindingsApproved = ({ job }: { job: any }) => (
  <html>
    <body>
      <div className='bg-white m-4'>
        <p>Hi, {job.creator},</p>
        <br />
        <p>This is to notify you that the finding has been endorsed for approval.</p>
        <br />
        <table className='w-full border-separate border'>
          <tbody>
            <tr>
              <td className='border p-1 align-text-top w-1/3'>Series number</td>
              <td className='border p-1 align-text-top'>1001</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Finding number</td>
              <td className='border p-1 align-text-top'>IAD-REPORT-2025-7-6</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit engagement</td>
              <td className='border p-1 align-text-top'>Compliance Testing and Review</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Type of finding</td>
              <td className='border p-1 align-text-top'>Non-compliance</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Findings category</td>
              <td className='border p-1 align-text-top'>Operations</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit rating</td>
              <td className='border p-1 align-text-top'>Critical</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Details of finding</td>
              <td className='border p-1 align-text-top'>test</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Last comment by supervisor</td>
              <td className='border p-1 align-text-top'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit ad id numquam ipsam quae, quos provident earum, ducimus odit illum distinctio quidem! Harum, dicta nihil! Voluptate, eveniet adipisci. Repudiandae, minima!</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Please click the link below</p>
        <a href={genlink(job.id)} className='text-primary underline' target='_blank'>{genlink(job.id)}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p className='text-red-500'>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

// Alternate Compliance Officer to Recipient: Open
export const RecipientApprovalRequest = ({ job }: { job: any }) => (
  <html>
    <body>
      <div className='bg-white m-4'>
        <p>Hi, {job.creator},</p>
        <br />
        <p>This is to notify you that the finding has been approved. Kindly respond to the finding within 2 working days in accordance with the requirement of QM-PR-004 Handling of Audit Findings</p>
        <br />
        <table className='w-full border-separate border'>
          <tbody>
            <tr>
              <td className='border p-1 align-text-top w-1/3'>Series number</td>
              <td className='border p-1 align-text-top'>1001</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Finding number</td>
              <td className='border p-1 align-text-top'>IAD-REPORT-2025-7-6</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit engagement</td>
              <td className='border p-1 align-text-top'>Compliance Testing and Review</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Type of finding</td>
              <td className='border p-1 align-text-top'>Non-compliance</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Findings category</td>
              <td className='border p-1 align-text-top'>Operations</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit rating</td>
              <td className='border p-1 align-text-top'>Critical</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Details of finding</td>
              <td className='border p-1 align-text-top'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, ab eveniet blanditiis nam, quia quos rerum quod nostrum cum magni impedit harum officia reprehenderit delectus sit quae enim. Quasi, quis.S</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Please click the link below</p>
        <a href={genlink(job.id)} className='text-primary underline' target='_blank'>{genlink(job.id)}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p className='text-red-500'>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

// Recipient to Compliance Secretariat: Accepted
export const SecretariatApprovalRequest = ({ job }: { job: any }) => (
  <html>
    <body>
      <div className='bg-white m-4'>
        <p>Hi, {job.creator},</p>
        <br />
        <p>This is to notify you that the finding has been responded by the auditee and is waiting for your action.</p>
        <br />
        <table className='w-full border-separate border'>
          <tbody>
            <tr>
              <td className='border p-1 align-text-top w-1/3'>Series number</td>
              <td className='border p-1 align-text-top'>1001</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Finding number</td>
              <td className='border p-1 align-text-top'>IAD-REPORT-2025-7-6</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit engagement</td>
              <td className='border p-1 align-text-top'>Compliance Testing and Review</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Type of finding</td>
              <td className='border p-1 align-text-top'>Non-compliance</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Findings category</td>
              <td className='border p-1 align-text-top'>Operations</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit rating</td>
              <td className='border p-1 align-text-top'>Critical</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Details of finding</td>
              <td className='border p-1 align-text-top'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum, dolorem. Pariatur eos temporibus, consectetur ea ducimus delectus facere in ullam repellat, adipisci deserunt aut. Quasi veniam a fugit magni recusandae?</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Corrective Action</td>
              <td className='border p-1 align-text-top'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui, temporibus numquam corrupti optio ipsum nihil quae laudantium eos est sequi provident, praesentium inventore eius error ut magnam reiciendis quis ad.</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Preventive Action</td>
              <td className='border p-1 align-text-top'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam ad, animi harum nisi porro dolorem nulla eligendi expedita libero earum delectus deleniti voluptates sed voluptatum quasi sequi rem officia esse!</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Please click the link below</p>
        <a href={genlink(job.id)} className='text-primary underline' target='_blank'>{genlink(job.id)}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p className='text-red-500'>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

// Compliance Secretariat to Supervisor: Request Closing
export const SupervisorForClosingRequest = ({ job }: { job: any }) => (
  <html>
    <body>
      <div className='bg-white m-4'>
        <p>Hi, {job.creator},</p>
        <br />
        <p>This is to notify you that the Compliance Secretariat is requesting for your closing approval.</p>
        <br />
        <table className='w-full border-separate border'>
          <tbody>
            <tr>
              <td className='border p-1 align-text-top w-1/3'>Series number</td>
              <td className='border p-1 align-text-top'>1001</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Finding number</td>
              <td className='border p-1 align-text-top'>IAD-REPORT-2025-7-6</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit engagement</td>
              <td className='border p-1 align-text-top'>Compliance Testing and Review</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Type of finding</td>
              <td className='border p-1 align-text-top'>Non-compliance</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Findings category</td>
              <td className='border p-1 align-text-top'>Operations</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit rating</td>
              <td className='border p-1 align-text-top'>Critical</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Details of finding</td>
              <td className='border p-1 align-text-top'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum molestias optio quisquam eveniet, suscipit, odit accusamus quos, sint dolores saepe corporis cupiditate aliquam repellat consequuntur omnis neque. Saepe, illum deserunt.</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Compliance Secretariat:</td>
              <td className='border p-1 align-text-top'>Treber</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Last comment</td>
              <td className='border p-1 align-text-top'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Illum molestias optio quisquam eveniet, suscipit, odit accusamus quos, sint dolores saepe corporis cupiditate aliquam repellat consequuntur omnis neque. Saepe, illum deserunt.</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Please click the link below</p>
        <a href={genlink(job.id)} className='text-primary underline' target='_blank'>{genlink(job.id)}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p className='text-red-500'>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

// Supervisor: Closed
export const OfficerForClosingApproved = ({ job }: { job: any }) => (
  <html>
    <body>
      <div className='bg-white m-4'>
        <p>Hi, {job.creator},</p>
        <br />
        <p>This is to notify you that your request for closing approval has been approve</p>
        <br />
        <table className='w-full border-separate border'>
          <tbody>
            <tr>
              <td className='border p-1 align-text-top w-1/3'>Series number:</td>
              <td className='border p-1 align-text-top'>1001</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Finding number:</td>
              <td className='border p-1 align-text-top'>IAD-REPORT-2025-7-6</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit engagement:</td>
              <td className='border p-1 align-text-top'>Compliance Testing and Review</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Type of finding:</td>
              <td className='border p-1 align-text-top'>Non-compliance</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Findings category:</td>
              <td className='border p-1 align-text-top'>Operations</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Audit rating:</td>
              <td className='border p-1 align-text-top'>Critical</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Details of finding:</td>
              <td className='border p-1 align-text-top'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, sunt! Consequuntur ipsum, obcaecati minus dolore aut accusantium voluptates unde. Repellat rerum consequuntur aliquam commodi, harum dicta nostrum magni sequi asperiores?</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Corrective Action</td>
              <td className='border p-1 align-text-top'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui, temporibus numquam corrupti optio ipsum nihil quae laudantium eos est sequi provident, praesentium inventore eius error ut magnam reiciendis quis ad.</td>
            </tr>
            <tr>
              <td className='border p-1 align-text-top'>Preventive Action</td>
              <td className='border p-1 align-text-top'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nam ad, animi harum nisi porro dolorem nulla eligendi expedita libero earum delectus deleniti voluptates sed voluptatum quasi sequi rem officia esse!</td>
            </tr>
          </tbody>
        </table>
        <br />
        <p>Please click the link below</p>
        <a href={genlink(job.id)} className='text-primary underline' target='_blank'>{genlink(job.id)}</a>
        <br />
        <br />
        <p>Regards,</p>
        <p>QA Audit System Administrator</p>
        <br />
        <p className='text-red-500'>*** This is a system generated email, please do not reply ***</p>
      </div>
    </body>
  </html>
)

export const NewlyCreatedTemplate = ({ job }: { job: TransactionBasicPaylod }) => (
  <EmailLayout>
    <Section className='border'>
      <Section className='m-4'>
        <Text>Hi {job.creator.appSuiteEmployeeMaster.fullName},</Text>
        <Text>You successfully created series #<strong>{job.id}</strong></Text>
        <Text>While waiting to complete you can review your series by clicking the button below.</Text>
        <Button
          className='bg-primary text-white text-sm rounded-3xl px-4 py-2 hover:bg-primary/90'
          href={genlink(job.id.toString())}
        >
          View Series
        </Button>
      </Section>
    </Section>
  </EmailLayout>
)

export async function getNewlyCreatedEmailHtml(job: TransactionBasicPaylod) {
  return await render(<NewlyCreatedTemplate job={job} />)
}