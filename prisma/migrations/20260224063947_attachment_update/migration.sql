/*
  Warnings:

  - You are about to drop the column `filePath` on the `Attachment` table. All the data in the column will be lost.
  - Added the required column `base64Data` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileType` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Made the column `jobTransactionId` on table `Attachment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fileName` on table `Attachment` required. This step will fail if there are existing NULL values in that column.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Attachment] ALTER COLUMN [jobTransactionId] INT NOT NULL;
ALTER TABLE [dbo].[Attachment] ALTER COLUMN [fileName] NVARCHAR(255) NOT NULL;
ALTER TABLE [dbo].[Attachment] DROP COLUMN [filePath];
ALTER TABLE [dbo].[Attachment] ADD [base64Data] NVARCHAR(max) NOT NULL,
[fileSize] INT NOT NULL,
[fileType] NVARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[Attachment] ADD CONSTRAINT [Attachment_jobTransactionId_fkey] FOREIGN KEY ([jobTransactionId]) REFERENCES [dbo].[JobTransaction]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
