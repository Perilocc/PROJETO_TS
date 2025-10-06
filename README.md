# 🚗 Locadora de Veículos - API REST

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16.3-2D3748.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192.svg)](https://www.postgresql.org/)

## 🚀 Como Rodar a Aplicação

### 📋 Pré-requisitos

- **Node.js** - versão 18 ou superior
- **npm**
- **Docker** e **Docker Compose**
- **Git**

### 1️⃣ **Clone o Repositório**

```bash
git clone https://github.com/Perilocc/PROJETO_TS.git
cd PROJETO_TS
```
### 2️⃣ **Configure o Banco de Dados**

#### Inicie o PostgreSQL com Docker:

```bash
docker-compose up -d
```

Isso irá:

- Criar um container PostgreSQL na porta **5433**
- Configurar usuário: `locadora`, senha: `senha123`
- Criar banco de dados: `locadora_db`

### 3️⃣ **Instale as Dependências**

```bash
cd api
npm install
```

### 4️⃣ **Configure as Variáveis de Ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
PORT=3333
DATABASE_URL=postgresql://locadora:senha123@localhost:5432/locadora_db
```

### 5️⃣ **Execute as Migrações do Banco**

```bash
# Gerar o Prisma Client
npx prisma generate

# Executar migrações
npx prisma migrate dev
```

### 6️⃣ **Inicie a Aplicação**

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build
npm start
```

A aplicação estará disponível em: **http://localhost:3333**