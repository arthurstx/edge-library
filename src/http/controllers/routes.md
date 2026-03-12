# Documentação de Rotas - Edge Library

Esta documentação detalha todos os endpoints disponíveis na API do Edge Library, incluindo exemplos de entrada e saída.

## 🔑 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. 
- O **Access Token** deve ser enviado no header `Authorization: Bearer <token>`.
- O **Refresh Token** é gerenciado automaticamente via **HttpOnly Cookies**.

---

### 1. Autenticação (Auth)

#### `POST /auth/register`
Registra um novo usuário no sistema.

**Corpo da Requisição:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha_segura_123",
  "role": "user" 
}
```
*`role` é opcional e pode ser "user" ou "admin" (padrão: "user").*

**Resposta de Sucesso (201 Created):**
```json
{
  "message": "User registered successfully",
  "userJson": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "role": "user",
    "createdAt": "2023-10-27T10:00:00Z"
  }
}
```

#### `POST /auth/login`
Autentica um usuário e retorna o token de acesso.

**Corpo da Requisição:**
```json
{
  "email": "joao@exemplo.com",
  "password": "senha_segura_123"
}
```

**Resposta de Sucesso (200 OK):**
*Retorna o `token` no corpo e o `refresh_token` via Cookie.*
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### `POST /auth/refresh`
Gera um novo token de acesso usando o refresh token (Cookie).

**Resposta de Sucesso (200 OK):**
```json
{
  "token": "novo_access_token_aqui..."
}
```

#### `GET /auth/me`
Obtém o perfil do usuário logado.
*Requer Autenticação*

**Resposta de Sucesso (200 OK):**
```json
{
  "user": {
    "id": "...",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "role": "user"
  }
}
```

---

### 2. Livros (Books)

#### `POST /book/create`
Cadastra um novo livro no acervo.
*Requer Autenticação + Cargo Admin*

**Corpo da Requisição:**
```json
{
  "title": "O Senhor dos Anéis",
  "author": "J.R.R. Tolkien",
  "category": "Fantasia"
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "message": "Book created successfully",
  "book": {
    "id": "uuid-do-livro",
    "title": "O Senhor dos Anéis",
    "author": "J.R.R. Tolkien",
    "category": "Fantasia",
    "total_copies": 0
  }
}
```

#### `POST /book/add-stock/:id`
Aumenta a quantidade de cópias disponíveis de um livro.
*Requer Autenticação + Cargo Admin*

**Corpo da Requisição:**
```json
{
  "quantity": 5
}
```

#### `GET /book/list`
Lista todos os livros com paginação.

**Query Params:**
- `page` (opcional, padrão: 1)

**Exemplo:** `/book/list?page=1`

**Resposta de Sucesso (200 OK):**
```json
{
  "books": [
    {
      "id": "...",
      "title": "...",
      "author": "...",
      "total_copies": 10
    }
  ]
}
```

#### `GET /book/search`
Busca livros por título ou autor.

**Query Params:**
- `query` (obrigatório): termo de busca.
- `page` (opcional).

---

### 3. Empréstimos (Rentals)

#### `POST /rental`
Cria um novo empréstimo de livro para um usuário.
*Requer Autenticação + Cargo Admin*

**Corpo da Requisição:**
```json
{
  "userId": "uuid-do-usuario",
  "bookId": "uuid-do-livro"
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "message": "Rental created successfully",
  "rental": {
    "id": "uuid-do-aluguel",
    "user_id": "...",
    "book_id": "...",
    "status": "rented",
    "start_date": "..."
  }
}
```

#### `GET /rental/active`
Lista os empréstimos ativos do usuário logado.
*Requer Autenticação*

#### `PATCH /rental/:id/return`
Marca um empréstimo como devolvido.
*Requer Autenticação + Cargo Admin*

**Resposta de Sucesso (204 No Content)**

---

## ⚠️ Tratamento de Erros

A API retorna erros padronizados seguindo o formato:

```json
{
  "message": "Descrição do erro",
  "issues": "Detalhes técnicos (opcional, comum em erros de validação)"
}
```

**Códigos Comuns:**
- `400 Bad Request`: Dados de entrada inválidos (Zod validation).
- `401 Unauthorized`: Token ausente ou inválido.
- `403 Forbidden`: Usuário sem permissão (Ex: tentando acessar rota Admin).
- `404 Not Found`: Recurso não encontrado.
- `409 Conflict`: Conflito (Ex: email já cadastrado ou livro sem estoque).
