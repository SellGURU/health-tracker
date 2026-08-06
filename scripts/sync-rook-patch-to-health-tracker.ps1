# Sync fixed capacitor-rook-sdk patch into C:\mobile\health-tracker (or a custom path)
# and re-apply it so assembleRelease no longer hits Forbidden vararg Result<*>.
#
# Usage:
#   powershell -File scripts\sync-rook-patch-to-health-tracker.ps1
#   powershell -File scripts\sync-rook-patch-to-health-tracker.ps1 -TargetRoot C:\mobile\health-tracker

param(
  [string]$TargetRoot = "C:\mobile\health-tracker",
  [string]$SourceRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

$srcPatch = Join-Path $SourceRoot "patches\capacitor-rook-sdk+0.5.1.patch"
$dstPatchDir = Join-Path $TargetRoot "patches"
$dstPatch = Join-Path $dstPatchDir "capacitor-rook-sdk+0.5.1.patch"
$dstRook = Join-Path $TargetRoot "node_modules\capacitor-rook-sdk"

if (-not (Test-Path $srcPatch)) {
  throw "Source patch not found: $srcPatch"
}
if (-not (Test-Path $TargetRoot)) {
  throw "Target project not found: $TargetRoot"
}

New-Item -ItemType Directory -Force -Path $dstPatchDir | Out-Null
Copy-Item -Force $srcPatch $dstPatch
Write-Host "Copied patch -> $dstPatch"

if (Test-Path $dstRook) {
  Remove-Item -Recurse -Force $dstRook
  Write-Host "Removed old node_modules\capacitor-rook-sdk"
}

Push-Location $TargetRoot
try {
  npm install capacitor-rook-sdk@0.5.1 --no-save
  npx patch-package
  $kt = "node_modules\capacitor-rook-sdk\android\src\main\java\io\tryrook\rook\sdk\RookImplementation.kt"
  if (-not (Test-Path $kt)) { throw "Patched Kotlin file missing: $kt" }
  $hit = Select-String -Path $kt -Pattern "isResultRoomMigrationError" -SimpleMatch
  $bad = Select-String -Path $kt -Pattern "vararg results: Result" -SimpleMatch
  if (-not $hit) { throw "Patch did not apply (isResultRoomMigrationError missing)" }
  if ($bad) { throw "Old vararg signature still present" }
  Write-Host "OK: patch applied. Rebuild with: cd android; .\gradlew.bat assembleRelease"
}
finally {
  Pop-Location
}
