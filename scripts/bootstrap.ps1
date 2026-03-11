param(
  [switch]$SkipBuild,
  [switch]$RunDev
)

$ErrorActionPreference = "Stop"

function Run-Step {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][scriptblock]$Command
  )

  Write-Host $Name
  & $Command

  if ($LASTEXITCODE -ne 0) {
    Write-Host "Falha em: $Name"
    exit $LASTEXITCODE
  }
}

Write-Host "== Auto setup: controle-fornecedores =="

if (-not (Test-Path ".env")) {
  if (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env"
    Write-Host "Arquivo .env criado a partir de .env.example"
    Write-Host "Preencha DATABASE_URL e AUTH_SECRET no .env antes de continuar."
    exit 1
  }

  Write-Host "Arquivo .env nao encontrado e .env.example tambem nao existe."
  exit 1
}

Run-Step -Name "Instalando dependencias..." -Command { npm ci }

Run-Step -Name "Aplicando migrations..." -Command { npx --no-install prisma migrate deploy }

if (-not $SkipBuild) {
  Run-Step -Name "Executando build..." -Command { npm run build }
}

if ($RunDev) {
  Run-Step -Name "Iniciando servidor de desenvolvimento..." -Command { npm run dev }
} else {
  Write-Host "Setup concluido."
  Write-Host "Para rodar em desenvolvimento: npm run dev"
}
