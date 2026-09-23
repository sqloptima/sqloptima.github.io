/*
AI-assisted SQL workshop exercises

Persistent controls (use these instead of pasting rules every prompt):
  sample/instructions.md
  sample/skills.md          — invoke understand-business-requirement, then
                              diagnose-query-performance, then optimization-verdict
  sample/constitution.md    — also attached on this database as CONSTITUTION.md
  dbo.Orders AGENTS.md      — order value excludes Cancelled (C) and Returned (R)

Before each performance exercise:
1. Enable Include Actual Execution Plan in SSMS/VS Code.
2. In SSMS: Tools > Options > Query Results > SQL Server > Results to Grid
   > Discard results after execution. CustomerID 1 is ~300,000 orders.
   The grid will hide the engine time.
3. Run the baseline with representative parameters.
4. Save STATISTICS IO/TIME and key plan observations.
5. Open a new Copilot thread. Paste the BAD prompt, then a second thread
   for the GOOD prompt. Copy only the text between the marker lines.
6. Prove result equivalence, then benchmark the rewrite. Keep do-nothing.
7. Skill 5 verdict: SHIP / REJECT / INSUFFICIENT EVIDENCE.

Do not add or alter indexes.
Re-run labs/00_setup.sql first. It loads ~3 million orders on purpose.
*/

USE AI_SQL_Workshop;
GO

SET NOCOUNT ON;
SET STATISTICS IO ON;
SET STATISTICS TIME ON;
GO

/* -------------------------------------------------------------------------
Exercise 1 — Date predicate

The CONVERT on OrderDate blocks the OrderDate index. On ~3 million rows
the scan should dominate logical reads and elapsed time versus a one-day seek.

--- BAD PROMPT (copy from here) ---
This is slow. Make it faster and add an index if you need one.

SELECT
    o.OrderID,
    o.CustomerID,
    o.OrderDate,
    o.TotalAmount
FROM dbo.Orders AS o
WHERE CONVERT(date, o.OrderDate) = CONVERT(date, '20250115', 112);
--- END BAD PROMPT ---

--- GOOD PROMPT (copy from here) ---
Database: AI_SQL_Workshop. Dialect: T-SQL on this SQL Server.
Do not execute. Do not add an index, hint, NOLOCK, or schema change.

Requirement: every order whose OrderDate falls on calendar day 2025-01-15.
OrderDate is datetime2(0). Keep every time on that day. Exclude 2025-01-16.
Do not use 23:59:59.

SELECT
    o.OrderID,
    o.CustomerID,
    o.OrderDate,
    o.TotalAmount
FROM dbo.Orders AS o
WHERE CONVERT(date, o.OrderDate) = CONVERT(date, '20250115', 112);

1. Say why this predicate cannot seek IX_Orders_OrderDate, using the actual plan and STATISTICS IO I will paste next.
2. Rewrite only the predicate as a half-open range on OrderDate.
3. Give an EXCEPT script that must return no rows in either direction.
4. Leave the original in place until logical reads, CPU, and elapsed time are compared. Do-nothing stays a candidate.
--- END GOOD PROMPT ---
---------------------------------------------------------------------------*/

SELECT
    o.OrderID,
    o.CustomerID,
    o.OrderDate,
    o.TotalAmount
FROM dbo.Orders AS o
WHERE CONVERT(date, o.OrderDate) = CONVERT(date, '20250115', 112);
GO

/* -------------------------------------------------------------------------
Exercise 2 — Parameter/column type alignment

AccountNumber is varchar(20). The nvarchar variable forces a conversion
on the column, so IX_Orders_AccountNumber cannot seek. AW00000001 is
CustomerID 1 (~300,000 rows). Compare logical reads, not the grid.

--- BAD PROMPT (copy from here) ---
Fix this slow account lookup.

DECLARE @AccountNumber nvarchar(20) = N'AW00000001';

SELECT
    o.OrderID,
    o.OrderDate,
    o.TotalAmount
FROM dbo.Orders AS o
WHERE o.AccountNumber = @AccountNumber;
--- END BAD PROMPT ---

--- GOOD PROMPT (copy from here) ---
Database: AI_SQL_Workshop. Dialect: T-SQL on this SQL Server.
Do not execute. Do not add an index, hint, or NOLOCK.

dbo.Orders.AccountNumber is varchar(20). This batch passes nvarchar.
AW00000001 is the whale account (about 10% of Orders). I will paste the actual plan, including any CONVERT warning, and STATISTICS IO/TIME.

DECLARE @AccountNumber nvarchar(20) = N'AW00000001';

SELECT
    o.OrderID,
    o.OrderDate,
    o.TotalAmount
FROM dbo.Orders AS o
WHERE o.AccountNumber = @AccountNumber;

1. Name the access path and where the conversion sits (column vs parameter).
2. Say where the durable fix belongs: this local variable, a procedure parameter, or the application binding. A one-off literal in a lab script is not the application fix.
3. Show the aligned declaration. Do not change the result for this account number.
4. State what is still unproven until IO and time are measured with results discarded.
--- END GOOD PROMPT ---
---------------------------------------------------------------------------*/

