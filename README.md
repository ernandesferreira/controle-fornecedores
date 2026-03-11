# Controle de Fornecedores

Aplicacao Next.js 15 + Prisma para gestao de fornecedores, pronta para ambiente local e deploy na Vercel com PostgreSQL.

## Stack

- Next.js 15.5.12
- React 19
- Prisma 6.19.2
- PostgreSQL

## Variaveis de ambiente

Crie o arquivo `.env` com base em `.env.example` e preencha:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
AUTH_SECRET="troque-esta-chave"
```

## Setup rapido (manual)

```bash
npm ci
npx --no-install prisma migrate deploy
npm run build
npm run dev
```

## Setup automatizado (PowerShell)

Foi adicionado o script [scripts/bootstrap.ps1](scripts/bootstrap.ps1) para automatizar setup local.

Executar setup (instala + migration + opcional build):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bootstrap.ps1
```

Executar setup sem build:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bootstrap.ps1 -SkipBuild
```

Executar setup e iniciar dev no final:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\bootstrap.ps1 -RunDev
```

## Primeiro acesso

1. Acesse `/setup`
2. Crie o primeiro gestor
3. Depois use `/login`

## Validacoes realizadas neste ambiente

- Dependencias instaladas com `npm ci`
- Migration validada com `npx --no-install prisma migrate deploy` (sem pendencias)
- Build de producao validado com `npm run build`
- Auditoria de seguranca validada com `npm audit --omit=dev` (0 vulnerabilidades)
- Rotas testadas localmente:
	- `/login` retornando 200
	- `/setup`, `/suppliers` e `/users` retornando 307 (fluxo esperado com redirecionamento)

## Seguranca e atualizacoes

- O projeto foi atualizado para `next@15.5.12` para corrigir vulnerabilidades reportadas na serie 15.2.x.

## Troubleshooting

- Porta em uso:
	- Se a porta 3000 estiver ocupada, o Next sobe automaticamente em outra porta (ex.: 3002).
- Erro de permissao no Windows durante `npm ci` (`EPERM`):
	- Feche servidores `npm run dev` em execucao e tente novamente.
	- Em alguns casos, antivirus pode bloquear arquivos em `node_modules`.
- Prisma usando versao errada via `npx`:
	- Use `npx --no-install prisma ...` para garantir uso da versao local do projeto.

## Deploy na Vercel

1. Suba no GitHub
2. Importe no Vercel
3. Configure `DATABASE_URL` e `AUTH_SECRET`
4. Rode migration no banco de producao (`npx --no-install prisma migrate deploy`)
