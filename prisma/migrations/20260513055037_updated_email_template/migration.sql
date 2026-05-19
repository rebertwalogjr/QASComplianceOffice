/*
  Warnings:

  - Added the required column `description` to the `EmailTemplate` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[EmailTemplate] ADD [description] NVARCHAR(500) NOT NULL,
[isActive] BIT NOT NULL CONSTRAINT [EmailTemplate_isActive_df] DEFAULT 1;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
