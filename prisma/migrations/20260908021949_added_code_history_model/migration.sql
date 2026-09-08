BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[CodeHistory] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] INT NOT NULL,
    [code] NVARCHAR(100) NOT NULL,
    [expiresOn] DATETIME NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [CodeHistory_isActive_df] DEFAULT 1,
    [createdOn] DATETIME NOT NULL CONSTRAINT [CodeHistory_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [CodeHistory_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[CodeHistory] ADD CONSTRAINT [CodeHistory_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
