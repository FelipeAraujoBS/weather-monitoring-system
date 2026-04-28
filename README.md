# 🌦️ Sistema de Monitoramento Climático 

Sistema distribuído para coleta, processamento e visualização de dados meteorológicos em tempo real.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Funcionalidades](#funcionalidades)

## 🎯 Sobre o Projeto

Este projeto implementa uma arquitetura de microserviços completa para monitoramento climático, integrando múltiplas tecnologias modernas. O sistema coleta dados da API Open-Meteo, processa através de uma fila de mensagens e disponibiliza em uma interface web intuitiva.

### Características Principais

- ⏰ Coleta automática de dados climáticos a cada hora
- 🔄 Processamento assíncrono via mensageria
- 🔐 Autenticação JWT para acesso seguro
- 📊 Dashboard interativo com visualizações
- 📥 Exportação de dados em CSV/XLSX
- 🤖 Insights de IA sobre dados climáticos
- 🐳 Totalmente dockerizado

## 🏗️ Arquitetura

O sistema é composto por 4 componentes principais:

```
┌─────────────────┐
│ Python Collector│ ──► Coleta dados climáticos (Open-Meteo API)
└────────┬────────┘
         │ Publish
         ▼
┌─────────────────┐
│    RabbitMQ     │ ──► Fila de mensagens
└────────┬────────┘
         │ Consume
         ▼
┌─────────────────┐
│   Go Worker     │ ──► Processa e envia para API
└────────┬────────┘
         │ HTTP POST
         ▼
┌─────────────────┐      ┌──────────┐
│   NestJS API    │ ◄──► │ MongoDB  │
└────────┬────────┘      └──────────┘
         │ REST
         ▼
┌─────────────────┐
│ React Frontend  │ ──► Interface do usuário
└─────────────────┘
```

### Fluxo de Dados

1. **Coleta**: Python busca dados climáticos da API Open-Meteo a cada hora
2. **Publicação**: Dados são enviados para fila RabbitMQ
3. **Processamento**: Go Worker consome mensagens e envia para API
4. **Armazenamento**: NestJS API valida e armazena no MongoDB
5. **Visualização**: Frontend React exibe dados e insights

## 🛠️ Tecnologias Utilizadas

### Backend

- **NestJS** - Framework Node.js progressivo
- **Go** - Worker de alta performance
- **Python** - Coleta e integração de dados
- **MongoDB** - Banco de dados NoSQL
- **RabbitMQ** - Message broker

### Frontend

- **React** - Biblioteca UI
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI

### DevOps

- **Docker** - Containerização
- **Docker Compose** - Orquestração

## ⚙️ Pré-requisitos

- Docker (versão 20.10+)
- Docker Compose (versão 2.0+)
- Node.js 18+ (apenas para desenvolvimento local)
- Go 1.21+ (apenas para desenvolvimento local)
- Python 3.11+ (apenas para desenvolvimento local)

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/FelipeAraujoBS/desafio-gdash-2025-02.git
cd desafio-gdash-2025-02
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

### 3. Execute com Docker Compose

```bash
docker-compose up -d
```

Isso irá iniciar todos os serviços:

- **Frontend**: http://localhost:5173
- **API**: http://localhost:3000
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **MongoDB**: localhost:27017

## 🔧 Configuração

### Usuário Padrão

O sistema cria automaticamente um usuário padrão:

- **Email**: admin@gdash.com
- **Senha**: admin123

⚠️ **Importante**: Altere essas credenciais após o primeiro login!

### Localização para Coleta de Dados

Por padrão, o sistema coleta dados climáticos de Salvador, Bahia, Brasil. Para alterar:

```env
WEATHER_LOCATION_LAT=-23.5505  # Latitude
WEATHER_LOCATION_LON=-46.6333  # Longitude
```

## 📖 Uso

### Acesso ao Sistema

1. Acesse http://localhost:5173
2. Faça login com as credenciais padrão
3. Explore o dashboard com dados climáticos

### Principais Recursos

#### Dashboard

- Visualize dados climáticos em tempo real
- Gráficos interativos de temperatura, umidade, etc.
- Insights gerados por IA

#### Gestão de Dados

- Visualize histórico completo
- Filtre por período
- Exporte em CSV ou XLSX

#### Administração

- CRUD de usuários
- Gerenciamento de permissões
- Logs de sistema

## 📁 Estrutura do Projeto

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
│   │   └── publisher.py   # RabbitMQ publisher
│   ├── Dockerfile
│   └── requirements.txt
│
├── worker/                 # Go Worker
│   ├── main.go            # Consumer + HTTP client
│   ├── Dockerfile
│   └── go.mod
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas
│   │   ├── services/      # API clients
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml      # Orquestração
├── .env.example           # Variáveis de ambiente
└── README.md
```

## 🔌 API Endpoints

### Autenticação

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@gdash.com",
  "password": "admin123"
}
```

### Logs Climáticos

```http
# Criar novo log (usado pelo Go Worker)
POST /api/weather/logs
Authorization: Bearer {token}

# Listar logs
GET /api/weather/logs?page=1&limit=50
Authorization: Bearer {token}

# Obter insights
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

## ✨ Funcionalidades

### ✅ Backend (NestJS)

- [x] Setup inicial com TypeScript
- [x] Conexão MongoDB com Mongoose
- [x] Autenticação JWT
- [x] CRUD completo de usuários
- [x] Endpoints de logs climáticos
- [x] Exportação CSV/XLSX
- [x] Geração de insights com IA
- [x] Validação de dados com class-validator
- [x] Documentação Swagger

### ✅ Go Worker

- [x] Conexão RabbitMQ robusta
- [x] Consumer com retry logic
- [x] HTTP client para NestJS
- [x] Logs estruturados
- [x] Tratamento de erros
- [x] Graceful shutdown

### ✅ Python Collector

- [x] Integração Open-Meteo API
- [x] Scheduler automático (cron)
- [x] Publisher RabbitMQ
- [x] Tratamento de exceções
- [x] Logs detalhados
- [x] Retry em falhas

### ✅ Frontend (React)

- [x] Setup Vite + TypeScript
- [x] Tailwind CSS + shadcn/ui
- [x] Tela de login
- [x] Dashboard com gráficos
- [x] Tabela de dados responsiva
- [x] Exportação de dados
- [x] CRUD de usuários
- [x] Gerenciamento de estado
- [x] Rotas protegidas

### ✅ Infraestrutura

- [x] Docker Compose funcional
- [x] Variáveis de ambiente configuráveis
- [x] Health checks em todos os serviços
- [x] Volumes para persistência
- [x] Rede Docker otimizada

## 🤝 Contribuindo

Este é um projeto de desafio técnico, mas sugestões são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/melhoria`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/melhoria`)
5. Abra um Pull Request

## 📝 Licença

Este projeto foi desenvolvido como parte do processo seletivo da GDASH 2025/02.

## 👤 Autor

**Felipe Araujo**

- GitHub: [@FelipeAraujoBS](https://github.com/FelipeAraujoBS)
- Projeto Original: [GDASH-io/desafio-gdash-2025-02](https://github.com/GDASH-io/desafio-gdash-2025-02)

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique a [documentação do projeto original](https://github.com/GDASH-io/desafio-gdash-2025-02)
2. Abra uma issue no repositório
3. Entre em contato através do processo seletivo

---

⭐ **Desenvolvido com dedicação para o desafio GDASH 2025/02**
