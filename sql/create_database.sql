-- מופנה ל-init.sql בשורש הפרויקט (סכמה נקייה ללא נתונים אישיים).
-- להרצה מקומית מומלץ: ../init.sql
-- גיבוי: אותו תוכן כמו init.sql — נשמר כאן לתאימות לאחור.

IF DB_ID(N'gmach') IS NULL
BEGIN
    CREATE DATABASE gmach;
END;
GO

USE gmach;
GO

IF OBJECT_ID(N'dbo.ordersProducts', N'U') IS NOT NULL DROP TABLE dbo.ordersProducts;
IF OBJECT_ID(N'dbo.orders', N'U') IS NOT NULL DROP TABLE dbo.orders;
IF OBJECT_ID(N'dbo.Products', N'U') IS NOT NULL DROP TABLE dbo.Products;
IF OBJECT_ID(N'dbo.Gmach', N'U') IS NOT NULL DROP TABLE dbo.Gmach;
IF OBJECT_ID(N'dbo.GmachKinds', N'U') IS NOT NULL DROP TABLE dbo.GmachKinds;
IF OBJECT_ID(N'dbo.Customer', N'U') IS NOT NULL DROP TABLE dbo.Customer;
GO

CREATE TABLE dbo.Customer
(
    custEmail varchar(255) NOT NULL PRIMARY KEY,
    custName nvarchar(15) NOT NULL,
    custPhone int NULL,
    custPasswword int NOT NULL
);

CREATE TABLE dbo.GmachKinds
(
    gmachKindCode int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    gmachTypes nvarchar(10) NOT NULL,
    pic nvarchar(max) NULL
);

CREATE TABLE dbo.Gmach
(
    gmach_code int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    gmachName nvarchar(30) NOT NULL,
    gmachAddrres nvarchar(200) NOT NULL,
    gmachPikadon bit NULL CONSTRAINT DF_Gmach_gmachPikadon DEFAULT ((0)),
    gmachTimes nvarchar(40) NOT NULL,
    gmachPhone int NULL,
    gmachKindCode int NULL,
    comments nvarchar(50) NULL,
    numDays int NULL,
    custEmail varchar(255) NULL,
    CONSTRAINT FK_Gmach_Customer FOREIGN KEY (custEmail)
        REFERENCES dbo.Customer(custEmail),
    CONSTRAINT FK_Gmach_GmachKinds FOREIGN KEY (gmachKindCode)
        REFERENCES dbo.GmachKinds(gmachKindCode)
);

CREATE TABLE dbo.Products
(
    productCode int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    productName nvarchar(50) NOT NULL,
    productCount int NOT NULL,
    gmachCode int NULL,
    CONSTRAINT FK_Products_Gmach FOREIGN KEY (gmachCode)
        REFERENCES dbo.Gmach(gmach_code)
);

CREATE TABLE dbo.orders
(
    ordersCode int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    custEmail varchar(255) NULL,
    dateTaken date NULL,
    returnDate date NULL,
    orderStatus int NULL CONSTRAINT DF_orders_orderStatus DEFAULT ((0)),
    CONSTRAINT FK_orders_Customer FOREIGN KEY (custEmail)
        REFERENCES dbo.Customer(custEmail)
);

CREATE TABLE dbo.ordersProducts
(
    ordersProductCode int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    orderCode int NULL,
    productCode int NULL,
    comments nvarchar(50) NULL,
    countP int NULL,
    CONSTRAINT FK_ordersProducts_orders FOREIGN KEY (orderCode)
        REFERENCES dbo.orders(ordersCode),
    CONSTRAINT FK_ordersProducts_Products FOREIGN KEY (productCode)
        REFERENCES dbo.Products(productCode)
);
GO

INSERT INTO dbo.GmachKinds (gmachTypes, pic)
VALUES
    (N'תרופות', N'תמונה'),
    (N'מפות', N'תמונה'),
    (N'תינוקות', N'תמונה'),
    (N'כלה', N'תמונה'),
    (N'רפואי', N'תמונה');
GO
