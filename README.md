# 📚 Pos Tech Challenge 2

![Node.js](https://img.shields.io/badge/Node.js-green?logo=node.js) 
![TypeScript](https://img.shields.io/badge/TypeScript-gray?logo=typescript) 
![Prisma](https://img.shields.io/badge/Prisma-0C344B?style=flat&logo=prisma&logoColor=white) 
![Swagger](https://img.shields.io/badge/Swagger-green?logo=swagger) 
![PostgresSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white) 
![Playwright](https://img.shields.io/github/package-json/dependency-version/cawa-93/vite-electron-builder/dev/playwright)

API RESTful desenvolvida com NestJS para gerenciamento de posts e autenticação de usuários, com arquitetura modular e containerizada.

## 🚀 Tecnologias Utilizadas

### Backend
- **[NestJS](https://nestjs.com/)** 11.0.1 - Framework progressivo para Node.js
- **[TypeScript](https://www.typescriptlang.org/)** 5.7.3 - Superset JavaScript com tipagem estática
- **[Node.js](https://nodejs.org/)** 18 (Alpine) - Runtime JavaScript

### Banco de Dados
- **[PostgreSQL](https://www.postgresql.org/)** 15 (Alpine) - Banco de dados relacional
- **[Prisma](https://www.prisma.io/)** 6.16.2 - ORM moderno para TypeScript

### Autenticação & Segurança
- **[@nestjs/jwt](https://docs.nestjs.com/security/authentication)** 11.0.0 - JSON Web Tokens
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** 6.0.0 - Hash de senhas

### Validação & Documentação
- **[class-validator](https://github.com/typestack/class-validator)** 0.14.2 - Validação por decorators
- **[class-transformer](https://github.com/typestack/class-transformer)** 0.5.1 - Transformação de objetos
- **[@nestjs/swagger](https://docs.nestjs.com/openapi/introduction)** 11.2.0 - Documentação OpenAPI/Swagger

### Testes
- **[Playwright](https://playwright.dev/)** 1.55.1 - Framework de testes E2E

### DevOps & CI/CD
- **[Docker](https://www.docker.com/)** - Containerização
- **[Docker Compose](https://docs.docker.com/compose/)** - Orquestração de containers
- **[GitHub Actions](https://github.com/features/actions)** - Pipeline de CI/CD

### Qualidade de Código
- **[ESLint](https://eslint.org/)** 9.18.0 - Linter
- **[Prettier](https://prettier.io/)** 3.4.2 - Formatação de código

---

## 📐 Arquitetura

### Estrutura de Diretórios

```
pos-tech-challenge-2/
├── src/
│   ├── auth/                    # Módulo de autenticação
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── guards/              # Guards de autenticação
│   │   ├── auth.controller.ts   # Endpoints de autenticação
│   │   ├── auth.service.ts      # Lógica de negócio
│   │   └── auth.module.ts       # Módulo NestJS
│   ├── posts/                   # Módulo de posts
│   │   ├── dto/                 # DTOs de posts
│   │   ├── guards/              # Guards customizados
│   │   ├── posts.controller.ts  # Endpoints de posts
│   │   ├── posts.service.ts     # Lógica de negócio
│   │   └── posts.module.ts      # Módulo NestJS
│   ├── health/                  # Health check
│   │   ├── health.controller.ts
│   │   └── health.module.ts
│   ├── prisma/                  # Serviço Prisma
│   │   └── prisma.service.ts
│   ├── app.module.ts            # Módulo raiz
│   └── main.ts                  # Entry point
├── prisma/
│   ├── schema.prisma            # Schema do banco
│   └── migrations/              # Migrações do banco
├── tests/                       # Testes E2E
│   ├── modules/                 # Testes por módulo
│   ├── actions/                 # Helpers de teste
│   └── shared/                  # Utilitários compartilhados
├── scripts/                     # Scripts utilitários
├── .github/workflows/
│   └── ci.yml                   # Pipeline CI/CD
├── docker-compose.yml           # Orquestração Docker
├── Dockerfile                   # Build multi-stage
└── playwright.config.js         # Configuração de testes
```

### Padrões Arquiteturais

- **Arquitetura Modular**: Organização por features (auth, posts, health)
- **Injeção de Dependências**: Container IoC do NestJS
- **Camada de Serviço**: Separação da lógica de negócio
- **Camada de Controller**: Gerenciamento de rotas
- **Guards**: Autenticação e autorização
- **DTOs**: Validação e transformação de dados

---

## 🗄️ Schema do Banco de Dados

### Modelo User
```prisma
model User {
  id       Int      @id @default(autoincrement())
  name     String
  email    String   @unique
  password String
  posts    Post[]
}
```

### Modelo Post
```prisma
model Post {
  id        Int        @id @default(autoincrement())
  title     String
  content   String
  authorId  Int
  author    User       @relation(fields: [authorId], references: [id])
  type      PostType   @default(PUBLIC)
  status    PostStatus @default(ACTIVE)
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}
```

### Enums
- **PostType**: `PUBLIC`, `PRIVATE`
- **PostStatus**: `ACTIVE`, `INACTIVE`

### Relacionamentos
- Um usuário pode ter vários posts (1:N)
- Cada post pertence a um usuário (autor)

---

## 🌐 API Endpoints

### Base URLs
- **Desenvolvimento**: `http://localhost:3000`
- **Swagger UI**: `http://localhost:3000/api`

### Autenticação (`/auth`)

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| POST | `/auth/signup` | ❌ | Registrar novo usuário |
| POST | `/auth/signin` | ❌ | Login e obter token JWT |
| GET | `/auth/me` | ✅ | Obter informações do usuário atual |

### Posts (`/posts`)

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/posts` | ❌ | Listar posts públicos ativos |
| GET | `/posts/all` | ✅ | Listar todos os posts |
| GET | `/posts/search?title=` | ⚠️ | Buscar posts por título |
| GET | `/posts/:id` | ⚠️ | Obter post por ID |
| POST | `/posts` | ✅ | Criar novo post |
| PUT | `/posts/:id` | ✅ | Atualizar post |
| DELETE | `/posts/:id` | ✅ | Deletar post (apenas inativos) |

**Legenda**: ✅ Obrigatório | ❌ Não requerido | ⚠️ Condicional

### Health Check (`/health`)

| Método | Endpoint | Auth | Descrição |
|--------|----------|------|-----------|
| GET | `/health` | ❌ | Verificar status da aplicação |

---

## 🔐 Regras de Negócio

### Autenticação
- Senhas são hasheadas com bcrypt (10 rounds)
- Token JWT retornado no login
- Autorização via Bearer token nos headers

### Gerenciamento de Posts

#### Acesso Público
- `/posts` - Lista apenas posts **PUBLIC + ACTIVE** (sem autenticação)
- `/posts/:id` - Acessa posts **PUBLIC + ACTIVE** sem autenticação

#### Acesso Autenticado
- `/posts/all` - Lista **TODOS** os posts (requer autenticação)
- `/posts/:id` - Acessa posts **PRIVATE** ou **INACTIVE** (requer autenticação)
- Criar, atualizar e deletar posts requerem autenticação

#### Busca
- **Usuários anônimos**: Veem apenas posts **PUBLIC + ACTIVE**
- **Usuários autenticados**: Veem **TODOS** os posts

#### Deleção
- Apenas posts com status **INACTIVE** podem ser deletados
- É necessário inativar o post antes de deletar

---

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
- **Node.js** 18 ou superior
- **Docker** e **Docker Compose**
- **npm** ou **yarn**

### Configuração Inicial

1. **Clone o repositório**
```bash
git clone <repository-url>
cd pos-tech-challenge-2
```

2. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
```

**Variáveis necessárias**:
```env
# Configuração do PostgreSQL
POSTGRES_DB=your_database_name
POSTGRES_USER=your_database_user
POSTGRES_PASSWORD=your_database_password
POSTGRES_PORT=5432

# URL do banco (Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/database

# Secret do JWT
JWT_SECRET=your_jwt_secret_key

# Ambiente (opcional)
NODE_ENV=development
```

### Opção 1: Com Docker (Recomendado)

```bash
# Subir todos os serviços
npm run docker:up

# A aplicação estará disponível em:
# - API: http://localhost:3000
# - Swagger: http://localhost:3000/api
```

**Comandos Docker úteis**:
```bash
# Ver logs
npm run docker:logs

# Parar serviços
npm run docker:down

# Parar e remover volumes
docker-compose down -v
```

### Opção 2: Desenvolvimento Local

```bash
# Instalar dependências
npm ci

# Gerar cliente Prisma
npx prisma generate

# Rodar migrações
npx prisma migrate deploy

# Iniciar em modo desenvolvimento
npm run start:dev
```

---

## 🐳 Configuração Docker

### Serviços no docker-compose.yml

#### 1. PostgreSQL
- **Imagem**: `postgres:15-alpine`
- **Porta**: 5432
- **Volume**: `postgres_data` (persistência)
- **Health Check**: Comando `pg_isready`

#### 2. Prisma Migrate
- **Propósito**: Executar migrações do banco
- **Comando**: `npx prisma migrate deploy`
- **Dependência**: PostgreSQL (healthy)
- **Restart**: no (executa uma vez)

#### 3. Application
- **Build**: Multi-stage Dockerfile
- **Porta**: 3000
- **Health Check**: Endpoint `/health`
- **Dependência**: Prisma Migrate (completed)
- **Restart**: unless-stopped

### Dockerfile Multi-Stage

**Stage 1 (builder)**:
- Base: `node:18-alpine`
- Instala dependências
- Gera cliente Prisma
- Build do TypeScript

**Stage 2 (production)**:
- Base: `node:18-alpine`
- Copia apenas artefatos de produção
- Executa como usuário não-root (nestjs:1001)
- Expõe porta 3000
- Roda migrações e inicia aplicação

---

## 🧪 Testes

### Framework: Playwright

**Estrutura de Testes**:
- **Testes E2E**: API testing completo
- **Módulos de teste**: Organizados por feature (auth, posts)
- **Actions**: Helpers reutilizáveis de requisições
- **Shared utilities**: Utilitários comuns

### Executar Testes

```bash
# Rodar todos os testes
npm run test

# Modo interativo (UI)
npm run test:watch

# Modo CI
npm run test:ci

# Ver relatório de cobertura
npm run test:cov

# Debug de testes
npm run test:debug
```

### Cobertura de Testes

**Autenticação**:
- Signup (sucesso e email duplicado)
- Signin (sucesso e credenciais inválidas)
- Obter informações do usuário
- Validação de token

**Posts**:
- Criar post (com validação)
- Listar posts públicos
- Obter post por ID (com controle de acesso)
- Buscar posts (anônimo vs autenticado)
- Atualizar posts
- Deletar posts (apenas inativos)
- Controle de acesso (public/private, active/inactive)

### Ambiente de Teste
- **Setup automático**: Script `start-test-env.js`
- **Banco efêmero**: BD único por execução
- **Docker Compose**: Stack completa para testes
- **Teardown global**: Limpeza de containers e volumes

---

## 🚀 CI/CD - GitHub Actions

### Pipeline Workflow (`.github/workflows/ci.yml`)

#### Triggers
- Push para branches `main` ou `develop`
- Pull requests para `main` ou `develop`

#### Jobs

##### 1️⃣ Test Job
- Setup Node.js 18
- Instala dependências
- Gera cliente Prisma
- Instala navegadores Playwright
- Executa testes E2E (`npm run test:ci`)
- Upload de relatórios (30 dias de retenção)

##### 2️⃣ Quality Job
- Setup Node.js 18
- Executa ESLint
- Executa auditoria de segurança (`npm audit`)
- Execução em paralelo com Test job

##### 3️⃣ Deploy Job
- **Dependências**: test + quality jobs
- Setup Docker Buildx
- Login no Docker Hub
- Extração de metadados para tags
- Build e push da imagem Docker (apenas branch `develop`)
- Tags: `latest` e `develop-{SHA}`
- Teste do Docker Compose
- Verificação do health endpoint
- Limpeza de containers

#### Secrets Necessários
Configure no GitHub (Settings → Secrets → Actions):
```
DOCKER_USERNAME=seu_usuario_dockerhub
DOCKER_PASSWORD=sua_senha_dockerhub
```

---

## 📜 Scripts Disponíveis

### Desenvolvimento
```bash
npm run start           # Iniciar aplicação
npm run start:dev       # Iniciar com hot reload
npm run start:debug     # Iniciar com debug
npm run build           # Build para produção
npm run start:prod      # Iniciar build de produção
```

### Testes
```bash
npm run test            # Rodar testes E2E
npm run test:ci         # Rodar testes em modo CI
npm run test:watch      # Rodar testes em modo UI
npm run test:cov        # Ver relatório de cobertura
npm run test:debug      # Debug de testes
```

### Qualidade
```bash
npm run lint            # Executar ESLint
npm run format          # Formatar código com Prettier
```

### Docker
```bash
npm run docker:up       # Subir Docker Compose
npm run docker:down     # Parar Docker Compose
npm run docker:logs     # Ver logs do Docker
```

### Prisma
```bash
npx prisma generate     # Gerar cliente Prisma
npx prisma migrate dev  # Criar nova migração
npx prisma migrate deploy  # Aplicar migrações
npx prisma studio       # Abrir Prisma Studio (GUI)
```

---

## 🎯 Features Especiais

### 1. Guards Customizados de Autenticação Condicional
- **PostAccessGuard**: Permite acesso público para posts PUBLIC+ACTIVE, requer auth para outros
- **SearchAccessGuard**: Autenticação opcional (popula usuário se token presente)

### 2. Documentação Swagger Completa
- Documentação OpenAPI completa em `/api`
- Autenticação JWT Bearer configurada
- Exemplos de request/response
- Descrições com emojis
- Autorização persistente
- Exibição de duração de requisições

### 3. Build Docker Multi-Stage Otimizado
- Tamanho de imagem otimizado
- Apenas dependências de produção
- Execução como usuário não-root
- Health checks em múltiplos níveis

### 4. Ambiente de Teste Efêmero
- Bancos de dados únicos por execução
- Setup automático de ambiente
- Integração com Docker Compose
- Teardown global para limpeza

### 5. Sistema de Migrações
- Sistema de migrações Prisma
- Deploy automatizado no Docker
- Migrações versionadas
- Migração inicial: `20251005161939_initial_with_type_status`

---

## 📊 Monitoramento

### Health Check
- **Endpoint**: `/health`
- **Retorna**:
  ```json
  {
    "status": "ok",
    "timestamp": "2025-01-10T12:00:00.000Z",
    "uptime": 12345
  }
  ```
- Usado pelos health checks do Docker
- Usado pelo mecanismo de espera do Playwright

---

## 🔒 Segurança

- Hash de senhas com bcrypt (10 rounds)
- Autenticação JWT
- Variáveis de ambiente para secrets
- Usuário não-root no Docker
- Auditoria de segurança no CI
- Validação de dados com class-validator
- Guards para controle de acesso

---

## 📚 Documentação Adicional

- **[Swagger UI](http://localhost:3000/api)** - Documentação interativa da API (quando rodando)
- **[Prisma Docs](https://www.prisma.io/docs)** - Documentação do Prisma
- **[NestJS Docs](https://docs.nestjs.com/)** - Documentação do NestJS
- **[Playwright Docs](https://playwright.dev/)** - Documentação do Playwright

---

## 🐛 Troubleshooting

### Erro de conexão com o banco
```bash
# Verifique se o PostgreSQL está rodando
docker-compose ps

# Recrie os containers
docker-compose down -v
docker-compose up -d
```

### Erro nas migrações
```bash
# Resetar banco (cuidado: apaga dados!)
npx prisma migrate reset

# Aplicar migrações novamente
npx prisma migrate deploy
```

### Testes falhando
```bash
# Limpar ambiente de teste anterior
docker-compose -f docker-compose.test.yml down -v

# Rodar testes novamente
npm run test
```

### Porta 3000 já em uso
```bash
# Encontrar processo usando a porta
lsof -i :3000

# Matar o processo (substitua PID)
kill -9 <PID>
```

---
