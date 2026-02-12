BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[UserGroup] (
    [userId] INT NOT NULL,
    [groupId] INT NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [UserGroup_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [UserGroup_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME NOT NULL,
    CONSTRAINT [UserGroup_pkey] PRIMARY KEY CLUSTERED ([userId],[groupId])
);

-- CreateTable
CREATE TABLE [dbo].[UserProject] (
    [userId] INT NOT NULL,
    [projectId] INT NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [UserProject_isActive_df] DEFAULT 1,
    [createdBy] INT NOT NULL,
    [createdOn] DATETIME NOT NULL CONSTRAINT [UserProject_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [modifiedBy] INT,
    [modifiedOn] DATETIME NOT NULL,
    CONSTRAINT [UserProject_pkey] PRIMARY KEY CLUSTERED ([userId],[projectId])
);

-- AddForeignKey
ALTER TABLE [dbo].[UserGroup] ADD CONSTRAINT [UserGroup_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserGroup] ADD CONSTRAINT [UserGroup_groupId_fkey] FOREIGN KEY ([groupId]) REFERENCES [dbo].[Group]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserGroup] ADD CONSTRAINT [UserGroup_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserGroup] ADD CONSTRAINT [UserGroup_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserProject] ADD CONSTRAINT [UserProject_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserProject] ADD CONSTRAINT [UserProject_projectId_fkey] FOREIGN KEY ([projectId]) REFERENCES [dbo].[Project]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserProject] ADD CONSTRAINT [UserProject_createdBy_fkey] FOREIGN KEY ([createdBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[UserProject] ADD CONSTRAINT [UserProject_modifiedBy_fkey] FOREIGN KEY ([modifiedBy]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
