<# Runs the read-only baseline and saves hashed evidence.
   Example: .\invoke-sql-security-review.ps1 -ServerInstance 'sql01.example' #>
[CmdletBinding()]
param(
 [Parameter(Mandatory)] [string] $ServerInstance,
 [string] $Database = 'master',
 [string] $OutputDirectory = '.\sql-security-evidence',
 [string] $BaselineScript = (Join-Path $PSScriptRoot 'sql-server-security-baseline.sql')
)
if (-not (Get-Command Invoke-Sqlcmd -ErrorAction SilentlyContinue)) {
 throw 'Invoke-Sqlcmd was not found. Install the signed SqlServer PowerShell module after reviewing your organization policy.'
}
if (-not (Test-Path -LiteralPath $BaselineScript -PathType Leaf)) { throw "Baseline script not found: $BaselineScript" }
$destination = New-Item -ItemType Directory -Path $OutputDirectory -Force
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$safeServerName = $ServerInstance -replace '[^a-zA-Z0-9._-]', '_'
$outputFile = Join-Path $destination.FullName "$safeServerName-$stamp.txt"
Invoke-Sqlcmd -ServerInstance $ServerInstance -Database $Database -InputFile $BaselineScript `
 -Encrypt Mandatory -TrustServerCertificate:$false -AbortOnError -OutputAs DataRows |
 Format-Table -AutoSize | Out-File -LiteralPath $outputFile -Encoding utf8
$hash = Get-FileHash -LiteralPath $outputFile -Algorithm SHA256
$hash | Format-List | Out-File -LiteralPath "$outputFile.sha256.txt" -Encoding utf8
Write-Host "Evidence: $outputFile"
Write-Host "SHA-256: $($hash.Hash)"
