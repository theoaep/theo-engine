[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Esc = [char]27
$Cyan = "$Esc[96m"
$Pink = "$Esc[95m"
$Green = "$Esc[92m"
$Red = "$Esc[91m"
$Amber = "$Esc[93m"
$Dim = "$Esc[90m"
$Reset = "$Esc[0m"

function Write-Banner {
    Clear-Host
    Write-Host ""
    Write-Host "$Pink  +====================================================+$Reset"
    Write-Host "$Pink  |$Reset$Cyan          T H E O   E N G I N E                  $Pink|$Reset"
    Write-Host "$Pink  |$Reset$Dim          AFTER EFFECTS CREATIVE TOOLKIT          $Pink|$Reset"
    Write-Host "$Pink  |$Reset$Amber          INSTALLER  /  CEP PANEL                $Pink|$Reset"
    Write-Host "$Pink  +====================================================+$Reset"
    Write-Host ""
    Write-Host "$Dim  ------------------------------------------------------$Reset"
    Write-Host "$Cyan  TheoEngine$Reset  $Dim|$Reset  setup assistant"
    Write-Host "$Dim  ------------------------------------------------------$Reset"
    Write-Host ""
}

function Read-YesNo([string]$Prompt) {
    while ($true) {
        $answer = (Read-Host "$Prompt [Y/N]").Trim().ToUpperInvariant()
        if ($answer -eq 'Y' -or $answer -eq 'YES') { return $true }
        if ($answer -eq 'N' -or $answer -eq 'NO') { return $false }
        Write-Host "$Amber  Please enter Y or N.$Reset"
    }
}

function Write-Success([string]$Message) { Write-Host "$Green  [OK] $Message$Reset" }
function Write-Failure([string]$Message) { Write-Host "$Red  [X] $Message$Reset" }

Write-Banner
Write-Host "$Dim  Local TheoEngine CEP installer — no browser or external installer is used.$Reset"
Write-Host "$Dim  CEP support requires PlayerDebugMode for this unsigned extension.$Reset"
Write-Host ""

if (-not (Read-YesNo 'Install TheoEngine for After Effects?')) {
    Write-Host "$Amber  Installation cancelled. Nothing was changed.$Reset"
    Write-Host ""
    Read-Host 'Press Enter to close' | Out-Null
    exit 0
}

$PackageRoot = Split-Path -Parent $PSScriptRoot
$Source = Join-Path $PackageRoot 'extension'
$Destination = Join-Path $env:APPDATA 'Adobe\CEP\extensions\com.theo.engine'
$RequiredFile = Join-Path $Source 'index.html'
$RequiredManifest = Join-Path $Source 'CSXS\manifest.xml'

if (-not (Test-Path -LiteralPath $RequiredFile -PathType Leaf) -or
    -not (Test-Path -LiteralPath $RequiredManifest -PathType Leaf)) {
    Write-Failure 'The extension files are missing. Keep the installer and extension folders together.'
    Read-Host 'Press Enter to close' | Out-Null
    exit 1
}

try {
    Write-Host ""
    Write-Host "$Cyan  Enabling Adobe CEP support (PlayerDebugMode)...$Reset"
    foreach ($version in 9, 10, 11, 12) {
        $key = "HKCU:\Software\Adobe\CSXS.$version"
        if (-not (Test-Path -LiteralPath $key)) { New-Item -Path $key -Force | Out-Null }
        New-ItemProperty -Path $key -Name 'PlayerDebugMode' -PropertyType String -Value '1' -Force | Out-Null
    }

    Write-Host "$Cyan  Installing extension to:$Reset $Destination"
    Write-Host "$Dim  Preservation mode: destination-only files are never deleted; localStorage, cookies, presets, and projects remain intact.$Reset"
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
    $robocopyArgs = @(
        $Source, $Destination,
        '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/NP'
    )
    & robocopy @robocopyArgs | Out-Null
    $copyCode = $LASTEXITCODE
    if ($copyCode -ge 8) { throw "Robocopy failed with exit code $copyCode." }
    Write-Success 'TheoEngine was installed successfully.'
} catch {
    Write-Failure ("Extension installation failed: " + $_.Exception.Message)
    Read-Host 'Press Enter to close' | Out-Null
    exit 1
}

Write-Host ""
Write-Host "$Green  +----------------------------------------------------+$Reset"
Write-Host "$Green  |                 INSTALL COMPLETE                  |$Reset"
Write-Host "$Green  +----------------------------------------------------+$Reset"
Write-Host "$Dim  TheoEngine only installs the local CEP panel.$Reset"
Write-Host "$Dim  It does not install a browser or download external software.$Reset"
Write-Host ""
Write-Host "$Cyan  Next:$Reset"
Write-Host "    1. Fully close After Effects if it is open."
Write-Host "    2. Open After Effects."
Write-Host "    3. Window > Extensions > TheoEngine"
Write-Host ""
Read-Host 'Press Enter to close' | Out-Null
