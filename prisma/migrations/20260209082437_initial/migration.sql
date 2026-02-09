BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AppSuiteEmployeeMaster] (
    [employeeNumber] NVARCHAR(10) NOT NULL,
    [lastName] NVARCHAR(255) NOT NULL,
    [firstName] NVARCHAR(255) NOT NULL,
    [middleName] NVARCHAR(255),
    [fullName] NVARCHAR(255) NOT NULL,
    [emailAddress] NVARCHAR(255),
    [department] NVARCHAR(255),
    [position] NVARCHAR(255),
    [isActive] BIT NOT NULL CONSTRAINT [AppSuiteEmployeeMaster_isActive_df] DEFAULT 1,
    [addedOn] DATETIME NOT NULL CONSTRAINT [AppSuiteEmployeeMaster_addedOn_df] DEFAULT CURRENT_TIMESTAMP,
    [inactiveOn] DATETIME,
    CONSTRAINT [AppSuiteEmployeeMaster_pkey] PRIMARY KEY CLUSTERED ([employeeNumber])
);

-- CreateTable
CREATE TABLE [dbo].[AuditEngagement] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [name] NVARCHAR(50) NOT NULL,
    [companyId] INT NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [AuditEngagement_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [AuditEngagement_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME NOT NULL,
    CONSTRAINT [AuditEngagement_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AuditEngagement_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Company] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [name] NVARCHAR(255) NOT NULL,
    [code] NVARCHAR(15) NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [Company_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [Company_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME NOT NULL,
    CONSTRAINT [Company_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Company_name_key] UNIQUE NONCLUSTERED ([name]),
    CONSTRAINT [Company_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[FindingCategory] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [name] NVARCHAR(50) NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [FindingCategory_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [FindingCategory_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME NOT NULL,
    CONSTRAINT [FindingCategory_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [FindingCategory_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[JobTransaction] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [jobStatus] NVARCHAR(50),
    [companyId] INT NOT NULL,
    [projectId] INT NOT NULL,
    [auditEngagementId] INT NOT NULL,
    [typeOfFindingId] INT NOT NULL,
    [findingCategoryId] INT NOT NULL,
    [complianceSecretariatId] INT NOT NULL,
    [complianceOfficerId] INT,
    [supervisorId] INT NOT NULL,
    [auditReportId] INT NOT NULL,
    [auditFindingNumber] NVARCHAR(100) NOT NULL,
    [issuedOn] DATETIME,
    [targetDate] DATETIME,
    [auditRatingId] INT NOT NULL,
    [projectManagerDepartmentHead] NVARCHAR(100),
    [responsibleDepartment] NVARCHAR(255),
    [responsiblePerson] NVARCHAR(255),
    [recurringPerProcess] BIT NOT NULL CONSTRAINT [JobTransaction_recurringPerProcess_df] DEFAULT 0,
    [recurringPerPerson] BIT NOT NULL CONSTRAINT [JobTransaction_recurringPerPerson_df] DEFAULT 0,
    [recipientGroupId] INT,
    [recipientId] INT,
    [problemCriteria] NVARCHAR(max),
    [problemFindings] NVARCHAR(max),
    [recommendations] NVARCHAR(max),
    [verifiedBy] INT,
    [verifiedOn] DATETIME,
    [approvedBy] INT,
    [approvedOn] DATETIME,
    [correctiveAction] NVARCHAR(max),
    [correctiveCommitmentDate] DATETIME,
    [preventiveAction] NVARCHAR(max),
    [preventiveCommitmentDate] DATETIME,
    [deemedAccepted] BIT NOT NULL CONSTRAINT [JobTransaction_deemedAccepted_df] DEFAULT 0,
    [approvedForClosing] BIT NOT NULL CONSTRAINT [JobTransaction_approvedForClosing_df] DEFAULT 0,
    [endorsedForApproval] BIT NOT NULL CONSTRAINT [JobTransaction_endorsedForApproval_df] DEFAULT 0,
    [onHold] BIT NOT NULL CONSTRAINT [JobTransaction_onHold_df] DEFAULT 0,
    [isActive] BIT NOT NULL CONSTRAINT [JobTransaction_isActive_df] DEFAULT 1,
    [cancelledOn] DATETIME,
    [closedOn] DATETIME,
    [hasBeenReadByAssignee] BIT NOT NULL CONSTRAINT [JobTransaction_hasBeenReadByAssignee_df] DEFAULT 0,
    [readByAssigneeOn] DATETIME,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [JobTransaction_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME NOT NULL,
    CONSTRAINT [JobTransaction_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Project] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [name] NVARCHAR(100) NOT NULL,
    [code] NVARCHAR(10) NOT NULL,
    [companyId] INT NOT NULL,
    [remarks] NVARCHAR(255),
    [isActive] BIT NOT NULL CONSTRAINT [Project_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [Project_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME NOT NULL,
    CONSTRAINT [Project_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Project_name_key] UNIQUE NONCLUSTERED ([name]),
    CONSTRAINT [Project_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[TypeOfFinding] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [name] NVARCHAR(50) NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [TypeOfFinding_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [TypeOfFinding_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME NOT NULL,
    CONSTRAINT [TypeOfFinding_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [TypeOfFinding_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Attachment] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [jobTransactionId] INT,
    [fileName] NVARCHAR(255),
    [filePath] NVARCHAR(255),
    [fromRecipient] BIT NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [Attachment_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [Attachment_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME NOT NULL,
    CONSTRAINT [Attachment_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Group] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [name] NVARCHAR(100) NOT NULL,
    [code] NVARCHAR(10) NOT NULL,
    [projectId] INT NOT NULL,
    [inCharge] NVARCHAR(100) NOT NULL,
    [emailAddress] NVARCHAR(255) NOT NULL,
    [remarks] NVARCHAR(255),
    [isActive] BIT NOT NULL CONSTRAINT [Group_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [Group_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME NOT NULL,
    CONSTRAINT [Group_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Group_name_key] UNIQUE NONCLUSTERED ([name]),
    CONSTRAINT [Group_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [employeeNumber] NVARCHAR(10) NOT NULL,
    [username] NVARCHAR(100) NOT NULL,
    [password] NVARCHAR(100) NOT NULL,
    [emailAddress] NVARCHAR(255),
    [accessId] INT NOT NULL,
    [companyId] INT,
    [position] NVARCHAR(100),
    [escalation1] INT,
    [escalation2] INT,
    [escalation3] INT,
    [escalation4] INT,
    [receiveNotifications] BIT NOT NULL CONSTRAINT [User_receiveNotifications_df] DEFAULT 0,
    [isEscalation] BIT NOT NULL CONSTRAINT [User_isEscalation_df] DEFAULT 0,
    [isActive] BIT NOT NULL CONSTRAINT [User_isActive_df] DEFAULT 1,
    [createdBy] INT,
    [createdOn] DATETIME NOT NULL CONSTRAINT [User_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_employeeNumber_key] UNIQUE NONCLUSTERED ([employeeNumber]),
    CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[AuditReport] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [name] NVARCHAR(100) NOT NULL,
    [companyId] INT NOT NULL,
    [auditEngagementId] INT NOT NULL,
    [projectId] INT NOT NULL,
    [isClosed] BIT NOT NULL CONSTRAINT [AuditReport_isClosed_df] DEFAULT 0,
    [isActive] BIT NOT NULL CONSTRAINT [AuditReport_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [AuditReport_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME NOT NULL,
    CONSTRAINT [AuditReport_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AuditReport_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[AuditRating] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [name] NVARCHAR(50) NOT NULL,
    [companyId] INT NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [AuditRating_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [AuditRating_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME NOT NULL,
    CONSTRAINT [AuditRating_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Holiday] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [name] NVARCHAR(255) NOT NULL,
    [type] NVARCHAR(25) NOT NULL,
    [date] DATETIME NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [Holiday_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [Holiday_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME NOT NULL,
    CONSTRAINT [Holiday_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[AuditEngagement] ADD CONSTRAINT [AuditEngagement_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditEngagement] ADD CONSTRAINT [AuditEngagement_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditEngagement] ADD CONSTRAINT [AuditEngagement_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Company] ADD CONSTRAINT [Company_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Company] ADD CONSTRAINT [Company_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[FindingCategory] ADD CONSTRAINT [FindingCategory_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[FindingCategory] ADD CONSTRAINT [FindingCategory_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_projectId_fkey] FOREIGN KEY ([projectId]) REFERENCES [dbo].[Project]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_auditEngagementId_fkey] FOREIGN KEY ([auditEngagementId]) REFERENCES [dbo].[AuditEngagement]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_typeOfFindingId_fkey] FOREIGN KEY ([typeOfFindingId]) REFERENCES [dbo].[TypeOfFinding]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_findingCategoryId_fkey] FOREIGN KEY ([findingCategoryId]) REFERENCES [dbo].[FindingCategory]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_recipientGroupId_fkey] FOREIGN KEY ([recipientGroupId]) REFERENCES [dbo].[Group]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_auditReportId_fkey] FOREIGN KEY ([auditReportId]) REFERENCES [dbo].[AuditReport]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_recipientId_fkey] FOREIGN KEY ([recipientId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_complianceSecretariatId_fkey] FOREIGN KEY ([complianceSecretariatId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_complianceOfficerId_fkey] FOREIGN KEY ([complianceOfficerId]) REFERENCES [dbo].[User]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_supervisorId_fkey] FOREIGN KEY ([supervisorId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_verifiedBy_fkey] FOREIGN KEY ([verifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_approvedBy_fkey] FOREIGN KEY ([approvedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [Project_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [Project_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Project] ADD CONSTRAINT [Project_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TypeOfFinding] ADD CONSTRAINT [TypeOfFinding_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[TypeOfFinding] ADD CONSTRAINT [TypeOfFinding_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Attachment] ADD CONSTRAINT [Attachment_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Attachment] ADD CONSTRAINT [Attachment_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Group] ADD CONSTRAINT [Group_projectId_fkey] FOREIGN KEY ([projectId]) REFERENCES [dbo].[Project]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Group] ADD CONSTRAINT [Group_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Group] ADD CONSTRAINT [Group_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_escalation1_fkey] FOREIGN KEY ([escalation1]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_escalation2_fkey] FOREIGN KEY ([escalation2]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_escalation3_fkey] FOREIGN KEY ([escalation3]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_escalation4_fkey] FOREIGN KEY ([escalation4]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_employeeNumber_fkey] FOREIGN KEY ([employeeNumber]) REFERENCES [dbo].[AppSuiteEmployeeMaster]([employeeNumber]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditReport] ADD CONSTRAINT [AuditReport_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditReport] ADD CONSTRAINT [AuditReport_auditEngagementId_fkey] FOREIGN KEY ([auditEngagementId]) REFERENCES [dbo].[AuditEngagement]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditReport] ADD CONSTRAINT [AuditReport_projectId_fkey] FOREIGN KEY ([projectId]) REFERENCES [dbo].[Project]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditReport] ADD CONSTRAINT [AuditReport_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditReport] ADD CONSTRAINT [AuditReport_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditRating] ADD CONSTRAINT [AuditRating_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditRating] ADD CONSTRAINT [AuditRating_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditRating] ADD CONSTRAINT [AuditRating_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Holiday] ADD CONSTRAINT [Holiday_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Holiday] ADD CONSTRAINT [Holiday_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
