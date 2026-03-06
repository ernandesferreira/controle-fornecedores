# Controle de Fornecedores

Sistema em Next.js para cadastro de fornecedores, comparação de preços por categoria e controle de acesso do gestor.

## Recursos

- Login do gestor
- Setup inicial para criar o primeiro usuário
- CRUD de usuários
- CRUD de fornecedores
- Comparativo de preços com média dos 3 menores valores
- Flag de dropshipping e filtros na listagem

## Como rodar

```bash
npm install
npx prisma migrate dev --name init_auth_users
npm run dev
```

## Variáveis de ambiente

Use o arquivo `.env`:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="troque-esta-chave-em-producao"
```
