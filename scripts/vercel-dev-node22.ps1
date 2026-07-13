$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$nodeDir = Join-Path $root ".tools\node-v22.23.0-win-x64"
$nodeExe = Join-Path $nodeDir "node.exe"
$vercelCli = Join-Path $root "web\node_modules\vercel\dist\vc.js"

if (-not (Test-Path -LiteralPath $nodeExe)) {
  throw "Node 22 portatil no esta instalado en .tools. Usa Node 22 mediante nvm o descarga la distribucion indicada en web/.nvmrc."
}
if (-not (Test-Path -LiteralPath $vercelCli)) {
  throw "Falta Vercel CLI. Ejecuta npm install dentro de web con Node 22."
}

$env:PATH = "$nodeDir;$env:PATH"
Set-Location (Join-Path $root "web")
& $nodeExe $vercelCli dev --listen 3005
