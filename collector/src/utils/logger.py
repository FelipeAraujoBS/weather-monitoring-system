"""
Sistema de logging configurado em Loguru 
"""

import sys 
from pathlib import Path
from loguru import logger
from src.config import settings

def setup_logger():
    """ Configurar o sistema de logging """

    logger.remove()  # Remove o logger padrão

    logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level}</level> | <cyan>{module}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level=settings.log_level,
        colorize=True
    )

    log_path = Path(settings.log_file)
    log_path.parent.mkdir(parents=True, exist_ok=True)  

    
    logger.add(
        settings.log_file,
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        level=settings.log_level,
        rotation="10 MB",
        retention="7 days",
        compression="zip",
        enqueue=True
    )

    return logger 

log = setup_logger()