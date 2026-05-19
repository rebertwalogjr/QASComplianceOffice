BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[EmailTemplate] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [subject] NVARCHAR(500) NOT NULL,
    [content] NVARCHAR(max) NOT NULL,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [EmailTemplate_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME2 NOT NULL,
    CONSTRAINT [EmailTemplate_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [EmailTemplate_name_key] UNIQUE NONCLUSTERED ([name])
);

-- AddForeignKey
ALTER TABLE [dbo].[EmailTemplate] ADD CONSTRAINT [EmailTemplate_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[EmailTemplate] ADD CONSTRAINT [EmailTemplate_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
