# Sistema de Monitoramento Climático

Sistema distribuído para coleta, processamento e visualização de dados meteorológicos em tempo real.

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Funcionalidades](#funcionalidades)

---

## Sobre o Projeto

Este projeto implementa uma arquitetura de microserviços completa para monitoramento climático, integrando múltiplas tecnologias modernas. O sistema coleta dados da API Open-Meteo, processa-os através de uma fila de mensagens e os disponibiliza em uma interface web intuitiva.

### Características Principais

- Coleta automática de dados climáticos a cada hora
- Processamento assíncrono via message broker
- Autenticação JWT para acesso seguro
- Dashboard interativo com visualizações de dados
- Exportação de dados em CSV e XLSX
- Insights gerados por IA sobre os dados climáticos
- Totalmente containerizado com Docker

---

## Arquitetura

O sistema é composto por quatro componentes principais:

```
+---------------------+
|  Python Collector   |  -->  Coleta dados climáticos (Open-Meteo API)
+----------+----------+
           |  Publish
           v
+---------------------+
|      RabbitMQ       |  -->  Fila de mensagens
+----------+----------+
           |  Consume
           v
+---------------------+
|     Go Worker       |  -->  Processa e envia para API
+----------+----------+
           |  HTTP POST
           v
+---------------------+      +----------+
|     NestJS API      | <--> |  MongoDB |
+----------+----------+      +----------+
           |  REST
           v
+---------------------+
|   React Frontend    |  -->  Interface do usuário
+---------------------+
```

### Fluxo de Dados

1. **Coleta**: Python busca dados climáticos da API Open-Meteo a cada hora.
2. **Publicação**: Os dados são enviados para a fila RabbitMQ.
3. **Processamento**: O Go Worker consome as mensagens e as encaminha para a API.
4. **Armazenamento**: A API NestJS valida e persiste os dados no MongoDB.
5. **Visualização**: O frontend React exibe os dados e os insights gerados por IA.

---

## Tecnologias

### Backend

- **NestJS** — Framework Node.js progressivo
- **Go** — Serviço worker de alta performance
- **Python** — Coleta e integração de dados
- **MongoDB** — Banco de dados NoSQL
- **RabbitMQ** — Message broker

### Frontend

- **React** — Biblioteca de UI
- **Vite** — Build tool
- **Tailwind CSS** — Framework CSS utilitário
- **shadcn/ui** — Biblioteca de componentes

### Infraestrutura

- **Docker** — Containerização
- **Docker Compose** — Orquestração de serviços

---

## Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ *(apenas para desenvolvimento local)*
- Go 1.21+ *(apenas para desenvolvimento local)*
- Python 3.11+ *(apenas para desenvolvimento local)*

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/FelipeAraujoBS/weather-monitoring-system.git
cd weather-monitoring-system
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# MongoDB
MONGO_URI=mongodb://mongodb:27017/weather-db

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/
RABBITMQ_QUEUE=weather_data

# API
API_PORT=3000
JWT_SECRET=seu_secret_super_seguro
API_URL=http://api:3000

# Open-Meteo
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
WEATHER_LOCATION_LAT=-12.9714
WEATHER_LOCATION_LON=-38.5014

# Frontend
VITE_API_URL=http://localhost:3000
```

### 3. Inicie com Docker Compose

```bash
docker-compose up -d
```

Todos os serviços serão iniciados:

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000 |
| RabbitMQ Management | http://localhost:15672 |
| MongoDB | localhost:27017 |

---

## Configuração

### Usuário Padrão

O sistema cria automaticamente uma conta de administrador padrão:

- **E-mail**: admin@admin.com
- **Senha**: admin123

> **Importante**: Altere essas credenciais imediatamente após o primeiro login.

### Localização para Coleta de Dados

Por padrão, o sistema coleta dados climáticos de Salvador, Bahia, Brasil. Para alterar a localização, atualize as seguintes variáveis no arquivo `.env`:

```env
WEATHER_LOCATION_LAT=-23.5505
WEATHER_LOCATION_LON=-46.6333
```

---

## Uso

### Acesso ao Sistema

1. Acesse http://localhost:5173
2. Faça login com as credenciais padrão
3. Explore o dashboard com os dados climáticos em tempo real

### Principais Recursos

**Dashboard**

Visualize dados climáticos em tempo real, incluindo gráficos interativos de temperatura, umidade e outras métricas, além de insights gerados por IA.

**Gestão de Dados**

Consulte o histórico completo de dados, filtre por período e exporte registros em CSV ou XLSX.

**Administração**

Gerencie usuários com operações CRUD completas, controle permissões e acompanhe logs do sistema.

---

## Estrutura do Projeto

```
.
├── api/                    # NestJS API
│   ├── src/
│   │   ├── auth/          # Autenticação JWT
│   │   ├── users/         # Gestão de usuários
│   │   ├── weather/       # Logs climáticos
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
│
├── collector/              # Python Collector
│   ├── src/
│   │   ├── collector.py   # Coleta de dados
│   │   └── publisher.py   # Publisher RabbitMQ
│   ├── Dockerfile
│   └── requirements.txt
│
├── worker/                 # Go Worker
│   ├── main.go            # Consumer e HTTP client
│   ├── Dockerfile
│   └── go.mod
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Clientes de API
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml      # Orquestração de serviços
├── .env.example            # Modelo de variáveis de ambiente
└── README.md
```

---

## API Endpoints

### Autenticação

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

### Logs Climáticos

```http
# Criar novo log (utilizado pelo Go Worker)
POST /api/weather/logs
Authorization: Bearer {token}

# Listar logs
GET /api/weather/logs?page=1&limit=50
Authorization: Bearer {token}

# Obter insights de IA
GET /api/weather/logs/insights
Authorization: Bearer {token}

# Exportar dados
GET /api/weather/logs/export?format=csv
Authorization: Bearer {token}
```

### Usuários

```http
# Listar usuários
GET /api/users
Authorization: Bearer {token}

# Criar usuário
POST /api/users
Authorization: Bearer {token}

# Atualizar usuário
PUT /api/users/:id
Authorization: Bearer {token}

# Deletar usuário
DELETE /api/users/:id
Authorization: Bearer {token}
```

---

## Funcionalidades

### Backend (NestJS)

- Setup do projeto com TypeScript
- Conexão com MongoDB via Mongoose
- Autenticação JWT
- CRUD completo de usuários
- Endpoints de logs climáticos
- Exportação em CSV e XLSX
- Geração de insights por IA
- Validação de dados com class-validator
- Documentação Swagger

### Go Worker

- Conexão robusta com RabbitMQ
- Consumer com retry logic
- HTTP client para integração com NestJS
- Logs estruturados
- Tratamento de erros
- Graceful shutdown

### Python Collector

- Integração com a API Open-Meteo
- Agendamento automático com cron
- Publisher RabbitMQ
- Tratamento de exceções
- Logs detalhados
- Retry em caso de falha

### Frontend (React)

- Setup com Vite e TypeScript
- Tailwind CSS e shadcn/ui
- Tela de login
- Dashboard com gráficos interativos
- Tabela de dados responsiva
- Exportação de dados
- Interface CRUD de usuários
- Gerenciamento de estado
- Rotas protegidas

### Infraestrutura

- Docker Compose funcional
- Variáveis de ambiente configuráveis
- Health checks em todos os serviços
- Volumes para persistência de dados
- Rede Docker otimizada

---

## Contribuindo

Contribuições e sugestões são bem-vindas.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/melhoria`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Envie para a branch (`git push origin feature/melhoria`)
5. Abra um Pull Request

---

## Autor

**Felipe Araujo**

- GitHub: [@FelipeAraujoBS](https://github.com/FelipeAraujoBS)
