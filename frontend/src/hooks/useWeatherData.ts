// src/hooks/useWeatherData.ts
import { useState, useEffect, useCallback } from "react";
import { WeatherApiService } from "../services/weatherApi";
import type { WeatherData, WeatherDocument } from "../types";

interface CurrentStats {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  condition: string;
  precipitation: number;
  precipitationProbability: number;
}

interface UseWeatherDataReturn {
  chartData: WeatherData[];
  currentStats: CurrentStats;
  currentWeather: WeatherDocument | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  generateInsight: () => Promise<void>;
  generatingInsight: boolean;
}

export const useWeatherData = (): UseWeatherDataReturn => {
  const [chartData, setChartData] = useState<WeatherData[]>([]);
  const [currentWeather, setCurrentWeather] = useState<WeatherDocument | null>(
    null
  );

  const [currentStats, setCurrentStats] = useState<CurrentStats>({
    temperature: 0,
    feelsLike: 0,
    humidity: 0,
    windSpeed: 0,
    pressure: 0,
    visibility: 0,
    uvIndex: 0,
    condition: "",
    precipitation: 0,
    precipitationProbability: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingInsight, setGeneratingInsight] = useState(false);

  const fetchWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📄 Buscando dados meteorológicos...");

      // Busca dados atuais
      const latestResponse = await WeatherApiService.getLatestWeather();

      // Extrai o WeatherDocument da propriedade 'data'
      const latestDocument = latestResponse.data;

      console.log("✅ Dados atuais:", latestDocument);
      setCurrentWeather(latestDocument);

      // Busca histórico
      const history = await WeatherApiService.getWeatherHistory();
      console.log("📊 Histórico recebido:", history);

      // Formata dados para o gráfico
      const formattedData =
        WeatherApiService.formatWeatherDataForChart(history);
      console.log("📈 Dados formatados para o gráfico:", formattedData);
      setChartData(formattedData);

      // Obtém estatísticas atuais
      const stats = WeatherApiService.getCurrentStats(latestDocument);
      console.log("📊 Estatísticas atuais:", stats);
      setCurrentStats(stats);

      console.log("✅ Dados carregados com sucesso!");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao carregar dados meteorológicos";
      setError(errorMessage);
      console.error("❌ Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const generateInsight = async () => {
    if (!currentWeather) {
      console.warn(
        "⚠️ Nenhum dado meteorológico disponível para gerar insight"
      );
      return;
    }

    try {
      setGeneratingInsight(true);
      console.log("🤖 Gerando insight para ID:", currentWeather._id);

      // ✅ CORREÇÃO: A resposta vem como { message: "...", data: { aiInsight: {...} } }
      const response = await WeatherApiService.generateInsight(
        currentWeather._id
      );

      console.log("📦 Resposta completa:", response);

      // ✅ Extrai o aiInsight de dentro de data.aiInsight
      const insight = response.data?.aiInsight ?? response;

      console.log("✅ Insight extraído:", insight);

      // Atualiza o currentWeather com o novo insight
      setCurrentWeather({
        ...currentWeather,
        aiInsight: insight,
      });
    } catch (err) {
      console.error("❌ Erro ao gerar insight:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao gerar insight";
      setError(errorMessage);
    } finally {
      setGeneratingInsight(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();

    // Atualiza automaticamente a cada 5 minutos
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchWeatherData]);

  return {
    chartData,
    currentStats,
    currentWeather,
    loading,
    error,
    refetch: fetchWeatherData,
    generateInsight,
    generatingInsight,
  };
};
