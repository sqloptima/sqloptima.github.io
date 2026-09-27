/*
  Lab disk paths
  --------------
  Use C:\SQLLab\InMemoryOLTP when the host only has a C: drive.
  Use D:\SQLLab\InMemoryOLTP when a D: drive exists (search-and-replace the prefix below).
  Backup files are written to the lab root. The SQL Server service account needs Modify on that folder.
*/
USE master;
GO

DROP TABLE IF EXISTS InMemoryOLTP_Demo.dbo.CustomerMemory

BACKUP DATABASE InMemoryOLTP_Demo
TO DISK = 'C:\SQLLab\InMemoryOLTP\InMemoryOLTP_Demonew.BAK'
WITH INIT, STATS = 10;
GO

BACKUP LOG InMemoryOLTP_Demo
TO DISK = 'C:\SQLLab\InMemoryOLTP\InMemoryOLTP_Demo_Undeploy.trn'
WITH INIT, STATS = 10;
GO

CHECKPOINT;

--wait for few mins and check the deployment_state_desc

SELECT
    deployment_state,
    deployment_state_desc,
    undeploy_lsn,
    start_of_log_lsn
FROM InMemoryOLTP_Demo.sys.dm_db_xtp_undeploy_status;

-- start_of_log_lsn > undeploy_lsn  Wait about a minute and check again

ALTER DATABASE InMemoryOLTP_Demo
REMOVE FILE InMemoryOLTP_Demo_XTP_Container;
GO

--while it is removing the file, open another window and issue this command
BACKUP LOG InMemoryOLTP_Demo
TO DISK = 'C:\SQLLab\InMemoryOLTP\InMemoryOLTP_Demo_Undeploy_02.trn'
WITH INIT, STATS = 10;
GO


--once the XTP file is removed then remove the filegroup as well

ALTER DATABASE InMemoryOLTP_Demo
REMOVE FILEGROUP InMemoryOLTP_Demo_XTP;
GO



USE InMemoryOLTP_Demo;
GO

SELECT
    deployment_state,
    deployment_state_desc,
    undeploy_lsn,
    start_of_log_lsn
FROM sys.dm_db_xtp_undeploy_status;
GO



BACKUP LOG InMemoryOLTP_Demo
TO DISK = 'C:\SQLLab\InMemoryOLTP\InMemoryOLTP_Demo_Undeploy.trn'
WITH INIT, STATS = 10;
GO

