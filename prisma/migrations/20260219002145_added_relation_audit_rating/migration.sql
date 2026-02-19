/*
  Warnings:

  - You are about to drop the column `accessId` on the `User` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] DROP COLUMN [accessId];

-- AddForeignKey
ALTER TABLE [dbo].[JobTransaction] ADD CONSTRAINT [JobTransaction_auditRatingId_fkey] FOREIGN KEY ([auditRatingId]) REFERENCES [dbo].[AuditRating]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
