// src/components/pages/Dashboard.tsx
import React from "react";
import {
  TrendingUp,
  Droplets,
  Wind,
  Eye,
  RefreshCw,
  MapPin,
  Thermometer,
} from "lucide-react";
import Header from "../Layout/Header";
import StatsCard from "../Dashboard/StatsCard";
import WeatherChart from "../Dashboard/WeatherChart";
import AIInsights from "../Dashboard/AiInsights";
import { useWeatherData } from "../../hooks/useWeatherData";
import type { DashboardProps, StatsCardProps } from "../../types";
import { Button } from "../common/button";
import { Alert, AlertDescription, AlertTitle } from "../common/alert";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const {
    chartData,
    currentStats,
    currentWeather,
    loading,
    error,
    refetch,
    generateInsight,
    generatingInsight,
  } = useWeatherData();

  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();

    navigate("/login", { replace: true });
  };

  const stats: StatsCardProps[] = [
    {
      title: "Temperatura",
      value: loading ? "..." : `${currentStats.temperature}°C`,
      icon: TrendingUp,
      iconColor: "text-orange-500",
    },
    {
      title: "Umidade",
      value: loading ? "..." : `${currentStats.humidity}%`,
      icon: Droplets,
      iconColor: "text-blue-500",
    },
    {
      title: "Vento",
      value: loading ? "..." : `${currentStats.windSpeed} km/h`,
      icon: Wind,
      iconColor: "text-green-500",
    },
    {
      title: "Visibilidade",
      value: loading ? "..." : `${currentStats.visibility} km`,
      icon: Eye,
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header com localização e botão de atualizar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard Meteorológico
            </h1>
            {currentWeather?.location && (
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">
                  {currentWeather.location.city},{" "}
                  {currentWeather.location.state}
                </span>
              </div>
            )}
          </div>
          <Button
            onClick={refetch}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Erro ao carregar dados</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State Inicial */}
        {loading && chartData.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Carregando dados meteorológicos...
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards - DADOS REAIS */}
        {!loading && !error && currentWeather && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatsCard
                  key={index}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  iconColor={stat.iconColor}
                />
              ))}
            </div>

            {/* Informações adicionais do clima atual */}
            {currentWeather && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-xs text-gray-600">Sensação Térmica</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {currentStats.feelsLike}°C
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-xs text-gray-600">Pressão</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {currentStats.pressure} hPa
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-xs text-gray-600">Índice UV</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {currentStats.uvIndex}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <p className="text-xs text-gray-600">Precipitação</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {currentStats.precipitation}mm (
                    {currentStats.precipitationProbability}%)
                  </p>
                </div>
              </div>
            )}

            {/* Condição atual do tempo */}
            {currentWeather && (
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Condição Atual</p>
                    <p className="text-3xl font-bold">
                      {currentStats.condition}
                    </p>
                    <p className="text-sm opacity-90 mt-2">
                      Mín: {currentWeather.daily?.tempMin || "--"}°C | Máx:{" "}
                      {currentWeather.daily?.tempMax || "--"}°C
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-5xl font-bold">
                      {currentStats.temperature}°C
                    </p>
                    <p className="text-sm opacity-90">
                      Sensação: {currentStats.feelsLike}°C
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Chart and AI Insights - DADOS REAIS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <WeatherChart data={chartData} />
              <AIInsights
                weatherData={currentWeather}
                onGenerateInsight={generateInsight}
                generatingInsight={generatingInsight}
              />
            </div>

            {/* Info de última atualização */}
            {currentWeather && (
              <div className="mt-6 p-4 bg-white rounded-lg shadow position-relative">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Última atualização:</span>{" "}
                    {new Date(currentWeather.timestamp).toLocaleString("pt-BR")}
                  </div>
                  <div>
                    <span className="font-medium">Fonte:</span>{" "}
                    {currentWeather.source}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && !error && !currentWeather && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              Nenhum dado disponível no momento.
            </p>
            <Button onClick={refetch}>Tentar Novamente</Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
