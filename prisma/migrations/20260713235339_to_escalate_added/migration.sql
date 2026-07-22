BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[AuditTrail] DROP CONSTRAINT [AuditTrail_createdOn_df];
ALTER TABLE [dbo].[AuditTrail] ADD CONSTRAINT [AuditTrail_createdOn_df] DEFAULT CURRENT_TIMESTAMP FOR [createdOn];

-- AlterTable
ALTER TABLE [dbo].[JobTransaction] ADD [toEscalate] BIT NOT NULL CONSTRAINT [JobTransaction_toEscalate_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
