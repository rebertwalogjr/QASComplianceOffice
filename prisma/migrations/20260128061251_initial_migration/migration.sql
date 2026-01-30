BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AppSuiteEmployeeMaster] (
    [employeeNumber] NVARCHAR(10) NOT NULL,
    [lastName] NVARCHAR(255) NOT NULL,
    [firstName] NVARCHAR(255) NOT NULL,
    [middleName] NVARCHAR(255),
    [fullName] NVARCHAR(255) NOT NULL,
    [emailAddress] NVARCHAR(255) NOT NULL,
    [department] NVARCHAR(255),
    [position] NVARCHAR(255),
    [isActive] BIT NOT NULL CONSTRAINT [AppSuiteEmployeeMaster_isActive_df] DEFAULT 1,
    [addedOn] DATETIME NOT NULL CONSTRAINT [AppSuiteEmployeeMaster_addedOn_df] DEFAULT CURRENT_TIMESTAMP,
    [inactiveOn] DATETIME,
    CONSTRAINT [AppSuiteEmployeeMaster_pkey] PRIMARY KEY CLUSTERED ([employeeNumber]),
    CONSTRAINT [AppSuiteEmployeeMaster_emailAddress_key] UNIQUE NONCLUSTERED ([emailAddress])
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
    [modifiedOn] DATETIME2 NOT NULL,
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
    [modifiedOn] DATETIME2 NOT NULL,
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
    [modifiedOn] DATETIME2 NOT NULL,
    CONSTRAINT [FindingCategory_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [FindingCategory_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[JobTransaction] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [jobStatus] NVARCHAR(50),
    [companyId] INT NOT NULL,
    [projectDepartmentId] INT NOT NULL,
    [auditEngagementId] INT NOT NULL,
    [typeOfFindingId] INT NOT NULL,
    [findingCategoryId] INT NOT NULL,
    [complianceSecretariat] INT NOT NULL,
    [complianceOfficer] INT,
    [supervisor] INT NOT NULL,
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
    [recipient] INT,
    [escalation1] INT,
    [escalation2] INT,
    [escalation3] INT,
    [escalation4] INT,
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
    [modifiedOn] DATETIME2 NOT NULL,
    CONSTRAINT [JobTransaction_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ProjectDepartmentList] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [name] NVARCHAR(100) NOT NULL,
    [code] NVARCHAR(10) NOT NULL,
    [companyId] INT NOT NULL,
    [remarks] NVARCHAR(255),
    [isActive] BIT NOT NULL CONSTRAINT [ProjectDepartmentList_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [ProjectDepartmentList_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME2 NOT NULL,
    CONSTRAINT [ProjectDepartmentList_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ProjectDepartmentList_name_key] UNIQUE NONCLUSTERED ([name]),
    CONSTRAINT [ProjectDepartmentList_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[TypeOfFinding] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [name] NVARCHAR(50) NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [TypeOfFinding_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [TypeOfFinding_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME2 NOT NULL,
    CONSTRAINT [TypeOfFinding_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [TypeOfFinding_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[Attachments] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [jobTransactionId] INT,
    [fileName] NVARCHAR(255),
    [filePath] NVARCHAR(255),
    [fromRecipient] BIT NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [Attachments_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [Attachments_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME2 NOT NULL,
    CONSTRAINT [Attachments_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[GroupList] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [name] NVARCHAR(100) NOT NULL,
    [code] NVARCHAR(10) NOT NULL,
    [inChargeId] NVARCHAR(100) NOT NULL,
    [projectDepartmentId] INT NOT NULL,
    [emailAddress] NVARCHAR(255) NOT NULL,
    [remarks] NVARCHAR(255),
    [isActive] BIT NOT NULL CONSTRAINT [GroupList_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [GroupList_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME2 NOT NULL,
    CONSTRAINT [GroupList_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [GroupList_name_key] UNIQUE NONCLUSTERED ([name]),
    CONSTRAINT [GroupList_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[Users] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [employeeNumber] NVARCHAR(10) NOT NULL,
    [username] NVARCHAR(100) NOT NULL,
    [password] NVARCHAR(100) NOT NULL,
    [emailAddress] NVARCHAR(255),
    [accessId] INT NOT NULL,
    [companyId] INT NOT NULL,
    [position] NVARCHAR(100),
    [escalation1] INT,
    [escalation2] INT,
    [escalation3] INT,
    [escalation4] INT,
    [receiveNotifications] BIT NOT NULL CONSTRAINT [Users_receiveNotifications_df] DEFAULT 0,
    [isEscalation] BIT NOT NULL CONSTRAINT [Users_isEscalation_df] DEFAULT 0,
    [isActive] BIT NOT NULL CONSTRAINT [Users_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [Users_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME2 NOT NULL,
    CONSTRAINT [Users_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Users_employeeNumber_key] UNIQUE NONCLUSTERED ([employeeNumber]),
    CONSTRAINT [Users_username_key] UNIQUE NONCLUSTERED ([username])
);

-- CreateTable
CREATE TABLE [dbo].[AuditReport] (
    [id] INT NOT NULL IDENTITY(1001,1),
    [name] NVARCHAR(100) NOT NULL,
    [companyId] INT NOT NULL,
    [auditEngagementId] INT NOT NULL,
    [projectDepartmentId] INT NOT NULL,
    [isClosed] BIT NOT NULL CONSTRAINT [AuditReport_isClosed_df] DEFAULT 0,
    [isActive] BIT NOT NULL CONSTRAINT [AuditReport_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [AuditReport_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME2 NOT NULL,
    CONSTRAINT [AuditReport_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AuditReport_name_key] UNIQUE NONCLUSTERED ([name])
);

-- AddForeignKey
ALTER TABLE [dbo].[AuditEngagement] ADD CONSTRAINT [AuditEngagement_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_projectDepartmentId_fkey] FOREIGN KEY ([projectDepartmentId]) REFERENCES [dbo].[ProjectDepartmentList]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_auditEngagementId_fkey] FOREIGN KEY ([auditEngagementId]) REFERENCES [dbo].[AuditEngagement]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_typeOfFindingId_fkey] FOREIGN KEY ([typeOfFindingId]) REFERENCES [dbo].[TypeOfFinding]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_findingCategoryId_fkey] FOREIGN KEY ([findingCategoryId]) REFERENCES [dbo].[FindingCategory]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ProjectDepartmentList] ADD CONSTRAINT [ProjectDepartmentList_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[GroupList] ADD CONSTRAINT [GroupList_projectDepartmentId_fkey] FOREIGN KEY ([projectDepartmentId]) REFERENCES [dbo].[ProjectDepartmentList]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Users] ADD CONSTRAINT [Users_employeeNumber_fkey] FOREIGN KEY ([employeeNumber]) REFERENCES [dbo].[AppSuiteEmployeeMaster]([employeeNumber]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Users] ADD CONSTRAINT [Users_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditReport] ADD CONSTRAINT [AuditReport_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditReport] ADD CONSTRAINT [AuditReport_auditEngagementId_fkey] FOREIGN KEY ([auditEngagementId]) REFERENCES [dbo].[AuditEngagement]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditReport] ADD CONSTRAINT [AuditReport_projectDepartmentId_fkey] FOREIGN KEY ([projectDepartmentId]) REFERENCES [dbo].[ProjectDepartmentList]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
