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

function Test-BraveInstalled {
    $roots = @($env:ProgramFiles, ${env:ProgramFiles(x86)}, $env:LOCALAPPDATA)
    foreach ($root in $roots) {
        if (-not $root) { continue }
        $candidate = Join-Path $root 'BraveSoftware\Brave-Browser\Application\brave.exe'
        if (Test-Path -LiteralPath $candidate -PathType Leaf) { return $candidate }
    }
    return $null
}

Write-Banner
Write-Host "$Dim  This installer asks before making each change.$Reset"
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
Write-Host "$Dim  Optional: Brave provides reliable external YouTube, TikTok, and Telegram browsing.$Reset"
Write-Host "$Dim  It does not replace Adobe CEP's embedded browser engine.$Reset"

if (Read-YesNo 'Install Brave browser from the official Brave website?') {
    $existingBrave = Test-BraveInstalled
    if ($existingBrave) {
        Write-Success ("Brave is already installed at " + $existingBrave)
    } else {
        $BraveUrl = 'https://laptop-updates.brave.com/latest/winx64'
        $BraveInstaller = Join-Path $env:TEMP 'BraveBrowserSetup.exe'
        try {
            Write-Host "$Cyan  Downloading Brave from the official Brave endpoint...$Reset"
            Invoke-WebRequest -Uri $BraveUrl -OutFile $BraveInstaller -UseBasicParsing
            if (-not (Test-Path -LiteralPath $BraveInstaller -PathType Leaf)) { throw 'The Brave installer was not downloaded.' }
            if ((Get-Item -LiteralPath $BraveInstaller).Length -lt 100000) { throw 'The downloaded Brave installer is unexpectedly small.' }

            Write-Host "$Cyan  Starting the Brave installer...$Reset"
            $process = Start-Process -FilePath $BraveInstaller -PassThru -Wait
            if ($process.ExitCode -ne 0) { throw "Brave installer exited with code $($process.ExitCode)." }

            $installedBrave = Test-BraveInstalled
            if ($installedBrave) { Write-Success 'Brave was installed successfully.' }
            else { Write-Success 'Brave installer completed. Finish any prompts it opened if needed.' }
        } catch {
            Write-Failure ("Brave installation failed: " + $_.Exception.Message)
            Write-Host "$Amber  TheoEngine is still installed and ready to use.$Reset"
        } finally {
            if (Test-Path -LiteralPath $BraveInstaller) { Remove-Item -LiteralPath $BraveInstaller -Force -ErrorAction SilentlyContinue }
        }
    }
} else {
    Write-Host "$Amber  Brave installation skipped. TheoEngine is still fully installed.$Reset"
}

Write-Host ""
Write-Host "$Green  +----------------------------------------------------+$Reset"
Write-Host "$Green  |                    [ CHECK ]                       |$Reset"
Write-Host "$Green  +----------------------------------------------------+$Reset"
Write-Host "$Green  You chose the best option - well, the only option.$Reset"
Write-Host "$Green  There ain't no better extension.$Reset"
Write-Host "$Pink  made by @theoaep on telegram$Reset"
Write-Host ""
Write-Host "$Cyan  Next:$Reset"
Write-Host "    1. Fully close After Effects if it is open."
Write-Host "    2. Open After Effects."
Write-Host "    3. Window > Extensions > TheoEngine"
Write-Host ""
Read-Host 'Press Enter to close' | Out-Null
