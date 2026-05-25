/*
  Warnings:

  - A unique constraint covering the columns `[name,companyId]` on the table `AuditRating` will be added. If there are existing duplicate values, this will fail.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateIndex
ALTER TABLE [dbo].[AuditRating] ADD CONSTRAINT [AuditRating_name_companyId_key] UNIQUE NONCLUSTERED ([name], [companyId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
