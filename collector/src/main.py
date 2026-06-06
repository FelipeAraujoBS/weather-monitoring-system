"""
Aplicação principal do Collector
"""
import time
import requests
import schedule
from src.api_consumer import APIConsumer
from src.normalizers.data_normalizer import DataNormalizer
from src.rabbitmq_publisher import RabbitMQPublisher
from src.config import settings
from src.utils.logger import log


class Collector:
    """Orquestra a coleta, normalização e envio de dados"""

    def __init__(self, api_consumer=None, normalizer=None, publisher=None):
        self.api_consumer = api_consumer or APIConsumer()
        self.normalizer = normalizer or DataNormalizer()
        self.publisher = publisher or RabbitMQPublisher()

    def run(self):
        """Executa um ciclo de coleta"""
        try:
            log.info("=" * 60)
            log.info("Iniciando coleta de dados...")

            raw_data = self.api_consumer.fetch()
            log.info(f"Dados recebidos: {len(raw_data) if isinstance(raw_data, list) else 1} item(s)")

            normalized_data = self.normalizer.normalize(raw_data)
            log.info(f"Dados normalizados: {len(normalized_data)} item(s)")

            if normalized_data:
                count = self.publisher.publish(normalized_data)
                log.success(f"✓ Coleta finalizada com sucesso! {count} mensagens enviadas")
            else:
                log.warning("Nenhum dado para publicar")

            log.info("=" * 60)

        except requests.exceptions.RequestException as e:
            log.error(f"✗ Erro de rede na coleta: {e}")
        except Exception as e:
            log.error(f"✗ Erro inesperado na coleta: {e}")
    
    def start_scheduler(self):
        """Inicia o agendador de coletas"""
        log.info(f"Iniciando collector com intervalo de {settings.collection_interval}s")
        
        # Conecta ao RabbitMQ
        self.publisher.connect()
        
        # Executa imediatamente
        self.run()
        
        # Agenda execuções periódicas
        schedule.every(settings.collection_interval).seconds.do(self.run)
        
        # Loop principal
        try:
            while True:
                schedule.run_pending()
                time.sleep(1)
        except KeyboardInterrupt:
            log.warning("Collector interrompido pelo usuário")
        finally:
            self.publisher.close()


def main():
    """Função principal"""
    log.info("🚀 Iniciando Data Collector")
    log.info(f"API URL: {settings.api_url}")
    log.info(f"RabbitMQ: {settings.rabbitmq_host}:{settings.rabbitmq_port}")
    log.info(f"Fila: {settings.rabbitmq_queue}")
    
    collector = Collector()
    collector.start_scheduler()


if __name__ == "__main__":
    main()