BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[HoldingHistory] (
    [id] INT NOT NULL IDENTITY(1,1),
    [jobTransactionId] INT NOT NULL,
    [jobStatus] NVARCHAR(1000) NOT NULL,
    [holdFrom] DATETIME NOT NULL,
    [holdUntil] DATETIME NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [HoldingHistory_isActive_df] DEFAULT 1,
    [endedOn] DATETIME NOT NULL,
    [endedBy] INT NOT NULL,
    [createdBy] INT NOT NULL,
    [createOn] DATETIME NOT NULL CONSTRAINT [HoldingHistory_createOn_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [HoldingHistory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[HoldingHistory] ADD CONSTRAINT [HoldingHistory_jobTransactionId_fkey] FOREIGN KEY ([jobTransactionId]) REFERENCES [dbo].[JobTransaction]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[HoldingHistory] ADD CONSTRAINT [HoldingHistory_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[HoldingHistory] ADD CONSTRAINT [HoldingHistory_endedBy_fkey] FOREIGN KEY ([endedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
