<# Tests a certificate-validated encrypted SQL Server connection.
   Example: .\test-sqlserver-tls.ps1 -ServerInstance 'sql01.example,1433' #>
[CmdletBinding()]
param(
 [Parameter(Mandatory)] [string] $ServerInstance,
 [string] $Database = 'master',
 [int] $TimeoutSeconds = 15
)

$builder = [System.Data.SqlClient.SqlConnectionStringBuilder]::new()
$builder['Data Source'] = $ServerInstance
$builder['Initial Catalog'] = $Database
$builder['Integrated Security'] = $true
$builder['Encrypt'] = $true
$builder['TrustServerCertificate'] = $false
$builder['Connect Timeout'] = $TimeoutSeconds
$builder['Application Name'] = 'SQL Optima TLS validation check'
$connection = [System.Data.SqlClient.SqlConnection]::new($builder.ConnectionString)
try {
 $connection.Open()
 $command = $connection.CreateCommand()
 $command.CommandText = @'
SELECT @@SERVERNAME AS server_name, c.encrypt_option, c.auth_scheme,
       c.net_transport, c.protocol_type
FROM sys.dm_exec_connections AS c WHERE c.session_id = @@SPID;
'@
 $reader = $command.ExecuteReader()
 $table = [System.Data.DataTable]::new()
 $table.Load($reader)
 $table | Format-Table -AutoSize
 if ($table.Rows[0].encrypt_option -ne 'TRUE') { throw 'The session did not report encryption.' }
 Write-Host 'PASS: encrypted connection established and the server certificate was validated.' -ForegroundColor Green
} catch {
 Write-Error "TLS validation failed: $($_.Exception.Message)"
 Write-Host 'Check certificate subject/SAN, trust chain, expiry, SQL binding, and client name. Do not enable TrustServerCertificate.' -ForegroundColor Yellow
 exit 1
} finally {
 if ($connection.State -ne [System.Data.ConnectionState]::Closed) { $connection.Close() }
 $connection.Dispose()
}
