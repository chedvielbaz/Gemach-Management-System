-- הוספת בעלות גמ״ח (מייל משתמש) למסדי נתונים קיימים.
-- הריצו פעם אחת על אותו מופע שבו רץ ה־API.

USE gmach;
GO

IF COL_LENGTH(N'dbo.Gmach', N'custEmail') IS NULL
BEGIN
    ALTER TABLE dbo.Gmach ADD custEmail varchar(255) NULL;

    ALTER TABLE dbo.Gmach
        ADD CONSTRAINT FK_Gmach_Customer_custEmail
        FOREIGN KEY (custEmail) REFERENCES dbo.Customer(custEmail);
END
GO
