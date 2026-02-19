BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AuditTrail] (
    [id] INT NOT NULL IDENTITY(1,1),
    [jobTransactionId] INT NOT NULL,
    [jobStatus] NVARCHAR(1000) NOT NULL,
    [actionTaken] NVARCHAR(1000) NOT NULL,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [AuditTrail_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [AuditTrail_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[AuditTrail] ADD CONSTRAINT [AuditTrail_jobTransactionId_fkey] FOREIGN KEY ([jobTransactionId]) REFERENCES [dbo].[JobTransaction]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[AuditTrail] ADD CONSTRAINT [AuditTrail_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
