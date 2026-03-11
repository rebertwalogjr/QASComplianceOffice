BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[UpdateTrail] (
    [id] INT NOT NULL IDENTITY(1,1),
    [jobTransactionId] INT NOT NULL,
    [message] NVARCHAR(max) NOT NULL,
    [createdBy] INT NOT NULL,
    [createOn] DATETIME NOT NULL CONSTRAINT [UpdateTrail_createOn_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [UpdateTrail_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ReviewTrail] (
    [id] INT NOT NULL IDENTITY(1,1),
    [jobTransactionId] INT NOT NULL,
    [message] NVARCHAR(max) NOT NULL,
    [createdBy] INT NOT NULL,
    [createOn] DATETIME NOT NULL CONSTRAINT [ReviewTrail_createOn_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [ReviewTrail_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[UpdateTrail] ADD CONSTRAINT [UpdateTrail_jobTransactionId_fkey] FOREIGN KEY ([jobTransactionId]) REFERENCES [dbo].[JobTransaction]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UpdateTrail] ADD CONSTRAINT [UpdateTrail_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ReviewTrail] ADD CONSTRAINT [ReviewTrail_jobTransactionId_fkey] FOREIGN KEY ([jobTransactionId]) REFERENCES [dbo].[JobTransaction]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ReviewTrail] ADD CONSTRAINT [ReviewTrail_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
