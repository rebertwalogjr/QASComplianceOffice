/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedBy` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedOn` on the `Role` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Role] DROP CONSTRAINT [Role_createdBy_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Role] DROP CONSTRAINT [Role_modifiedBy_fkey];

-- AlterTable
ALTER TABLE [dbo].[Role] DROP COLUMN [createdBy],
[modifiedBy],
[modifiedOn];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
