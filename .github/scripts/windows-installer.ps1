$ErrorActionPreference = 'Stop'

$portable = Join-Path $env:RUNNER_TEMP "portable-dist/$env:PORTABLE_NAME"
$resources = @{}
Get-ChildItem -LiteralPath $portable -Filter '*.dll' -File | ForEach-Object {
  $resources[$_.FullName] = $_.Name
}
if ($resources.Count -eq 0) { throw 'No runtime DLLs are available for the installer.' }

# Reuse the tested runtime DLLs, without the portable data/ marker.
$override = Join-Path $env:RUNNER_TEMP 'installer-config.json'
@{ bundle = @{ resources = $resources } } | ConvertTo-Json -Depth 5 |
  Set-Content -LiteralPath $override -Encoding utf8
Push-Location app
try {
  npm run tauri -- bundle --ci --bundles nsis --target x86_64-pc-windows-msvc --config $override
  if ($LASTEXITCODE -ne 0) { throw 'Failed to build NSIS installer.' }
} finally { Pop-Location }

$config = Get-Content app/src-tauri/tauri.conf.json -Raw | ConvertFrom-Json
$name = "Whats.LLM_$($config.version)_x64-setup.exe"
$source = @(Get-ChildItem 'app/src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis' -Filter '*-setup.exe' -File)
if ($source.Count -ne 1) { throw 'Expected exactly one NSIS installer.' }
$dist = Join-Path $env:RUNNER_TEMP 'installer-dist'
New-Item -ItemType Directory -Path $dist -Force | Out-Null
$installer = Join-Path $dist $name
Copy-Item -LiteralPath ($source[0].FullName) -Destination $installer

# Install into this disposable CI machine and verify the installed app.
# NSIS requires /D to be last and unquoted, including when the path has spaces.
$folder = Join-Path $env:RUNNER_TEMP 'installer-smoke'
$setup = Start-Process -FilePath $installer -ArgumentList "/S /D=$folder" -Wait -PassThru
if ($setup.ExitCode -ne 0) { throw "Installer failed with exit code $($setup.ExitCode)." }
$exe = Join-Path $folder 'whats-llm.exe'
if (-not (Test-Path -LiteralPath $exe -PathType Leaf)) { throw 'Installed executable is missing.' }
if (Test-Path -LiteralPath "$folder/data") { throw 'Installed app must not contain portable data/.' }
foreach ($dll in @('msvcp140.dll', 'msvcp140_1.dll', 'vcruntime140.dll', 'vcruntime140_1.dll')) {
  if (-not (Test-Path -LiteralPath (Join-Path $folder $dll) -PathType Leaf)) {
    throw "Installed runtime DLL is missing: $dll"
  }
}

$db = Join-Path $env:APPDATA "$($config.identifier)/whatsllm.db"
if (Test-Path -LiteralPath $db) { throw 'Installed startup test requires a fresh database.' }
$env:PATH = "$env:SystemRoot\System32;$env:SystemRoot"
$env:WEBVIEW2_USER_DATA_FOLDER = Join-Path $env:RUNNER_TEMP 'installer-webview-profile'
$appProcess = Start-Process -FilePath $exe -WorkingDirectory $folder -PassThru
try {
  for ($attempt = 0; $attempt -lt 20; $attempt++) {
    Start-Sleep -Seconds 1
    $appProcess.Refresh()
    if ($appProcess.HasExited) { throw "Installed app exited with code $($appProcess.ExitCode)." }
    if (($attempt -ge 4) -and (Test-Path -LiteralPath $db)) { break }
  }
  if (-not (Test-Path -LiteralPath $db)) { throw 'Installed app did not initialize its app-data database.' }
  Write-Host 'NSIS installation and installed app startup passed; app-data database created.'
} finally {
  $appProcess.Refresh()
  if (-not $appProcess.HasExited) { Stop-Process -Id $appProcess.Id -Force }
}

$checksum = "$installer.sha256"
$hash = (Get-FileHash -LiteralPath $installer -Algorithm SHA256).Hash.ToLowerInvariant()
"$hash  $name" | Set-Content -LiteralPath $checksum -Encoding ascii
"exe=$installer" >> $env:GITHUB_OUTPUT
"checksum=$checksum" >> $env:GITHUB_OUTPUT
