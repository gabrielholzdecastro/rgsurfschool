# RG Surf School System

Sistema de gestão para a RG Surf School, desenvolvido para administrar alunos, vendas, estoque e agendamentos.

## 🚀 Tecnologias

### Backend
- **Java 21**
- **Spring Boot**
- **Maven**
- **PostgreSQL** (Banco de dados)
- **Flyway** (Migração de banco de dados)
- **Lombok**
- **Evolution API** (Integração com WhatsApp)

### Frontend
- **Next.js** (React)
- **TailwindCSS**
- **TypeScript**

## 📦 Estrutura do Projeto

- `/backend`: API RESTful em Java/Spring Boot.
- `/frontend`: Aplicação Web em Next.js.
- `docker-compose.yaml`: Definição de containers para infraestrutura (Postgres, Redis, Evolution API).

## 🛠️ Como Executar

### Pré-requisitos
- Java 21+ instalado
- Node.js 20+ instalado
- Docker e Docker Compose instalados

### 1. Infraestrutura (Banco de Dados e Evolution API)
Na raiz do projeto, execute:
```bash
docker-compose up -d
```
Isso iniciará:
- PostgreSQL (Porta 5432)
- Redis (Porta 6379)
- Evolution API (Porta 8081)

### 2. Backend
Navegue até a pasta `backend` e execute:
```bash
./mvnw spring-boot:run
```
A API estará disponível em `http://localhost:8080`.

### 3. Frontend
Navegue até a pasta `frontend` e execute:
```bash
npm install
npm run dev
```
O frontend estará disponível em `http://localhost:3000`.

## 📱 Integração com WhatsApp (Evolution API)

O sistema monitora um grupo específico no WhatsApp para atualizar o status de pagamentos de vendas automaticamente.

### Configuração
No arquivo `backend/src/main/resources/application.properties`, a propriedade `evolution.api.numero-monitorado` define o ID do grupo/número que será escutado (ex: `120363404628291341@g.us`).

### Comandos
Envie as seguintes mensagens no grupo monitorado para alterar o status de uma venda:

- **Marcar como Pago:**
  ```text
  PAGO {id_venda}
  ```
  Exemplo: `PAGO 123`

- **Marcar como Pendente:**
  ```text
  PENDENTE {id_venda}
  ```
  Exemplo: `PENDENTE 123`

O sistema recebe o webhook, valida se a mensagem veio do grupo correto e atualiza o status da venda no banco de dados.

## 🔧 Configurações Importantes

### Backend (`application.properties`)
- `spring.datasource.url`: URL do banco de dados.
- `evolution.api.base-url`: URL da Evolution API.
- `evolution.api.apikey`: Chave de API configurada no container da Evolution API.
