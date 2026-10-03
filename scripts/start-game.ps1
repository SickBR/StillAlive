param([switch]$ValidateOnly)

$ErrorActionPreference = 'Stop'
$projectPath = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectPath

try {
    $nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
    $nodePath = if ($nodeCommand) { $nodeCommand.Source } else { $null }
    if (-not $nodePath) {
        $nodeCandidates = @(
            (Join-Path $env:ProgramFiles 'nodejs\node.exe'),
            (Join-Path $env:LOCALAPPDATA 'Programs\nodejs\node.exe'),
            (Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe')
        )
        $nodePath = $nodeCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
    }
    if (-not $nodePath) {
        throw 'Node.js fehlt. Bitte Node.js ab Version 22.12 mit npm installieren und erneut starten.'
    }
    $env:PATH = (Split-Path -Parent $nodePath) + ';' + $env:PATH
    $vitePath = Join-Path $projectPath 'node_modules\vite\bin\vite.js'
    $phaserPath = Join-Path $projectPath 'node_modules\phaser\package.json'

    if ($ValidateOnly) {
        Write-Output ('Startdatei korrekt. Node.js: ' + $nodePath)
        Write-Output ('Spielbibliotheken vorhanden: ' + ((Test-Path -LiteralPath $vitePath) -and (Test-Path -LiteralPath $phaserPath)))
        exit 0
    }

    if (-not ((Test-Path -LiteralPath $vitePath) -and (Test-Path -LiteralPath $phaserPath))) {
        Write-Host 'Erster Start: Die Spielbibliotheken werden installiert ...'
        $npmCommand = Get-Command npm.cmd -ErrorAction SilentlyContinue
        if ($npmCommand) {
            & $npmCommand.Source install
        } else {
            $npmCandidates = @(
                (Join-Path (Split-Path -Parent $nodePath) 'node_modules\npm\bin\npm-cli.js'),
                (Join-Path $env:APPDATA 'npm\node_modules\npm\bin\npm-cli.js')
            )
            $npmPath = $npmCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
            if (-not $npmPath) {
                $npmCache = Join-Path $env:LOCALAPPDATA 'pnpm\store\v11\links\@\npm'
                if (Test-Path -LiteralPath $npmCache) {
                    $npmPath = Get-ChildItem -LiteralPath $npmCache -Filter 'npm-cli.js' -File -Recurse | Select-Object -First 1 -ExpandProperty FullName
                }
            }
            if (-not $npmPath) { throw 'npm fehlt. Bitte Node.js mit npm installieren und erneut starten.' }
            & $nodePath $npmPath install
        }
        if ($LASTEXITCODE -ne 0) { throw 'Installation fehlgeschlagen. Internetverbindung und die Meldungen oben pruefen.' }
    }

    $gameUrl = 'http://127.0.0.1:5183/'
    $running = $null
    try { $running = Invoke-WebRequest -Uri $gameUrl -UseBasicParsing -TimeoutSec 2 } catch { }
    if ($running -and $running.Content.Contains('<title>STILLALIVE V3</title>')) {
        Write-Host 'STILLALIVE V3 laeuft bereits. Der Browser wird geoeffnet.'
        Start-Process -FilePath $gameUrl -WindowStyle Hidden
        exit 0
    }
    Write-Host 'STILLALIVE V3 wird im Browser geoeffnet.'

    Write-Host 'Dieses Fenster waehrend des Spielens offen lassen. Zum Beenden das Fenster schliessen.'
    & $nodePath $vitePath --host 127.0.0.1 --port 5183 --strictPort --open
    exit $LASTEXITCODE
} catch {
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
