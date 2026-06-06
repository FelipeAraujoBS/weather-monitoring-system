# GDASH Frontend — React + Vite + Tailwind

Interface web do sistema de monitoramento climático. Dashboard interativo com dados reais, gráficos, exportação e insights de IA.

## Stack

- **Framework:** React 18 + TypeScript
- **Build:** Vite 5
- **Estilo:** Tailwind CSS 3
- **Componentes:** shadcn/ui (Button, Input, Card, Table, Dialog)
- **Navegação:** React Router DOM 6
- **HTTP:** Axios com interceptor JWT

## Estrutura

```
src/
├── components/
│   ├── common/       # Input, ExportButton
│   └── ui/           # shadcn/ui primitives
├── hooks/            # useWeatherData
├── pages/            # LoginPage, RegisterPage, DashboardPage
├── services/         # weatherApi.ts (axios instance + interceptors)
├── types/            # WeatherData, AuthResponse
├── App.tsx
└── main.tsx
```

## Funcionalidades

- Login/registro com validação inline
- Dashboard com último registro + histórico
- Tabela paginada com dados climáticos
- Geração de insights por IA
- Exportação em CSV e XLSX
- Rotas protegidas (redirect se não autenticado)
- Acessibilidade (aria-*, htmlFor, required, autoComplete)

## Scripts

```bash
npm run dev        # Desenvolvimento (porta 5173)
npm run build      # Produção → dist/
npm run preview    # Preview da build
npm run lint       # ESLint
```

## Construção Docker

A `VITE_API_URL` é injetada em **build time** via `build.args` no Docker Compose:

```yaml
frontend:
  build:
    args:
      VITE_API_URL: http://localhost:5000/api
```

## Integração com API

Todas as requisições passam pelo interceptor do Axios que:
1. Anexa `Authorization: Bearer <token>` automaticamente
2. Em 401, limpa o token e redireciona ao login
3. Trata erros de rede sem expor detalhes ao usuário
