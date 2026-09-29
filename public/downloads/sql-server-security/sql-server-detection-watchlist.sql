/* Read-only detection snapshot. Compare output with an approved baseline.
   Send SQL Audit, Windows, identity, EDR, and storage logs to a protected SIEM;
   a polling script alone is not a detection programme. */
SET NOCOUNT ON;

SELECT 'High-risk configuration enabled' AS event_name, name AS object_name,
 CONVERT(nvarchar(256), value_in_use) AS observed_value,
 'Review business justification and change record' AS response
FROM sys.configurations
WHERE name IN ('xp_cmdshell','Ole Automation Procedures','external scripts enabled',
 'Ad Hoc Distributed Queries','cross db ownership chaining','clr enabled') AND value_in_use = 1
UNION ALL
SELECT 'SQL login enabled', name, 'enabled', 'Confirm owner, purpose, rotation, and last use'
FROM sys.sql_logins WHERE is_disabled = 0 AND name NOT LIKE '##%'
UNION ALL
SELECT 'sysadmin member', member.name, member.type_desc, 'Compare with approved privileged-access list'
FROM sys.server_role_members AS rm
JOIN sys.server_principals AS rolep ON rolep.principal_id = rm.role_principal_id
JOIN sys.server_principals AS member ON member.principal_id = rm.member_principal_id
WHERE rolep.name = 'sysadmin'
UNION ALL
SELECT 'Linked server', name, COALESCE(data_source, '(not reported)'), 'Confirm need, authentication, delegation, and reachable scope'
FROM sys.servers WHERE server_id <> 0
UNION ALL
SELECT 'Server audit disabled', name, type_desc, 'Investigate before re-enabling; preserve available evidence'
FROM sys.server_audits WHERE is_state_enabled = 0
ORDER BY event_name, object_name;

SELECT j.name AS job_name, SUSER_SNAME(j.owner_sid) AS owner_name, j.enabled,
 j.date_created, j.date_modified, s.step_id, s.subsystem, s.proxy_id,
 LEFT(REPLACE(REPLACE(s.command, CHAR(13), ' '), CHAR(10), ' '), 400) AS command_preview
FROM msdb.dbo.sysjobs AS j JOIN msdb.dbo.sysjobsteps AS s ON s.job_id = j.job_id
WHERE s.subsystem IN ('PowerShell','CmdExec','SSIS')
 OR j.date_modified >= DATEADD(day, -7, SYSDATETIME())
ORDER BY j.date_modified DESC, j.name, s.step_id;

-- Optional for an authorized administrator: search the current SQL error log for login failures.
-- EXEC master.dbo.xp_readerrorlog 0, 1, N'Login failed';
