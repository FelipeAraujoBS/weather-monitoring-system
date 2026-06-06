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

# Copia e instala dependências Python (system-wide)
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-warn-script-location -r requirements.txt

# ==============================================================================
# Runtime Stage
# ==============================================================================
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app

WORKDIR /app

# Copia dependências instaladas do builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages

# Copia código da aplicação
COPY src/ ./src/

RUN mkdir -p logs && groupadd --system app && useradd --system --gid app app && chown -R app:app /app

USER app

RUN mkdir -p logs

HEALTHCHECK --interval=60s --timeout=10s --start-period=30s --retries=3 \
    CMD python -c "from src.config import settings; print('ok')" || exit 1

# Comando padrão
CMD ["python", "-m", "src.main"]