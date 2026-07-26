# TheoEngine manual file-copy installer
$ErrorActionPreference = 'Stop'
$source = Join-Path (Split-Path -Parent $PSScriptRoot) 'extension'
$default = Join-Path $env:APPDATA 'Adobe\CEP\extensions\com.theo.engine'
Write-Host "TheoEngine manual file-copy installer"
Write-Host "Recommended destination: $default"
$inputPath = Read-Host 'Destination path (press Enter for recommended path)'
$destination = if ([string]::IsNullOrWhiteSpace($inputPath)) { $default } else { $inputPath.Trim() }
if (-not (Test-Path (Join-Path $source 'index.html'))) { throw 'The extension folder is missing.' }
if (-not (Test-Path (Join-Path $source 'CSXS\manifest.xml'))) { throw 'The CEP manifest is missing.' }
New-Item -ItemType Directory -Path $destination -Force | Out-Null
Copy-Item -Path (Join-Path $source '*') -Destination $destination -Recurse -Force
Write-Host "TheoEngine copied to $destination"
Write-Host 'No registry settings, downloads, or administrator access were used.'
