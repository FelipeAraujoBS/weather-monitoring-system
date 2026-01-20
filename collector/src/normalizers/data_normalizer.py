"""
Normalização de dados
"""
from datetime import datetime
from typing import Any, List, Dict


class DataNormalizer:
    """Normaliza dados recebidos da API"""
    
    @staticmethod
    def normalize(raw_data: Any, metadata: Dict = None) -> List[Dict]:
        """
        Normaliza dados adicionando metadata
        
        Args:
            raw_data: Dados brutos da API
            metadata: Metadata adicional
            
        Returns:
            Lista de dados normalizados
        """
        latitude = raw_data.get("latitude")
        longitude = raw_data.get("longitude")
        current = raw_data.get("current", {})
        
        # Converte para lista se necessário
        items = raw_data if isinstance(raw_data, list) else [raw_data]
        
        normalized_item = {
            "data": {
                "location": {
                    "latitude": latitude,
                    "longitude": longitude,
                    "city": "Salvador",  # Você pode adicionar o nome da cidade
                    "state": "BA",
                    "country": "Brazil"
                },
                "weather": {
                    "timestamp": current.get("time"),
                    "temperature_celsius": current.get("temperature_2m"),
                    "humidity_percent": current.get("relative_humidity_2m"),
                    "wind_speed_kmh": current.get("wind_speed_10m"),
                    "weather_code": current.get("weather_code")
                }
            },
            "metadata": {
                "collected_at": datetime.utcnow().isoformat(),
                "source": "open_meteo_api",
                "api_version": "v1",
                "data_type": "weather_forecast"
            }
        }
        
        return [normalized_item]
    
    @staticmethod
    def get_weather_description(weather_code: int) -> str:
        """
        Converte código meteorológico em descrição
        
        """
        weather_codes = {
            0: "Céu limpo",
            1: "Principalmente limpo",
            2: "Parcialmente nublado",
            3: "Nublado",
            45: "Nevoeiro",
            48: "Nevoeiro com geada",
            51: "Garoa leve",
            53: "Garoa moderada",
            55: "Garoa densa",
            61: "Chuva leve",
            63: "Chuva moderada",
            65: "Chuva forte",
            71: "Neve leve",
            73: "Neve moderada",
            75: "Neve forte",
            77: "Grãos de neve",
            80: "Chuva fraca",
            81: "Chuva moderada",
            82: "Chuva violenta",
            85: "Neve leve",
            86: "Neve forte",
            95: "Tempestade",
            96: "Tempestade com granizo leve",
            99: "Tempestade com granizo forte"
        }
        
        return weather_codes.get(weather_code, "Desconhecido")