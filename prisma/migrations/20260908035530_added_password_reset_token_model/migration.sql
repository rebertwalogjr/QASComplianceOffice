/*
  Warnings:

  - You are about to drop the column `code` on the `CodeHistory` table. All the data in the column will be lost.
  - Added the required column `codeHash` to the `CodeHistory` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[CodeHistory] DROP COLUMN [code];
ALTER TABLE [dbo].[CodeHistory] ADD [codeHash] NVARCHAR(128) NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[PasswordResetToken] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [tokenHash] NVARCHAR(128) NOT NULL,
    [expiresOn] DATETIME NOT NULL,
    [verifiedOn] DATETIME,
    [usedOn] DATETIME,
    [createdOn] DATETIME NOT NULL CONSTRAINT [PasswordResetToken_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [PasswordResetToken_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [PasswordResetToken_tokenHash_key] UNIQUE NONCLUSTERED ([tokenHash])
);

-- AddForeignKey
ALTER TABLE [dbo].[PasswordResetToken] ADD CONSTRAINT [PasswordResetToken_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
