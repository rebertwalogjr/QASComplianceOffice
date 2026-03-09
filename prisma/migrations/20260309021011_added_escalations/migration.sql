BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[JobTransaction] ADD [jobEscalation1] INT,
[jobEscalation2] INT,
[jobEscalation3] INT,
[jobEscalation4] INT;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_jobEscalation1_fkey] FOREIGN KEY ([jobEscalation1]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_jobEscalation2_fkey] FOREIGN KEY ([jobEscalation2]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_jobEscalation3_fkey] FOREIGN KEY ([jobEscalation3]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_jobEscalation4_fkey] FOREIGN KEY ([jobEscalation4]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