DECLARE @AccountNumber nvarchar(20) = N'AW00000001';

SELECT
    o.OrderID,
    o.OrderDate,
    o.TotalAmount
FROM dbo.Orders AS o
WHERE o.AccountNumber = @AccountNumber;
GO

/* -------------------------------------------------------------------------
Exercise 3 — The NULL trap

Business rule: return customers who have never had a return.
One Returns row has CustomerID NULL. Correctness fails before speed matters.
After the data load this predicate returns no customers.

--- BAD PROMPT (copy from here) ---
Speed up this NOT IN. Use a join if that is faster.

SELECT
    c.CustomerID,
    c.CustomerName
FROM dbo.Customers AS c
WHERE c.CustomerID NOT IN
(
    SELECT r.CustomerID
    FROM dbo.Returns AS r
);
--- END BAD PROMPT ---

--- GOOD PROMPT (copy from here) ---
Database: AI_SQL_Workshop. Dialect: T-SQL on this SQL Server.
Do not execute. Do not discuss indexes until the result is correct.

Business rule: one row per customer who has never had a return.
dbo.Returns contains a row with CustomerID NULL and OrderID NULL.
The query below currently returns no customers.

SELECT
    c.CustomerID,
    c.CustomerName
FROM dbo.Customers AS c
WHERE c.CustomerID NOT IN
(
    SELECT r.CustomerID
    FROM dbo.Returns AS r
);

1. Explain why that one NULL changes the predicate for every outer row.
2. Repair the result. NOT EXISTS or a NULL-safe anti-join is allowed. Do not drop the NULL row; it is real data.
3. Give a check that the repaired query returns customers, and that a customer who does appear in Returns does not.
4. Only after that check, say whether the repair is also cheaper. No invented percentages.
--- END GOOD PROMPT ---
---------------------------------------------------------------------------*/

SELECT
    c.CustomerID,
    c.CustomerName
FROM dbo.Customers AS c
WHERE c.CustomerID NOT IN
(
    SELECT r.CustomerID
    FROM dbo.Returns AS r
);
GO

/* -------------------------------------------------------------------------
Exercise 4 — Existence intent and duplicate elimination

Business rule: one row per active customer who has at least one shipped
order in 2025. The join emits one row per qualifying order, then DISTINCT
removes them. On this data that intermediate set is large.

--- BAD PROMPT (copy from here) ---
Replace DISTINCT with EXISTS. It will be faster.

SELECT DISTINCT
    c.CustomerID,
    c.CustomerName
FROM dbo.Customers AS c
JOIN dbo.Orders AS o
    ON o.CustomerID = c.CustomerID
WHERE c.IsActive = 1
  AND o.OrderStatus = 'S'
  AND o.OrderDate >= CONVERT(datetime2(0), '20250101', 112)
  AND o.OrderDate <  CONVERT(datetime2(0), '20260101', 112);
--- END BAD PROMPT ---

--- GOOD PROMPT (copy from here) ---
Database: AI_SQL_Workshop. Dialect: T-SQL on this SQL Server.
Do not execute. Do not add an index or hint.

Requirement: one row per active customer (IsActive = 1) who has at least one shipped order (OrderStatus = 'S') with OrderDate >= 2025-01-01 and < 2026-01-01.
No columns from Orders. No aggregates. Duplicates are not part of the contract.

SELECT DISTINCT
    c.CustomerID,
    c.CustomerName
FROM dbo.Customers AS c
JOIN dbo.Orders AS o
    ON o.CustomerID = c.CustomerID
WHERE c.IsActive = 1
  AND o.OrderStatus = 'S'
  AND o.OrderDate >= CONVERT(datetime2(0), '20250101', 112)
  AND o.OrderDate <  CONVERT(datetime2(0), '20260101', 112);

1. Say what work DISTINCT is doing that the requirement does not ask for.
2. Propose an EXISTS form that keeps the same half-open dates and status.
3. Do not treat EXISTS as accepted until an EXCEPT of CustomerID, CustomerName returns no rows both ways.
4. Then compare logical reads and CPU. If EXISTS is not cheaper, say so.
--- END GOOD PROMPT ---
---------------------------------------------------------------------------*/

