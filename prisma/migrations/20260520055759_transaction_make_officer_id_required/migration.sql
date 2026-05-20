/*
  Warnings:

  - Made the column `complianceOfficerId` on table `JobTransaction` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[JobTransaction] DROP CONSTRAINT [JobTransaction_complianceOfficerId_fkey];

-- AlterTable
ALTER TABLE [dbo].[JobTransaction] ALTER COLUMN [complianceOfficerId] INT NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_complianceOfficerId_fkey] FOREIGN KEY ([complianceOfficerId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
