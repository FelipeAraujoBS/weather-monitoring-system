# Weather Monitoring System

Sistema distribuído para coleta, processamento e visualização de dados meteorológicos em tempo real. Construído com 4 serviços independentes (Python, Go, NestJS, React) comunicando-se via RabbitMQ e MongoDB.

## Arquitetura

```
┌──────────────┐    ┌──────────┐    ┌────────────┐    ┌────────────┐    ┌───────────┐
│ Open-Meteo   │───>│ Python   │───>│ RabbitMQ   │───>│ Go Worker  │───>│ NestJS    │
│ API (HTTP)   │    │ Collector│    │ (Queue)    │    │ (Consumer) │    │ API       │
└──────────────┘    └──────────┘    └────────────┘    └────────────┘    └─────┬─────┘
                                                                              │
                                                                     ┌────────v────────┐
                                                                     │  MongoDB Atlas   │
                                                                     │  (Weather + User)│
                                                                     └────────┬────────┘
                                                                              │
                                                                     ┌────────v────────┐
                                                                     │ React Frontend  │
                                                                     │ (Nginx, port 80)│
                                                                     └─────────────────┘
```

Diagramas detalhados em [Arquitetura.md](./Arquitetura.md).

## Stack

| Camada | Tecnologia | Por quê |
|--------|-----------|---------|
| **Coleta** | Python 3.11 + requests + pika + loguru | Maturidade para HTTP, ecosistema rico |
| **Fila** | RabbitMQ 3 | Ack/nack confiável, maturidade |
| **Worker** | Go 1.21 | Concorrência nativa, performance, binário único |
| **API** | NestJS + Mongoose + Passport + JWT | Modular, DI, Guards, documentação |
| **Banco** | MongoDB Atlas | Schema-free, query flexível, gerenciado |
| **Frontend** | React + Vite + Tailwind + shadcn/ui | Componentização, DX, acessibilidade |
| **Infra** | Docker Compose | Orquestração local reproduzível |

## Pré-requisitos

- Docker 20.10+ com Docker Compose
- Docker Desktop rodando (Windows)
- Conta MongoDB Atlas (gratuita) com cluster ativo

## Instalação

### 1. Clone

```bash
git clone https://github.com/FelipeAraujoBS/weather-monitoring-system.git
cd weather-monitoring-system
```

### 2. Configure

```bash
cp .env.example .env
```

Preencha no `.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/weather-db
JWT_SECRET=uma_chave_forte_aqui
JWT_EXPIRES_IN=7d
```

### 3. Inicie

```bash
docker compose up -d --build
```

Aguarde ~30s para todos os serviços ficarem saudáveis.

### 4. Acesse

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost |
| API | http://localhost:5000/api |
| RabbitMQ UI | http://localhost:15672 (rabbituser / rabbitpass) |

## Uso

### Criar conta

Acesse **http://localhost/register** e crie sua conta.

### Login

**http://localhost/login** com email e senha cadastrados.

### Fluxo completo

1. O **Python Collector** busca dados da Open-Meteo a cada 2 minutos
2. Publica na fila `weather_queue` do RabbitMQ
3. O **Go Worker** consome, transforma e envia `POST /api/weather`
4. A **NestJS API** persiste no MongoDB Atlas
5. O **Frontend** consulta via REST com JWT e exibe no dashboard
6. **Insights de IA** podem ser gerados sob demanda para cada registro

## Estrutura do Projeto