SELECT DISTINCT
    c.CustomerID,
    c.CustomerName
FROM dbo.Customers AS c
JOIN dbo.Orders AS o
    ON o.CustomerID = c.CustomerID
WHERE c.IsActive = 1
  AND o.OrderStatus = 'S'
  AND o.OrderDate >= CONVERT(datetime2(0), '20250101', 112)
  AND o.OrderDate <  CONVERT(datetime2(0), '20260101', 112);
GO

/* -------------------------------------------------------------------------
Exercise 5 — Width and unnecessary data movement

Requirement: OrderID, OrderDate, CustomerName, and TotalAmount for the
100 newest orders. SELECT * also returns Notes (about 960 characters on
every order) and the duplicate join key. Compare estimated row size and
logical reads. Elapsed time can stay small because of TOP (100).

--- BAD PROMPT (copy from here) ---
SELECT * is bad practice. Clean this up.

SELECT TOP (100)
    *
FROM dbo.Orders AS o
JOIN dbo.Customers AS c
    ON c.CustomerID = o.CustomerID
ORDER BY o.OrderDate DESC;
--- END BAD PROMPT ---

--- GOOD PROMPT (copy from here) ---
Database: AI_SQL_Workshop. Dialect: T-SQL on this SQL Server.
Do not execute. Do not add an index or hint.

Result contract, exactly these columns, 100 rows, newest OrderDate first:
OrderID, OrderDate, CustomerName, TotalAmount.
dbo.Orders.Notes is varchar(4000) and is populated on every row. It is not in the contract.

SELECT TOP (100)
    *
FROM dbo.Orders AS o
JOIN dbo.Customers AS c
    ON c.CustomerID = o.CustomerID
ORDER BY o.OrderDate DESC;

1. List columns and operators in this plan that the contract does not need. Include row width.
2. Rewrite the SELECT list only. Keep TOP (100) and ORDER BY o.OrderDate DESC.
3. Say how to prove the 100 keys match (not just that both return 100 rows).
4. Tell me which STATISTICS IO/TIME counters can stay flat even when the rewrite is the right shape.
--- END GOOD PROMPT ---
---------------------------------------------------------------------------*/

SELECT TOP (100)
    *
FROM dbo.Orders AS o
JOIN dbo.Customers AS c
    ON c.CustomerID = o.CustomerID
ORDER BY o.OrderDate DESC;
GO

