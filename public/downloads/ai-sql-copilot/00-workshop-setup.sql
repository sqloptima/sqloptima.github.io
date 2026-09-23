/*
AI-assisted SQL tuning workshop
Creates/reset objects only in the dedicated AI_SQL_Workshop database.

Requirements:
- Local disposable SQL Server 2019+
- Permission to create a database (first run)
- Approximately 10–25 minutes and several GB free, depending on the machine.
  Counts are large on purpose: non-sargable scans, catch-all plans, and
  correlated aggregates should show up in STATISTICS IO/TIME, not only
  in the plan icons. Discard the result grid in SSMS when a statement
  returns the whale customer (CustomerID 1 is about 10% of Orders).

Do not run this script in production.
*/

USE master;
GO

IF DB_ID(N'AI_SQL_Workshop') IS NULL
BEGIN
    CREATE DATABASE AI_SQL_Workshop;
END;
GO

ALTER DATABASE AI_SQL_Workshop SET RECOVERY SIMPLE;
GO

ALTER DATABASE AI_SQL_Workshop SET QUERY_STORE = ON;
ALTER DATABASE AI_SQL_Workshop SET QUERY_STORE
(
    OPERATION_MODE = READ_WRITE,
    QUERY_CAPTURE_MODE = AUTO,
    MAX_STORAGE_SIZE_MB = 256,
    CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 7)
);
GO

USE AI_SQL_Workshop;
GO

SET NOCOUNT ON;
SET XACT_ABORT ON;
GO

DROP PROCEDURE IF EXISTS dbo.usp_GetCustomerOrders_v2;
DROP PROCEDURE IF EXISTS dbo.usp_GetCustomerOrders;
DROP TABLE IF EXISTS dbo.Returns;
DROP TABLE IF EXISTS dbo.OrderLines;
DROP TABLE IF EXISTS dbo.Orders;
DROP TABLE IF EXISTS dbo.Customers;
GO

CREATE TABLE dbo.Customers
(
    CustomerID     int           NOT NULL
        CONSTRAINT PK_Customers PRIMARY KEY,
    AccountNumber  varchar(20)   NOT NULL,
    CustomerName   nvarchar(100) NOT NULL,
    RegionCode     char(2)       NOT NULL,
    IsActive       bit           NOT NULL
);
GO

CREATE TABLE dbo.Orders
(
    OrderID        bigint         NOT NULL
        CONSTRAINT PK_Orders PRIMARY KEY,
    CustomerID     int            NOT NULL,
    OrderDate      datetime2(0)   NOT NULL,
    OrderStatus    char(1)        NOT NULL,
    TotalAmount    decimal(12, 2) NOT NULL,
    AccountNumber  varchar(20)    NOT NULL,
    Notes          varchar(4000)  NULL,
    CONSTRAINT FK_Orders_Customers
        FOREIGN KEY (CustomerID) REFERENCES dbo.Customers(CustomerID)
);
GO

CREATE TABLE dbo.OrderLines
(
    OrderID      bigint         NOT NULL,
    LineNumber   tinyint        NOT NULL,
    ProductID    int            NOT NULL,
    Quantity     smallint       NOT NULL,
    UnitPrice    decimal(10, 2) NOT NULL,
    CONSTRAINT PK_OrderLines PRIMARY KEY (OrderID, LineNumber),
    CONSTRAINT FK_OrderLines_Orders
        FOREIGN KEY (OrderID) REFERENCES dbo.Orders(OrderID)
);
GO

CREATE TABLE dbo.Returns
(
    ReturnID      int          NOT NULL
        CONSTRAINT PK_Returns PRIMARY KEY,
    OrderID       bigint       NULL,
    CustomerID    int          NULL,
    ReturnDate    date         NOT NULL,
    ReasonCode    varchar(10)  NOT NULL,
    CONSTRAINT FK_Returns_Orders
        FOREIGN KEY (OrderID) REFERENCES dbo.Orders(OrderID),
    CONSTRAINT FK_Returns_Customers
        FOREIGN KEY (CustomerID) REFERENCES dbo.Customers(CustomerID)
);
GO

;WITH d AS
(
    SELECT n
    FROM (VALUES (1),(1),(1),(1),(1),(1),(1),(1),(1),(1)) AS v(n)
),
n AS
(
    SELECT TOP (100000)
        ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
    FROM d AS a
    CROSS JOIN d AS b
    CROSS JOIN d AS c
    CROSS JOIN d AS e
    CROSS JOIN d AS f
)
INSERT dbo.Customers
(
    CustomerID,
    AccountNumber,
    CustomerName,
    RegionCode,
    IsActive
)
SELECT
    n,
    CONCAT('AW', RIGHT(CONCAT('00000000', n), 8)),
    CONCAT(N'Workshop Customer ', n),
    CHOOSE((n % 5) + 1, 'AP', 'EU', 'NA', 'SA', 'ME'),
    IIF(n % 20 = 0, 0, 1)
