/*
Facilitator solutions and discussion points.

These are candidates to measure, not promises of faster execution. Plans and
metrics vary by SQL Server version, hardware, cache state, and data distribution.
Run only the section matching the exercise being discussed.
After a candidate exists, use sample/skills.md Skill 5 (optimization-verdict):
SHIP, REJECT, or INSUFFICIENT EVIDENCE. Keep do-nothing.
*/

USE AI_SQL_Workshop;
GO

SET NOCOUNT ON;
SET STATISTICS IO ON;
SET STATISTICS TIME ON;
GO

/* -------------------------------------------------------------------------
Solution 1 — Half-open date range

Why it is a candidate:
- avoids applying CONVERT to every OrderDate;
- exposes a search argument to the existing OrderDate index;
- preserves all times on 2025-01-15 without relying on 23:59:59 rounding.
---------------------------------------------------------------------------*/

SELECT
    o.OrderID,
    o.CustomerID,
    o.OrderDate,
    o.TotalAmount
FROM dbo.Orders AS o
WHERE o.OrderDate >= CONVERT(datetime2(0), '20250115', 112)
  AND o.OrderDate <  CONVERT(datetime2(0), '20250116', 112);
GO

/* Result-equivalence check for Exercise 1. Both result directions must be empty. */
WITH Original AS
(
    SELECT o.OrderID, o.CustomerID, o.OrderDate, o.TotalAmount
    FROM dbo.Orders AS o
    WHERE CONVERT(date, o.OrderDate) = CONVERT(date, '20250115', 112)
),
Rewrite AS
(
    SELECT o.OrderID, o.CustomerID, o.OrderDate, o.TotalAmount
    FROM dbo.Orders AS o
    WHERE o.OrderDate >= CONVERT(datetime2(0), '20250115', 112)
      AND o.OrderDate <  CONVERT(datetime2(0), '20250116', 112)
)
SELECT 'Original EXCEPT Rewrite' AS Difference, *
FROM (SELECT * FROM Original EXCEPT SELECT * FROM Rewrite) AS d
UNION ALL
SELECT 'Rewrite EXCEPT Original' AS Difference, *
FROM (SELECT * FROM Rewrite EXCEPT SELECT * FROM Original) AS d;
GO

/* -------------------------------------------------------------------------
Solution 2 — Align parameter and column data types

The durable fix is usually to bind/pass varchar(20), matching the column. A
test-only literal change does not repair an application sending nvarchar.
---------------------------------------------------------------------------*/

DECLARE @AccountNumber varchar(20) = 'AW00000001';

SELECT
    o.OrderID,
    o.OrderDate,
    o.TotalAmount
FROM dbo.Orders AS o
WHERE o.AccountNumber = @AccountNumber;
GO

/* -------------------------------------------------------------------------
Solution 3 — NULL-safe anti-semi join

NOT EXISTS evaluates the correlated match. A NULL CustomerID in Returns no
longer turns the outer predicate into UNKNOWN for every customer.
---------------------------------------------------------------------------*/

SELECT
    c.CustomerID,
    c.CustomerName
FROM dbo.Customers AS c
WHERE NOT EXISTS
(
    SELECT 1
    FROM dbo.Returns AS r
    WHERE r.CustomerID = c.CustomerID
);
GO

/* -------------------------------------------------------------------------
Solution 4 — Express existence directly

This avoids generating one row per qualifying order and then removing
duplicates. It is correct only because the requirement asks for one row per
customer and no columns/aggregates from Orders.
---------------------------------------------------------------------------*/

SELECT
    c.CustomerID,
    c.CustomerName
FROM dbo.Customers AS c
WHERE c.IsActive = 1
  AND EXISTS
  (
      SELECT 1
      FROM dbo.Orders AS o
      WHERE o.CustomerID = c.CustomerID
        AND o.OrderStatus = 'S'
        AND o.OrderDate >= CONVERT(datetime2(0), '20250101', 112)
        AND o.OrderDate <  CONVERT(datetime2(0), '20260101', 112)
  );
GO

/* -------------------------------------------------------------------------
Solution 5 — Project only the result contract

Explicit projection avoids duplicate join-key columns and wide Notes data.
Observe row width, reads, memory, and client/network payload—not only duration.
---------------------------------------------------------------------------*/

SELECT TOP (100)
    o.OrderID,
    o.OrderDate,
    c.CustomerName,
    o.TotalAmount
FROM dbo.Orders AS o
JOIN dbo.Customers AS c
    ON c.CustomerID = o.CustomerID
ORDER BY o.OrderDate DESC;
GO

/* -------------------------------------------------------------------------
Solution 6A — Recompile candidate for optional predicates

RECOMPILE can remove inactive branches and compile for current values, but it
adds compile CPU and prevents normal plan reuse for this statement. It is a
candidate only after measuring execution frequency, compile cost, and skew.
---------------------------------------------------------------------------*/

