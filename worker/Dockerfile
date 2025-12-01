# ======================================================================
# STAGE 1: BUILDER (Compila o código Go)
# Usa uma imagem grande (golang) apenas para compilação.
# ======================================================================
FROM golang:1.24-alpine AS builder
WORKDIR /app

# Dependências (cache)
COPY go.mod go.sum ./
RUN go mod download

# Copia código
COPY . .

# Build do binário
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /worker ./main.go

# ======================================================================
# STAGE 2: FINAL (Cria a imagem final leve)
# Usa uma imagem minimalista (alpine) para o runtime.
# ======================================================================
FROM alpine:3.18
RUN apk --no-cache add ca-certificates

# criar usuário não-root opcional
RUN addgroup -S app && adduser -S -G app app

WORKDIR /app
COPY --from=builder /worker /app/worker
RUN chmod +x /app/worker

USER app
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s CMD ["/app/worker", "healthcheck"] || exit 1

CMD ["/app/worker"]
