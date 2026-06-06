# GDASH API — NestJS + MongoDB

API REST do sistema de monitoramento climático. Responsável por autenticação, CRUD de registros de clima, exportação e geração de insights por IA.

## Stack

- **Runtime:** Node.js 20 (Alpine)
- **Framework:** NestJS 10 com TypeScript
- **ORM:** Mongoose 8 (MongoDB)
- **Auth:** Passport + JWT (bcrypt)
- **Export:** ExcelJS (XLSX), json2csv (CSV)

## Estrutura

```
src/
├── ai/              # Integração com Gemini/OpenAI
├── users/
│   ├── auth/        # AuthController, AuthService, JwtStrategy
│   ├── dto/         # CreateUserDto, LoginDto
│   ├── schemas/     # User schema (Mongoose)
│   ├── users.controller.ts
│   └── users.service.ts
├── weather/
│   ├── dto/         # CreateWeatherDto, QueryDto
│   ├── schemas/     # Weather + Insight schemas
│   ├── weather.controller.ts  # CRUD + export + insight
│   └── weather.service.ts
├── app.module.ts
└── main.ts          # Bootstrap + CORS + validação global
```

## Endpoints

### Públicos

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login → JWT |
| POST | `/api/users` | Registrar |
| POST | `/api/weather` | Criar (uso interno Go Worker) |

### Protegidos (JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/weather/latest` | Último registro |
| GET | `/api/weather/history` | Histórico paginado |
| GET | `/api/weather/stats` | Estatísticas |
| POST | `/api/weather/:id/insight` | Gerar insight IA |
| GET | `/api/weather/export` | CSV ou XLSX |

## Scripts

```bash
npm run start        # Produção
npm run start:dev    # Desenvolvimento com hot-reload
npm run test         # Testes unitários
npm run test:e2e     # Testes end-to-end
```

## Configuração

Variáveis de ambiente (via `.env`):

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
```