FROM n;
GO

/*
  3,000,000 orders. CustomerID 1 is every 10th row (~300,000, the whale).
  Everyone else is spread across CustomerID 2..100000 (a few dozen orders
  each). Notes is wide on every row so a table scan moves gigabytes.
*/
;WITH d AS
(
    SELECT n
    FROM (VALUES (1),(1),(1),(1),(1),(1),(1),(1),(1),(1)) AS v(n)
),
n AS
(
    SELECT TOP (3000000)
        ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
    FROM d AS a
    CROSS JOIN d AS b
    CROSS JOIN d AS c
    CROSS JOIN d AS e
    CROSS JOIN d AS f
    CROSS JOIN d AS g
    CROSS JOIN d AS h
)
INSERT dbo.Orders WITH (TABLOCK)
(
    OrderID,
    CustomerID,
    OrderDate,
    OrderStatus,
    TotalAmount,
    AccountNumber,
    Notes
)
SELECT
    n.n,
    c.CustomerID,
    DATEADD
    (
        minute,
        n.n % 1440,
        DATEADD(day, n.n % 1461, CONVERT(datetime2(0), '20220101', 112))
    ),
    CHOOSE((n.n % 5) + 1, 'N', 'P', 'S', 'C', 'R'),
    CONVERT(decimal(12, 2), ((n.n * 17) % 500000) / 100.0 + 10.00),
    c.AccountNumber,
    REPLICATE('Workshop note. ', 60)
FROM n
CROSS APPLY
(
    SELECT CASE
        WHEN n.n % 10 = 0 THEN 1
        ELSE (n.n % 99999) + 2
    END
) AS selected(CustomerID)
JOIN dbo.Customers AS c
    ON c.CustomerID = selected.CustomerID;
GO

INSERT dbo.OrderLines WITH (TABLOCK)
(
    OrderID,
    LineNumber,
    ProductID,
    Quantity,
    UnitPrice
)
SELECT
    o.OrderID,
    line.LineNumber,
    ((CONVERT(int, o.OrderID) * 13 + line.LineNumber) % 5000) + 1,
    (CONVERT(int, o.OrderID) % 5) + 1,
    CONVERT(decimal(10, 2), ((o.OrderID * 7 + line.LineNumber) % 25000) / 100.0 + 1.00)
FROM dbo.Orders AS o
CROSS JOIN (VALUES (CONVERT(tinyint, 1)), (CONVERT(tinyint, 2))) AS line(LineNumber);
GO

;WITH d AS
(
    SELECT n
    FROM (VALUES (1),(1),(1),(1),(1),(1),(1),(1),(1),(1)) AS v(n)
),
n AS
(
    SELECT TOP (200000)
        ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
    FROM d AS a
    CROSS JOIN d AS b
    CROSS JOIN d AS c
    CROSS JOIN d AS e
    CROSS JOIN d AS f
    CROSS JOIN d AS g
)
INSERT dbo.Returns WITH (TABLOCK)
(
    ReturnID,
    OrderID,
    CustomerID,
    ReturnDate,
    ReasonCode
)
SELECT
    n,
    n * 10,
    o.CustomerID,
    DATEADD(day, n % 365, CONVERT(date, '20250101', 112)),
    CHOOSE((n % 3) + 1, 'DAMAGED', 'LATE', 'OTHER')
FROM n
JOIN dbo.Orders AS o
    ON o.OrderID = n * 10;

-- Deliberate NULL for the NOT IN correctness exercise.
INSERT dbo.Returns
(
    ReturnID,
    OrderID,
    CustomerID,
    ReturnDate,
    ReasonCode
)
VALUES
(
    200001,
    NULL,
    NULL,
    CONVERT(date, '20260115', 112),
    'OTHER'
);
GO

/*
These are part of the starting design. Labs improve queries without adding
new indexes; the existing indexes make access-path mistakes visible.
*/
CREATE INDEX IX_Orders_OrderDate
    ON dbo.Orders(OrderDate)
    INCLUDE (CustomerID, TotalAmount, OrderStatus);

CREATE INDEX IX_Orders_AccountNumber
    ON dbo.Orders(AccountNumber)
    INCLUDE (OrderDate, TotalAmount);

