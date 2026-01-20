"""
Publicador de mensagens no RabbitMQ.
"""

import json
import pika
from typing import List, Dict 
from src.config import settings 
from src.utils.logger import log

class RabbitMQPublisher:
    """Classe para publicar mensagens no RabbitMQ."""

    def __init__(self):
        self.host = settings.rabbitmq_host
        self.port = settings.rabbitmq_port
        self.queue = settings.rabbitmq_queue
        self.exchange = settings.rabbitmq_exchange
        self.connection = None
        self.channel = None

    def connect(self):
        """Estabelece conexão com o RabbitMQ."""
        try:
            credentials = pika.PlainCredentials(settings.rabbitmq_user, settings.rabbitmq_password)
            parameters = pika.ConnectionParameters(host=self.host, port=self.port, credentials=credentials, heartbeat=600, blocked_connection_timeout=300)

            self.connection = pika.BlockingConnection(parameters)
            self.channel = self.connection.channel()

            self.channel.queue_declare(
                queue=self.queue, 
                durable=True,
                arguments={"x-message-ttl": 86400000}  # Mensagens expiram após 24 horas
            )

            log.success(f"Conectado ao RabbitMQ: {self.host}:{self.port} com sucesso.")

        except Exception as e:
            log.error(f"Erro ao conectar ao RabbitMQ: {e}")
            raise

    def publish(self, data: List[Dict]) -> int:
        """Publica uma lista de mensagens no RabbitMQ.""" 

        if not self.channel:
            self.connect()

        count =  0 

        try: 
            for item in data: 
                message = json.dumps(item, ensure_ascii=False)

                self.channel.basic_publish(
                    exchange=self.exchange,
                    routing_key=self.queue,
                    body=message,
                    properties=pika.BasicProperties(
                        delivery_mode=2,  # Mensagem persistente
                        content_type='application/json'
                    )
                )

            count += 1

            log.info(f"{count} mensagens publicadas na fila {self.queue} com sucesso.")
            return count
        

        except Exception as e:
            log.error(f"Erro ao publicar mensagem: {e}")
            raise

    def close(self):
        """Fecha a conexão com o RabbitMQ."""
        
        if self.connection and not self.connection.is_closed:
            self.connection.close()
            log.info("Conexão com o RabbitMQ fechada com sucesso.")