DECLARE
    @CustomerID int = 1,
    @FromDate datetime2(0) = NULL;

SELECT
    o.OrderID,
    o.CustomerID,
    o.OrderDate,
    o.OrderStatus,
    o.TotalAmount
FROM dbo.Orders AS o
WHERE (@CustomerID IS NULL OR o.CustomerID = @CustomerID)
  AND (@FromDate IS NULL OR o.OrderDate >= @FromDate)
OPTION (RECOMPILE);
GO

/*
Facilitator note:
- SQL Server 2022 PSP optimization supports qualifying parameterized predicates,
  but do not assume it fixes every optional-parameter catch-all.
- SQL Server 2025 at compatibility level 170 adds Optional Parameter Plan
  Optimization (OPPO) for qualifying optional predicates.
- Parameterized dynamic SQL is another candidate for high-frequency catch-all
  searches, but it requires careful construction and separate plan analysis.
*/

/* -------------------------------------------------------------------------
Solution 6B — Two-path split (full-loop demo candidate)

Use when one procedure truly serves two workloads and a single cached plan
cannot. The report branch may RECOMPILE (rare). The CSR branch stays cached.
This is a candidate to MEASURE against original, OPTIMIZE FOR UNKNOWN,
statement-level RECOMPILE, and a Query Store hint. See labs/03_demo_full_loop.sql.
---------------------------------------------------------------------------*/

CREATE OR ALTER PROCEDURE dbo.usp_GetCustomerOrders_v2
    @CustomerID int = NULL,
    @FromDate   datetime2(0),
    @ToDate     datetime2(0)
AS
BEGIN
    SET NOCOUNT ON;

    IF @CustomerID IS NULL
    BEGIN
        SELECT
            o.OrderID, o.OrderDate, o.OrderStatus, o.TotalAmount,
            c.CustomerName, c.AccountNumber
        FROM dbo.Orders AS o
        INNER JOIN dbo.Customers AS c
            ON c.CustomerID = o.CustomerID
        WHERE o.OrderDate >= @FromDate
          AND o.OrderDate <  DATEADD(day, 1, @ToDate)
        ORDER BY o.OrderDate DESC
        OPTION (RECOMPILE);
        RETURN;
    END;

    SELECT
        o.OrderID, o.OrderDate, o.OrderStatus, o.TotalAmount,
        c.CustomerName, c.AccountNumber
    FROM dbo.Orders AS o
    INNER JOIN dbo.Customers AS c
        ON c.CustomerID = o.CustomerID
    WHERE o.CustomerID = @CustomerID
      AND o.OrderDate >= @FromDate
      AND o.OrderDate <  DATEADD(day, 1, @ToDate)
    ORDER BY o.OrderDate DESC;
END;
GO

/* -------------------------------------------------------------------------
Solution 7 — Aggregate Orders once, then join

The baseline contains two correlated scalar aggregates. This rewrite presents
one grouped pass over Orders. Depending on active-customer selectivity and
indexes, the optimizer may still make the baseline competitive—measure it.
---------------------------------------------------------------------------*/

WITH OrderSummary AS
(
    SELECT
        o.CustomerID,
        MAX(o.OrderDate) AS LatestOrderDate,
        SUM(o.TotalAmount) AS LifetimeOrderValue
    FROM dbo.Orders AS o
    GROUP BY o.CustomerID
)
SELECT
    c.CustomerID,
    c.CustomerName,
    os.LatestOrderDate,
    os.LifetimeOrderValue
FROM dbo.Customers AS c
LEFT JOIN OrderSummary AS os
    ON os.CustomerID = c.CustomerID
WHERE c.IsActive = 1;
GO

/* -------------------------------------------------------------------------
General duplicate-multiplicity check

EXCEPT compares sets and can hide changed duplicate counts. For a rewrite whose
contract permits duplicates, materialize both outputs and compare grouped rows
plus COUNT_BIG(*). Adapt the listed columns to the real result.
---------------------------------------------------------------------------*/

/*
SELECT ResultColumn1, ResultColumn2, COUNT_BIG(*) AS Copies
INTO #OriginalCounts
FROM (# original query #) AS q
GROUP BY ResultColumn1, ResultColumn2;

SELECT ResultColumn1, ResultColumn2, COUNT_BIG(*) AS Copies
INTO #RewriteCounts
FROM (# rewrite query #) AS q
GROUP BY ResultColumn1, ResultColumn2;

SELECT * FROM #OriginalCounts
EXCEPT
SELECT * FROM #RewriteCounts;

SELECT * FROM #RewriteCounts
EXCEPT
SELECT * FROM #OriginalCounts;
*/

SET STATISTICS IO OFF;
SET STATISTICS TIME OFF;
GO

