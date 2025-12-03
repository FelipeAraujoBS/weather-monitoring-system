// src/services/weatherApi.ts
import { API_CONFIG, getAuthHeaders } from "../config/api";
import { AuthApiService } from "./authApi";
import type {
  WeatherDocument,
  WeatherStats,
  WeatherData,
  AiInsightResponse, // ✅ Novo tipo
} from "../types";

export class WeatherApiService {
  private static baseUrl = API_CONFIG.BASE_URL;

  /**
   * Requisição genérica com autenticação
   */
  private static async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const token = AuthApiService.getToken();

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: getAuthHeaders(token || undefined),
        ...options,
      });

      if (!response.ok) {
        if (response.status === 401) {
          AuthApiService.removeToken();
          window.location.href = "/login";
        }
        const error = await response.json();
        throw new Error(error.message || `Erro ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  }

  /**
   * Busca o último dado meteorológico
   */
  static async getLatestWeather(): Promise<{
    message: string;
    data: WeatherDocument;
  }> {
    const response = await this.request<{
      message: string;
      data: WeatherDocument;
    }>(API_CONFIG.ENDPOINTS.WEATHER_LATEST);
    return response;
  }

  /**
   * Busca histórico de dados meteorológicos
   */
  static async getWeatherHistory(): Promise<WeatherDocument[]> {
    const response = await this.request<
      WeatherDocument[] | { data: WeatherDocument[] }
    >(API_CONFIG.ENDPOINTS.WEATHER_HISTORY);

    // Se a resposta for um objeto com propriedade 'data', retorna data
    if (response && typeof response === "object" && "data" in response) {
      return response.data;
    }

    // Se já for um array, retorna direto
    if (Array.isArray(response)) {
      return response;
    }

    // Se não for nenhum dos dois, retorna array vazio
    console.warn("Formato de resposta inesperado do histórico:", response);
    return [];
  }

  /**
   * Busca estatísticas
   */
  static async getWeatherStats(): Promise<WeatherStats> {
    return await this.request<WeatherStats>(API_CONFIG.ENDPOINTS.WEATHER_STATS);
  }

  /**
   * Gera insight de IA para um registro específico
   * ✅ CORRIGIDO: Retorna AiInsightResponse que contém data.aiInsight
   */
  static async generateInsight(weatherId: string): Promise<AiInsightResponse> {
    return await this.request<AiInsightResponse>(
      API_CONFIG.ENDPOINTS.WEATHER_INSIGHT(weatherId),
      { method: "POST" }
    );
  }

  /**
   * Converte histórico para formato do gráfico (últimas 24 horas)
   */
  static formatWeatherDataForChart(history: WeatherDocument[]): WeatherData[] {
    if (!Array.isArray(history) || history.length === 0) {
      console.warn("Histórico vazio ou inválido");
      return [];
    }

    try {
      // Ordena por timestamp e pega últimas 24 horas
      const sorted = [...history].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      const last24 = sorted.slice(-24);

      return last24.map((doc) => {
        const date = new Date(doc.timestamp);
        const time = date.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        });

        return {
          time,
          temperature: Math.round(doc.current.temperature),
          humidity: Math.round(doc.current.humidity),
          windSpeed: Math.round(doc.current.windSpeed),
        };
      });
    } catch (error) {
      console.error("Erro ao formatar dados do gráfico:", error);
      return [];
    }
  }

  /**
   * Obtém estatísticas do documento atual
   */
  static getCurrentStats(document: WeatherDocument) {
    const current = document.current || {};

    return {
      temperature: Math.round(current.temperature || 0),
      feelsLike: Math.round(current.feelsLike || 0),
      humidity: Math.round(current.humidity || 0),
      windSpeed: Math.round(current.windSpeed || 0),
      pressure: Math.round(current.pressure || 0),
      visibility: Math.round(current.visibility || 0),
      uvIndex: current.uvIndex || 0,
      condition: current.condition || "N/A",
      precipitation: current.precipitation || 0,
      precipitationProbability: current.precipitationProbability || 0,
    };
  }
}
