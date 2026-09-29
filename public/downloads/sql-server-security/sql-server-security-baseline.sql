/* SQL Server Security Baseline (read-only)
   Run in SSMS as an authorized DBA/security reviewer.
   Recommended permission: VIEW SERVER STATE, VIEW ANY DEFINITION, and read access to msdb.
   This script changes no configuration. Review findings in their business context. */
SET NOCOUNT ON;

PRINT '1. Instance and authentication';
SELECT @@SERVERNAME AS server_name,
 CAST(SERVERPROPERTY('ProductVersion') AS nvarchar(128)) AS product_version,
 CAST(SERVERPROPERTY('ProductLevel') AS nvarchar(128)) AS product_level,
 CAST(SERVERPROPERTY('Edition') AS nvarchar(128)) AS edition,
 CASE CAST(SERVERPROPERTY('IsIntegratedSecurityOnly') AS int) WHEN 1 THEN 'Windows authentication only' ELSE 'Mixed mode' END AS authentication_mode;

SELECT name, type_desc, is_disabled, create_date, modify_date
FROM sys.server_principals
WHERE name = 'sa' OR (type IN ('S','U','G') AND name NOT LIKE '##%')
ORDER BY CASE WHEN name = 'sa' THEN 0 ELSE 1 END, name;

PRINT '2. Members of sysadmin';
SELECT member.name AS principal_name, member.type_desc, member.is_disabled
FROM sys.server_role_members AS rm
JOIN sys.server_principals AS rolep ON rolep.principal_id = rm.role_principal_id
JOIN sys.server_principals AS member ON member.principal_id = rm.member_principal_id
WHERE rolep.name = 'sysadmin' ORDER BY member.name;

PRINT '3. Security-sensitive configuration';
SELECT name, value, value_in_use, is_dynamic
FROM sys.configurations
WHERE name IN ('Ad Hoc Distributed Queries','Agent XPs','clr enabled','clr strict security',
 'contained database authentication','cross db ownership chaining','Database Mail XPs',
 'external scripts enabled','Ole Automation Procedures','remote access',
 'remote admin connections','scan for startup procs','xp_cmdshell')
ORDER BY name;

PRINT '4. Linked servers and endpoints';
SELECT name, product, provider, data_source, is_linked, is_remote_login_enabled,
 is_rpc_out_enabled, is_data_access_enabled
FROM sys.servers WHERE server_id <> 0 ORDER BY name;
SELECT name, type_desc, state_desc, protocol_desc, is_admin_endpoint
FROM sys.endpoints ORDER BY type_desc, name;

PRINT '5. SQL Server Audit state';
SELECT name, type_desc, on_failure_desc, is_state_enabled, queue_delay, log_file_path
FROM sys.server_audits ORDER BY name;
SELECT name, is_state_enabled, create_date, modify_date
FROM sys.server_audit_specifications ORDER BY name;

PRINT '6. Encryption and recovery posture by database';
SELECT d.name, d.state_desc, d.recovery_model_desc, d.page_verify_option_desc,
 d.is_encrypted, dek.encryption_state, dek.encryption_state_desc, dek.encryptor_type
FROM sys.databases AS d
LEFT JOIN sys.dm_database_encryption_keys AS dek ON dek.database_id = d.database_id
WHERE d.database_id > 4 ORDER BY d.name;

PRINT '7. SQL Agent jobs, owners, and executable subsystems';
SELECT j.name AS job_name, SUSER_SNAME(j.owner_sid) AS owner_name, j.enabled,
 s.step_id, s.step_name, s.subsystem, s.proxy_id,
 LEFT(REPLACE(REPLACE(s.command, CHAR(13), ' '), CHAR(10), ' '), 240) AS command_preview,
 j.date_modified
FROM msdb.dbo.sysjobs AS j
JOIN msdb.dbo.sysjobsteps AS s ON s.job_id = j.job_id
ORDER BY j.name, s.step_id;

PRINT '8. Backup recency (history only; this does not prove the files still exist)';
SELECT d.name AS database_name,
 MAX(CASE WHEN b.type = 'D' THEN b.backup_finish_date END) AS last_full,
 MAX(CASE WHEN b.type = 'I' THEN b.backup_finish_date END) AS last_differential,
 MAX(CASE WHEN b.type = 'L' THEN b.backup_finish_date END) AS last_log
FROM sys.databases AS d LEFT JOIN msdb.dbo.backupset AS b ON b.database_name = d.name
WHERE d.database_id > 4 GROUP BY d.name ORDER BY d.name;

PRINT 'Investigate unexpected privilege, enabled features, remote paths, job steps, missing audits, and backup gaps. Do not disable a feature until its dependency and rollback plan are known.';
