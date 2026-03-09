/*
  Warnings:

  - You are about to drop the column `jobStatus` on the `HoldingHistory` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[HoldingHistory] ALTER COLUMN [endedOn] DATETIME NULL;
ALTER TABLE [dbo].[HoldingHistory] ALTER COLUMN [endedBy] INT NULL;
ALTER TABLE [dbo].[HoldingHistory] DROP COLUMN [jobStatus];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
