/*
  Lab disk paths
  --------------
  Use C:\SQLLab\InMemoryOLTP when the host only has a C: drive.
  Use D:\SQLLab\InMemoryOLTP when a D: drive exists (search-and-replace the prefix below).
  Create Data, Log, and XTP folders first. The SQL Server service account needs Modify on that tree.
*/
USE master;
GO

IF DB_ID(N'InMemoryOLTP_Demo') IS NOT NULL
BEGIN
    ALTER DATABASE InMemoryOLTP_Demo
        SET SINGLE_USER
        WITH ROLLBACK IMMEDIATE;

    DROP DATABASE InMemoryOLTP_Demo;
END
GO

CREATE DATABASE InMemoryOLTP_Demo
ON PRIMARY
(
    NAME = N'InMemoryOLTP_Demo_Data',
    FILENAME = N'C:\SQLLab\InMemoryOLTP\Data\InMemoryOLTP_Demo.mdf',
    SIZE = 256MB,
    FILEGROWTH = 128MB
)
LOG ON
(
    NAME = N'InMemoryOLTP_Demo_Log',
    FILENAME = N'C:\SQLLab\InMemoryOLTP\Log\InMemoryOLTP_Demo.ldf',
    SIZE = 256MB,
    FILEGROWTH = 128MB
);
GO


ALTER DATABASE InMemoryOLTP_Demo
ADD FILEGROUP InMemoryOLTP_Demo_XTP
CONTAINS MEMORY_OPTIMIZED_DATA;
GO

ALTER DATABASE InMemoryOLTP_Demo
ADD FILE
(
    NAME = N'InMemoryOLTP_Demo_XTP_Container',
    FILENAME = N'C:\SQLLab\InMemoryOLTP\XTP\XTPContainer'
)
TO FILEGROUP InMemoryOLTP_Demo_XTP;
GO


--vERIFY XTP CONTAINER

SELECT
    df.name,
    df.type_desc,
    df.physical_name,
    fg.name AS filegroup_name
FROM sys.database_files AS df
JOIN sys.filegroups AS fg
    ON df.data_space_id = fg.data_space_id;
GO

--MEMORY OPTIMIZED TABLE

USE InMemoryOLTP_Demo;
GO

CREATE TABLE dbo.CustomerMemory
(
    CustomerID BIGINT IDENTITY(1,1) NOT NULL,
    CustomerCode VARCHAR(30) NOT NULL,
    CustomerName VARCHAR(100) NOT NULL,
    CreatedDate DATETIME2(3) NOT NULL
        CONSTRAINT DF_CustomerMemory_CreatedDate
        DEFAULT SYSUTCDATETIME(),

    CONSTRAINT PK_CustomerMemory
        PRIMARY KEY NONCLUSTERED (CustomerID),

    INDEX IX_CustomerMemory_CustomerCode
        NONCLUSTERED (CustomerCode)
)
WITH
(
    MEMORY_OPTIMIZED = ON,
    DURABILITY = SCHEMA_AND_DATA
);
GO

INSERT INTO dbo.CustomerMemory
(
    CustomerCode,
    CustomerName
)
VALUES
('CUST001', 'Customer One'),
('CUST002', 'Customer Two'),
('CUST003', 'Customer Three'),
('CUST004', 'Customer Four'),
('CUST005', 'Customer Five');
GO


--GENERATE WORKLOAD

DECLARE @i INT = 1;

WHILE @i <= 10000
BEGIN
    INSERT INTO dbo.CustomerMemory
    (
        CustomerCode,
        CustomerName
    )
    VALUES
    (
        CONCAT('CUST', RIGHT('000000' + CAST(@i AS VARCHAR(6)), 6)),
        CONCAT('Customer ', @i)
    );

    SET @i += 1;
END;
GO

--CHECK XTP MEMORY USAGE

SELECT
    DB_NAME(DB_ID()) AS database_name,
    memory_used_by_table_kb,
    memory_used_by_indexes_kb,
    memory_used_by_table_kb +
        memory_used_by_indexes_kb AS total_memory_used_kb
FROM sys.dm_db_xtp_table_memory_stats
 
GO