```
weather-monitoring-system/
├── api/                      # NestJS (TypeScript)
│   ├── src/
│   │   ├── weather/          # CRUD clima + export + IA insights
│   │   ├── users/            # CRUD usuários
│   │   │   └── auth/         # JWT + Passport strategy
│   │   ├── ai/               # Integração com API de IA
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
│
├── collector/                # Python
│   ├── src/
│   │   ├── main.py           # Scheduler + orquestração
│   │   ├── api_consumer.py   # HTTP client Open-Meteo
│   │   ├── normalizers/      # Transformação de dados
│   │   ├── rabbitmq_publisher.py
│   │   └── config.py         # Pydantic settings
│   ├── Dockerfile
│   └── requirements.txt
│
├── worker/                   # Go
│   ├── internal/worker/
│   │   ├── consumer.go       # RabbitMQ consumer
│   │   ├── transformer.go    # Data transformation
│   │   └── processor.go      # HTTP client para API
│   ├── main.go
│   ├── Dockerfile
│   └── go.mod
│
├── frontend/                 # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/       # shadcn/ui components
│   │   ├── pages/            # Login, Register, Dashboard
│   │   ├── hooks/            # useWeatherData
│   │   └── services/         # weatherApi.ts
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env.example
├── README.md
└── Arquitetura.md
```

## API Endpoints

### Autenticação

```http
POST /api/auth/login
Content-Type: application/json

{ "email": "seu@email.com", "password": "sua_senha" }

Response 200:
{
  "message": "Login successful",
  "data": {
    "user": { "_id": "...", "email": "..." },
    "access_token": "eyJhbGci..."
  }
}
```

### Clima (requer JWT)

```http
GET /api/weather/latest
Authorization: Bearer <token>

GET /api/weather/history?page=1&limit=20
Authorization: Bearer <token>

GET /api/weather/stats
Authorization: Bearer <token>

POST /api/weather/:id/insight
Authorization: Bearer <token>

GET /api/weather/export?format=csv
Authorization: Bearer <token>
```

### Usuários

```http
POST /api/users
Content-Type: application/json

{ "email": "novo@email.com", "password": "minha_senha" }
```

## Troubleshooting

### Login retorna 401 mesmo com credenciais corretas

O token JWT expirava em 1ms — corrigido. Execute:

```bash
docker compose restart api_service
```

### Collector reinicia em loop

```bash
docker compose logs collector --tail=30
```

Problema comum: módulo `requests` não encontrado. Solução:

```bash
docker compose build --no-cache collector
docker compose up -d collector
```

### Worker não consome da fila

```bash
docker compose logs worker --tail=20
```

Se aparecer `NOT_FOUND - no queue`, o collector não está rodando. Verifique os logs do collector primeiro.

### Frontend inacessível em http://localhost

```bash
docker compose logs frontend --tail=20
```

Verifique se a porta 80 não está ocupada por outro serviço (IIS, Apache).

## O que este projeto demonstra

| Habilidade | Onde |
|-----------|------|
| **Sistemas distribuídos** | 4 serviços independentes, fila de mensagens |
| **Multi-linguagem** | Python, Go, TypeScript, shell script |
| **Autenticação JWT** | Passport + Strategy + Guards |
| **Containerização** | Docker multi-stage, healthchecks, non-root |
| **Integração com APIs** | Open-Meteo, Gemini/OpenAI |
| **Observabilidade** | Logs estruturados, healthchecks |
| **Segurança** | CORS whitelist, validação, JWT, non-root |
| **Banco NoSQL** | MongoDB Atlas, Mongoose schemas |

## Aprendizados

Durante o desenvolvimento, os principais desafios enfrentados foram:

- **Gerenciamento de conexão RabbitMQ** — Implementar reconexão automática no Python e graceful shutdown no Go com `context.WithCancel` + `sync.WaitGroup`
- **Auth JWT cross-module** — No NestJS, o `JwtStrategy` precisa ser exportado pelo `AuthModule` e importado por quem usa `@UseGuards(AuthGuard('jwt'))`
- **Docker multi-stage caching** — `pip install --user` combinado com `COPY --from=builder` gerou pacotes não encontrados em runtime; solução foi instalar system-wide
- **Volumes persistentes com permissão** — Volume Docker mantinha `/app/logs` como root; removido em favor de diretório criado pelo `app` user no Dockerfile
- **JWT_EXPIRES_IN** — Valor `1` era interpretado como 1 milissegundo, causando expiração instantânea do token
- **VITE_API_URL em build time** — Variáveis `VITE_` precisam estar em `build.args` no Docker Compose, não em `environment`

## Licença

MIT
