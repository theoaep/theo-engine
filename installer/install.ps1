[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$PackageRoot = Split-Path -Parent $PSScriptRoot
$Source = Join-Path $PackageRoot 'extension'
$Destination = Join-Path $env:APPDATA 'Adobe\CEP\extensions\com.theo.engine'

if (-not (Test-Path -LiteralPath (Join-Path $Source 'index.html') -PathType Leaf) -or
    -not (Test-Path -LiteralPath (Join-Path $Source 'CSXS\manifest.xml') -PathType Leaf)) {
    Write-Error 'The extension files are missing. Keep this script beside the extension folder.'
    exit 1
}

New-Item -ItemType Directory -Path $Destination -Force | Out-Null
& robocopy $Source $Destination /E /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Could not copy TheoEngine files (robocopy exit $LASTEXITCODE)." }
Write-Host "TheoEngine files copied to $Destination"
Write-Host 'No registry, browser, or external software changes were made.'
