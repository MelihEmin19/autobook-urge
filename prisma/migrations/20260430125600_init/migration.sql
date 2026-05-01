BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Service] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(120) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [price] DECIMAL(10,2) NOT NULL,
    [durationMin] INT NOT NULL,
    [isActive] BIT NOT NULL CONSTRAINT [Service_isActive_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Service_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Service_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Booking] (
    [id] INT NOT NULL IDENTITY(1,1),
    [code] NVARCHAR(12) NOT NULL,
    [customerName] NVARCHAR(120) NOT NULL,
    [phone] NVARCHAR(30) NOT NULL,
    [email] NVARCHAR(160) NOT NULL,
    [plate] NVARCHAR(20) NOT NULL,
    [serviceId] INT NOT NULL,
    [slotStart] DATETIME2 NOT NULL,
    [slotEnd] DATETIME2 NOT NULL,
    [status] NVARCHAR(20) NOT NULL CONSTRAINT [Booking_status_df] DEFAULT 'PENDING',
    [note] NVARCHAR(500),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Booking_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Booking_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Booking_code_key] UNIQUE NONCLUSTERED ([code])
);

-- CreateTable
CREATE TABLE [dbo].[AdminUser] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(160) NOT NULL,
    [passwordHash] NVARCHAR(200) NOT NULL,
    [name] NVARCHAR(120) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [AdminUser_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [AdminUser_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [AdminUser_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Setting] (
    [id] INT NOT NULL IDENTITY(1,1),
    [garageName] NVARCHAR(120) NOT NULL,
    [phone] NVARCHAR(30) NOT NULL,
    [address] NVARCHAR(300) NOT NULL,
    [slotMinutes] INT NOT NULL CONSTRAINT [Setting_slotMinutes_df] DEFAULT 30,
    CONSTRAINT [Setting_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[BusinessHour] (
    [id] INT NOT NULL IDENTITY(1,1),
    [dayOfWeek] INT NOT NULL,
    [openTime] NVARCHAR(5) NOT NULL,
    [closeTime] NVARCHAR(5) NOT NULL,
    [isClosed] BIT NOT NULL CONSTRAINT [BusinessHour_isClosed_df] DEFAULT 0,
    CONSTRAINT [BusinessHour_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [BusinessHour_dayOfWeek_key] UNIQUE NONCLUSTERED ([dayOfWeek])
);

-- CreateTable
CREATE TABLE [dbo].[ClosedDay] (
    [id] INT NOT NULL IDENTITY(1,1),
    [date] DATE NOT NULL,
    [reason] NVARCHAR(200),
    CONSTRAINT [ClosedDay_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ClosedDay_date_key] UNIQUE NONCLUSTERED ([date])
);

-- AddForeignKey
ALTER TABLE [dbo].[Booking] ADD CONSTRAINT [Booking_serviceId_fkey] FOREIGN KEY ([serviceId]) REFERENCES [dbo].[Service]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
