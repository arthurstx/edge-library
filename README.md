# Edge Library - Gerenciamento de Biblioteca na Edge

O **Edge Library** é um sistema de gerenciamento de biblioteca de alto desempenho, construído sobre a infraestrutura da Cloudflare Workers. Ele utiliza tecnologias modernas de "edge computing" para oferecer baixa latência e alta disponibilidade.

## 🏗️ Estrutura do Projeto

O projeto segue princípios de **Clean Architecture** e **DDD (Domain-Driven Design)** para garantir manutenibilidade e testabilidade.

```text
src/
├── auth/            # Lógica de criptografia e utilitários de autenticação
├── errors/          # Classes de erro personalizadas da aplicação
├── helpers/         # Funções utilitárias (JSON, Rotas, Tratamento de Erro)
├── http/
│   ├── controllers/ # Controladores HTTP divididos por domínio (Auth, Book, Rentals)
│   ├── middlewares/ # Middlewares de autenticação e RBAC (Role-Based Access Control)
│   └── test/        # Testes de integração E2E
├── repository/      # Camada de acesso a dados (D1, In-Memory para testes, Cache)
├── services/        # Casos de Uso (Business Logic) e Factories
│   └── factories/   # Injeção de dependência via Factory Pattern
└── types/           # Definições de tipos TypeScript/JSDoc
```

## 🛠️ Tecnologias Utilizadas

- **Runtime:** [Cloudflare Workers](https://workers.cloudflare.com/)
- **Banco de Dados:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite na Edge)
- **Cache/Session:** [Cloudflare KV](https://developers.cloudflare.com/kv/)
- **Linguagem:** JavaScript (Node.js compatível) com JSDoc para tipagem.
- **Validação:** [Zod](https://zod.dev/)
- **Autenticação:** JWT (via `jose`) e Cookies.
- **Testes:** [Vitest](https://vitest.dev/) com suporte a Workers.

## 🚀 Funcionalidades Principais

- **Autenticação & Autorização:** Registro, login, refresh token e controle de acesso por cargos (`admin` vs `user`).
- **Gestão de Acervo:** Cadastro de livros, controle de estoque (cópias totais) e busca/listagem.
- **Sistema de Empréstimos:** Criação de empréstimos, verificação de estoque e histórico de transações.

## 📊 Esquema do Banco de Dados (D1)

O banco de dados é composto por três tabelas principais:

1.  **users**: Armazena informações dos usuários e administradores.
2.  **books**: Armazena o catálogo de livros e quantidade de cópias.
3.  **rentals**: Registra os empréstimos ativos e finalizados.

## 🏁 Como Começar

### Pré-requisitos
- Node.js instalado.
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-upgrading/) configurado.

### Instalação
```bash
pnpm install
```

### Desenvolvimento Local
```bash
pnpm dev
```

### Executando Testes
```bash
# Testes unitários de serviços
pnpm test

# Testes de integração de controladores
pnpm test:integration

# Testes E2E de fluxos completos
pnpm test:e2e
```

## 📖 Documentação de Rotas
Para detalhes técnicos sobre os endpoints, entradas e saídas, consulte o arquivo [ROUTES.md](./routes.md).