/* -------------------------------------------------------------------------
Exercise 6 — Optional search predicates and parameter sensitivity

Run this batch three times and keep each plan:
A. @CustomerID = 1,        @FromDate = NULL
B. @CustomerID = 8421,     @FromDate = '20250101'
C. @CustomerID = NULL,     @FromDate = '20250101'

CustomerID 1 is about 300,000 orders. The OR catch-all often compiles one
plan and reuses it for the other shapes.

--- BAD PROMPT (copy from here) ---
Add OPTION (RECOMPILE) so this uses the right index.

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
  AND (@FromDate IS NULL OR o.OrderDate >= @FromDate);
--- END BAD PROMPT ---

--- GOOD PROMPT (copy from here) ---
Database: AI_SQL_Workshop. Dialect: T-SQL on this SQL Server.
Do not execute. Do not add an index, NOLOCK, or a schema change.
Do not default to OPTION (RECOMPILE).

One statement serves two workloads. I will paste three actual plans and STATISTICS IO/TIME:
A. @CustomerID = 1,    @FromDate = NULL       — whale customer, all dates, frequent CSR lookup
B. @CustomerID = 8421, @FromDate = '20250101' — ordinary customer, date floor
C. @CustomerID = NULL, @FromDate = '20250101' — all customers from that date, rare report

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
  AND (@FromDate IS NULL OR o.OrderDate >= @FromDate);

Before any fix, ask me up to 5 questions whose answers would change the recommendation. Then wait.

After I answer, give four materially different options, including at least one that is the wrong choice here.
For each option: mechanism, effect on BOTH the CSR path and the report path, compile cost, and when it is the WRONG choice.
No invented percentages. If you suggest a new index, withdraw it.
--- END GOOD PROMPT ---
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
  AND (@FromDate IS NULL OR o.OrderDate >= @FromDate);
GO

/* -------------------------------------------------------------------------
Exercise 7 — Correlated scalar work

Business rule: each active customer, their latest OrderDate, and the sum
of TotalAmount. About 95,000 active customers. The two scalar subqueries
each seek dbo.Orders per customer. A single grouped pass is the comparison,
not a promise that it wins.

--- BAD PROMPT (copy from here) ---
These subqueries are slow. Optimize them.

SELECT
    c.CustomerID,
    c.CustomerName,
    (
        SELECT MAX(o.OrderDate)
        FROM dbo.Orders AS o
        WHERE o.CustomerID = c.CustomerID
    ) AS LatestOrderDate,
    (
        SELECT SUM(o.TotalAmount)
        FROM dbo.Orders AS o
        WHERE o.CustomerID = c.CustomerID
    ) AS LifetimeOrderValue
FROM dbo.Customers AS c
WHERE c.IsActive = 1;
--- END BAD PROMPT ---

--- GOOD PROMPT (copy from here) ---
Database: AI_SQL_Workshop. Dialect: T-SQL on this SQL Server.
Do not execute. Do not add an index or hint.

Requirement: one row per customer with IsActive = 1.
Columns: CustomerID, CustomerName, LatestOrderDate = MAX(OrderDate), LifetimeOrderValue = SUM(TotalAmount).
Customers with no orders stay in the result; both aggregates are NULL.
There are about 100,000 customers and about 3 million orders. CustomerID 1 has about 300,000 orders.

SELECT
    c.CustomerID,
    c.CustomerName,
    (
        SELECT MAX(o.OrderDate)
        FROM dbo.Orders AS o
        WHERE o.CustomerID = c.CustomerID
    ) AS LatestOrderDate,
    (
        SELECT SUM(o.TotalAmount)
        FROM dbo.Orders AS o
        WHERE o.CustomerID = c.CustomerID
    ) AS LifetimeOrderValue
FROM dbo.Customers AS c
WHERE c.IsActive = 1;

1. From the actual plan, count how many times Orders is touched per customer.
2. Give two rewrites that preserve NULL for customers with no orders. One of them must aggregate Orders once, then join.
3. Give a check on CustomerID, LatestOrderDate, and LifetimeOrderValue. EXCEPT hides a changed duplicate count, so also compare COUNT_BIG(*).
4. Compare CPU and logical reads. If the original is competitive, say INSUFFICIENT EVIDENCE rather than a speedup.
--- END GOOD PROMPT ---
---------------------------------------------------------------------------*/

SELECT
    c.CustomerID,
    c.CustomerName,
    (
        SELECT MAX(o.OrderDate)
        FROM dbo.Orders AS o
        WHERE o.CustomerID = c.CustomerID
    ) AS LatestOrderDate,
    (
        SELECT SUM(o.TotalAmount)
        FROM dbo.Orders AS o
        WHERE o.CustomerID = c.CustomerID
    ) AS LifetimeOrderValue
FROM dbo.Customers AS c
WHERE c.IsActive = 1;
GO

/* -------------------------------------------------------------------------
Exercise 8 — Bounded Agent workflow (run from Copilot Agent mode)

--- BAD PROMPT (copy from here) ---
Who are the top 5 customers by order value in 2025? Just run it.
--- END BAD PROMPT ---

--- GOOD PROMPT (copy from here) ---
Using the current AI_SQL_Workshop database and its CONSTITUTION.md / dbo.Orders AGENTS.md, inspect metadata for dbo.Orders and dbo.Customers.
Propose and then, after my approval, execute one read-only query returning the five customers with the highest 2025 order value as the constitution defines it.
Show each intended tool action.
Do not retrieve Notes, execute DDL/DML, inspect unrelated objects, or make schema changes.
Stop after the SELECT result and summary.
--- END GOOD PROMPT ---

Review the generated query before approval:
- Does it honour CONSTITUTION.md (exclude C/R unless you asked for gross)?
- Date boundary half-open and UTC/calendar called out?
- Verified names and types only?
- Did it ask instead of inventing "order value"?
---------------------------------------------------------------------------*/

SET STATISTICS IO OFF;
SET STATISTICS TIME OFF;
GO

