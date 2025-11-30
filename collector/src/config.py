"""
Configurações do Collector
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional


class Settings(BaseSettings):
    """Configurações da aplicação carregadas do .env"""
    
    # RabbitMQ
    rabbitmq_host: str = Field(default="localhost", alias="RABBITMQ_HOST")
    rabbitmq_port: int = Field(default=5672, alias="RABBITMQ_PORT")
    rabbitmq_user: str = Field(default="guest", alias="RABBITMQ_USER")
    rabbitmq_password: str = Field(default="guest", alias="RABBITMQ_PASSWORD")
    rabbitmq_queue: str = Field(default="data_queue", alias="RABBITMQ_QUEUE")
    rabbitmq_exchange: str = Field(default="", alias="RABBITMQ_EXCHANGE")
    
    # API
    api_url: str = Field(..., alias="API_URL")  # Obrigatório
    api_token: Optional[str] = Field(default=None, alias="API_TOKEN")
    api_timeout: int = Field(default=30, alias="API_TIMEOUT")
    
    # Collector
    collection_interval: int = Field(default=60, alias="COLLECTION_INTERVAL")
    max_retries: int = Field(default=3, alias="MAX_RETRIES")
    retry_delay: int = Field(default=5, alias="RETRY_DELAY")
    
    # Logging
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    log_file: str = Field(default="logs/collector.log", alias="LOG_FILE")
    
    # Configuração do Pydantic v2
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"  # Ignora campos extras no .env
    )


# Instância global das configurações
settings = Settings()