DROP TABLE IF EXISTS RM.Users
CREATE TABLE RM.Users
(
	userID INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
	username NVARCHAR(32) NOT NULL,
	[password] NVARCHAR(32) NOT NULL,
	createdOn DATETIMEOFFSET NOT NULL DEFAULT(SYSDATETIMEOFFSET())
)

DROP TABLE IF EXISTS RM.Lists
CREATE TABLE RM.Lists
(
	listID INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
	[name] NVARCHAR(32) NOT NULL,
	userID INT NOT NULL,
	isDeleted BIT NOT NULL,
	createdOn DATETIMEOFFSET NOT NULL DEFAULT(SYSDATETIMEOFFSET())

	CONSTRAINT [FK_userID_Lists] FOREIGN																																																																																																																																																																																																																																																																																																																						KEY(userID)
	REFERENCES RM.Users(userID)
)

DROP TABLE IF EXISTS RM.ListItems
CREATE TABLE RM.ListItems
(
	listItemID INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
	[description] NVARCHAR(200) NOT NULL,
	checked BIT NOT NULL,
	listID INT NOT NULL

	CONSTRAINT [FK_listID_ListItems] FOREIGN KEY(listID)
	REFERENCES RM.Lists(listID)
)

DROP TABLE IF EXISTS RM.CustomItemGroups
CREATE TABLE RM.CustomItemGroups
(
	groupID INT NOT NULL IDENTITY (1, 1) PRIMARY KEY,
	[name] NVARCHAR(32) NOT NULL,
	userID INT NOT NULL

	CONSTRAINT [FK_userID_CustomItemGroups] FOREIGN KEY(userID)
	REFERENCES RM.Users(userID)
)

DROP TABLE IF EXISTS RM.CustomItemGroupItems
CREATE TABLE RM.CustomItemGroupItems
(
	groupItemID INT NOT NULL IDENTITY (1, 1) PRIMARY KEY,
	[description] NVARCHAR(200) NOT NULL,
	groupID INT NOT NULL

	CONSTRAINT [FK_groupID_CustomItemGroupItems] FOREIGN KEY(groupID)
	REFERENCES RM.CustomItemGroups(groupID)
)

DROP TABLE IF EXISTS RM.Reminders
CREATE TABLE RM.Reminders
(
	reminderID INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
	[name] NVARCHAR(32),
	frequency NVARCHAR(32) NOT NULL,
	daysRepeated NVARCHAR(32),
	dateNotified NVARCHAR(16),
	timeNotified NVARCHAR(8) NOT NULL,
	[description] NVARCHAR(1000),
	userID INT NOT NULL,
	isDeleted BIT NOT NULL,
	createdOn DATETIMEOFFSET NOT NULL DEFAULT(SYSDATETIMEOFFSET())

	CONSTRAINT [FK_userID_Reminders] FOREIGN KEY(userID)
	REFERENCES RM.Users(userID)
)

DROP TABLE IF EXISTS RM.Reviews
CREATE TABLE RM.Reviews
(
	reviewID INT NOT NULL IDENTITY(1, 1) PRIMARY KEY,
	[name] NVARCHAR(32),
	[type] NVARCHAR(16) NOT NULL,
	[date] NVARCHAR(16) NOT NULL,
	rating INT NOT NULL,
	reminderID INT,
	[description] NVARCHAR(1000),
	userID INT NOT NULL,
	isDeleted BIT NOT NULL,
	createdOn DATETIMEOFFSET NOT NULL DEFAULT(SYSDATETIMEOFFSET())

	CONSTRAINT [FK_userID_Reviews] FOREIGN KEY(userID)
	REFERENCES RM.Users(userID),

	CONSTRAINT [FK_reminderID_Reviews] FOREIGN KEY(reminderID)
	REFERENCES RM.Reminders(reminderID)
)