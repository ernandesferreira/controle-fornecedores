# Controle de Fornecedores

Projeto pronto para Vercel + PostgreSQL.

## Variáveis

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
AUTH_SECRET="troque-esta-chave"
```

## Rodar localmente

```bash
npm install
npx prisma db push
npm run dev
```

## Primeiro acesso

1. Acesse `/setup`
2. Crie o primeiro gestor
3. Depois use `/login`

## Deploy na Vercel

1. Suba no GitHub
2. Importe no Vercel
3. Configure `DATABASE_URL` e `AUTH_SECRET`
4. Rode `npx prisma db push` uma vez contra o banco remoto