CREATE INDEX IX_Orders_CustomerID
    ON dbo.Orders(CustomerID)
    INCLUDE (OrderDate, TotalAmount, OrderStatus);

CREATE INDEX IX_Returns_CustomerID
    ON dbo.Returns(CustomerID);
GO

/*
OrderStatus codes used by constitution / AGENTS.md:
  N = New, P = Processing, S = Shipped, C = Cancelled, R = Returned.
Order value excludes C and R unless the attendee explicitly asks for gross.
*/
GO

DECLARE @Constitution nvarchar(4000) = N'---
agentExecuteAsUser: GHCP_ReadOnly
---
# AI_SQL_Workshop constitution
- Disposable workshop database. Do not treat this as production.
- First action: restate engine version and compatibility_level.
- Schema-qualify names. Explicit columns. No SELECT *. No NOLOCK.
- Do not invent objects. Do not add indexes unless explicitly requested.
- Order value = SUM(TotalAmount) where OrderStatus NOT IN (''C'',''R'').
- C = Cancelled. R = Returned. S = Shipped.
- Ask mode is advisory. Agent may inspect and SELECT; stop before writes.
- Diagnose before rewrite. Keep do-nothing as a candidate.
- Never claim a speedup without measured IO/CPU/duration.
- Full text: sample/constitution.md and sample/instructions.md
';

IF EXISTS (SELECT 1 FROM sys.extended_properties WHERE class = 0 AND name = N'CONSTITUTION.md')
    EXEC sys.sp_updateextendedproperty @name = N'CONSTITUTION.md', @value = @Constitution;
ELSE
    EXEC sys.sp_addextendedproperty @name = N'CONSTITUTION.md', @value = @Constitution;

IF EXISTS (
    SELECT 1 FROM sys.extended_properties
    WHERE class = 1 AND name = N'AGENTS.md'
      AND major_id = OBJECT_ID(N'dbo.Orders')
)
    EXEC sys.sp_updateextendedproperty
        @name = N'AGENTS.md',
        @value = N'Order value is SUM(TotalAmount) for OrderStatus NOT IN (''C'',''R''). Status C=Cancelled, R=Returned, S=Shipped. Grain is one order header.',
        @level0type = N'SCHEMA', @level0name = N'dbo',
        @level1type = N'TABLE',  @level1name = N'Orders';
ELSE
    EXEC sys.sp_addextendedproperty
        @name = N'AGENTS.md',
        @value = N'Order value is SUM(TotalAmount) for OrderStatus NOT IN (''C'',''R''). Status C=Cancelled, R=Returned, S=Shipped. Grain is one order header.',
        @level0type = N'SCHEMA', @level0name = N'dbo',
        @level1type = N'TABLE',  @level1name = N'Orders';
GO

/*
Catch-all procedure for the live "full loop" demo.
CustomerID 1 is a whale (~10% of Orders, about 300,000 rows). Two real workloads share one plan:
CSR lookup (one customer, short window) vs month-end report (NULL = all customers).
*/
CREATE OR ALTER PROCEDURE dbo.usp_GetCustomerOrders
    @CustomerID int = NULL,
    @FromDate   datetime2(0),
    @ToDate     datetime2(0)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        o.OrderID,
        o.OrderDate,
        o.OrderStatus,
        o.TotalAmount,
        c.CustomerName,
        c.AccountNumber
    FROM dbo.Orders AS o
    INNER JOIN dbo.Customers AS c
        ON c.CustomerID = o.CustomerID
    WHERE (@CustomerID IS NULL OR o.CustomerID = @CustomerID)
      AND o.OrderDate >= @FromDate
      AND o.OrderDate <  DATEADD(day, 1, @ToDate)
    ORDER BY o.OrderDate DESC;
END;
GO

IF EXISTS
(
    SELECT 1
    FROM sys.extended_properties
    WHERE class = 0
      AND name = N'WorkshopPurpose'
)
BEGIN
    EXEC sys.sp_updateextendedproperty
        @name = N'WorkshopPurpose',
        @value = N'Disposable database for AI-assisted SQL development and tuning training.';
END;
ELSE
BEGIN
    EXEC sys.sp_addextendedproperty
        @name = N'WorkshopPurpose',
        @value = N'Disposable database for AI-assisted SQL development and tuning training.';
END;
GO

SELECT
    Customers = (SELECT COUNT_BIG(*) FROM dbo.Customers),
    Orders = (SELECT COUNT_BIG(*) FROM dbo.Orders),
    OrderLines = (SELECT COUNT_BIG(*) FROM dbo.OrderLines),
    Returns = (SELECT COUNT_BIG(*) FROM dbo.Returns);
GO

