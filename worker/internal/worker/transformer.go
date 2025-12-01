package worker

import (
	"encoding/json"
	"fmt"
	"log"
	"time"
)

// CollectorData é o formato que vem do Python
type CollectorData struct {
	Data struct {
		Location struct {
			Latitude  float64 `json:"latitude"`
			Longitude float64 `json:"longitude"`
			City      string  `json:"city"`
			State     string  `json:"state"`
			Country   string  `json:"country"`
		} `json:"location"`
		Weather struct {
			Timestamp          string  `json:"timestamp"`
			TemperatureCelsius float64 `json:"temperature_celsius"`
			HumidityPercent    int     `json:"humidity_percent"`
			WindSpeedKmh       float64 `json:"wind_speed_kmh"`
			WeatherCode        int     `json:"weather_code"`
		} `json:"weather"`
	} `json:"data"`
	Metadata struct {
		CollectedAt string `json:"collected_at"`
		Source      string `json:"source"`
	} `json:"metadata"`
}

// NestJSData é o formato que a API NestJS espera
type NestJSData struct {
	Timestamp string   `json:"timestamp"`
	Location  Location `json:"location"`
	Current   Current  `json:"current"`
	Daily     Daily    `json:"daily"`
	Source    string   `json:"source,omitempty"`
}

type Location struct {
	City      string   `json:"city"`
	State     string   `json:"state"`
	Country   string   `json:"country"`
	Latitude  *float64 `json:"latitude,omitempty"`
	Longitude *float64 `json:"longitude,omitempty"`
}

type Current struct {
	Temperature              float64 `json:"temperature"`
	FeelsLike                float64 `json:"feelsLike"`
	Humidity                 int     `json:"humidity"`
	Pressure                 int     `json:"pressure"`
	WindSpeed                float64 `json:"windSpeed"`
	WindDirection            int     `json:"windDirection"`
	UvIndex                  int     `json:"uvIndex"`
	CloudCover               int     `json:"cloudCover"`
	Visibility               int     `json:"visibility"`
	WeatherCode              int     `json:"weatherCode"`
	Condition                string  `json:"condition"`
	Precipitation            float64 `json:"precipitation"`
	PrecipitationProbability int     `json:"precipitationProbability"`
}

type Daily struct {
	TempMin float64 `json:"tempMin"`
	TempMax float64 `json:"tempMax"`
}

// TransformCollectorData converte dados do Python para o formato da API NestJS
func TransformCollectorData(rawData []byte) ([]byte, error) {
	var collectorData CollectorData

	// Parse JSON do Collector
	if err := json.Unmarshal(rawData, &collectorData); err != nil {
		return nil, fmt.Errorf("erro ao fazer parse: %w", err)
	}

	// Converter timestamp para RFC3339
	timestamp, err := time.Parse("2006-01-02T15:04", collectorData.Data.Weather.Timestamp)
	if err != nil {
		log.Printf("⚠️ Erro ao converter timestamp, usando horário atual: %v", err)
		timestamp = time.Now()
	}

	// Estimar sensação térmica (temperatura + 2°C como aproximação)
	feelsLike := collectorData.Data.Weather.TemperatureCelsius + 2.0

	// Mapear estado (BA -> Bahia)
	state := collectorData.Data.Location.State
	if state == "BA" {
		state = "Bahia"
	}

	// Mapear país (Brazil -> BR)
	country := collectorData.Data.Location.Country
	if country == "Brazil" {
		country = "BR"
	}

	// Mapear weather_code para descrição
	condition := mapWeatherCode(collectorData.Data.Weather.WeatherCode)

	// Construir objeto no formato da API
	nestJSData := NestJSData{
		Timestamp: timestamp.Format(time.RFC3339),
		Location: Location{
			City:      collectorData.Data.Location.City,
			State:     state,
			Country:   country,
			Latitude:  &collectorData.Data.Location.Latitude,
			Longitude: &collectorData.Data.Location.Longitude,
		},
		Current: Current{
			Temperature:              collectorData.Data.Weather.TemperatureCelsius,
			FeelsLike:                feelsLike,
			Humidity:                 collectorData.Data.Weather.HumidityPercent,
			Pressure:                 1013, // Valor padrão
			WindSpeed:                collectorData.Data.Weather.WindSpeedKmh,
			WindDirection:            0,
			UvIndex:                  5,
			CloudCover:               50,
			Visibility:               10000,
			WeatherCode:              collectorData.Data.Weather.WeatherCode,
			Condition:                condition,
			Precipitation:            0.0,
			PrecipitationProbability: 0,
		},
		Daily: Daily{
			TempMin: collectorData.Data.Weather.TemperatureCelsius - 3.0,
			TempMax: collectorData.Data.Weather.TemperatureCelsius + 5.0,
		},
		Source: collectorData.Metadata.Source,
	}

	// Converter para JSON
	transformedData, err := json.Marshal(nestJSData)
	if err != nil {
		return nil, fmt.Errorf("erro ao serializar: %w", err)
	}

	return transformedData, nil
}

// mapWeatherCode converte códigos WMO para descrições em português
func mapWeatherCode(code int) string {
	conditions := map[int]string{
		0:  "Céu limpo",
		1:  "Predominantemente limpo",
		2:  "Parcialmente nublado",
		3:  "Nublado",
		45: "Neblina",
		48: "Geada",
		51: "Garoa leve",
		53: "Garoa moderada",
		55: "Garoa forte",
		61: "Chuva leve",
		63: "Chuva moderada",
		65: "Chuva forte",
		71: "Neve leve",
		73: "Neve moderada",
		75: "Neve forte",
		77: "Granizo",
		80: "Pancadas de chuva leve",
		81: "Pancadas de chuva moderada",
		82: "Pancadas de chuva forte",
		85: "Pancadas de neve leve",
		86: "Pancadas de neve forte",
		95: "Trovoada",
		96: "Trovoada com granizo leve",
		99: "Trovoada com granizo forte",
	}

	if condition, exists := conditions[code]; exists {
		return condition
	}
	return "Desconhecido"
}