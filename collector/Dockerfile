# ==============================================================================
# Build Stage
# ==============================================================================
FROM python:3.11-slim as builder

# Variáveis de ambiente
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Instala dependências do sistema
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala dependências Python
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --user --no-warn-script-location -r requirements.txt

# ==============================================================================
# Runtime Stage
# ==============================================================================
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH=/root/.local/bin:$PATH \
    PYTHONPATH=/app

WORKDIR /app

# Copia dependências instaladas do builder
COPY --from=builder /root/.local /root/.local

# Copia código da aplicação
COPY src/ ./src/

# Cria diretório de logs
RUN mkdir -p logs

RUN addgroup -S app && adduser -S -G app app && chown -R app:app /app

USER app

HEALTHCHECK --interval=60s --timeout=10s --start-period=30s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')" || exit 1

# Comando padrão
CMD ["python", "-m", "src.main"]