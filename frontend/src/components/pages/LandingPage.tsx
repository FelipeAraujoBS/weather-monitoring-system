import React from "react";
import { Cloud, TrendingUp, Eye } from "lucide-react";
import { Button } from "@/components/common/button";
import type { Feature } from "../../types/index";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = (): void => {
    // Redireciona para a rota de login
    navigate("/login");
  };

  const features: Feature[] = [
    {
      icon: TrendingUp,
      title: "Dados em Tempo Real",
      description:
        "Acesse informações meteorológicas atualizadas constantemente",
    },
    {
      icon: Cloud,
      title: "API Open-Meteo",
      description: "Dados confiáveis de uma das melhores APIs meteorológicas",
    },
    {
      icon: Eye,
      title: "Insights com IA",
      description: "Análises inteligentes para ajudar no seu planejamento",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Cloud className="w-10 h-10 text-white mr-2" />
            <span className="text-2xl font-bold text-white">WeatherDash</span>
          </div>
          <Button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Entrar
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Previsões Meteorológicas Inteligentes
          </h1>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Acompanhe dados climáticos em tempo real com insights gerados por IA
            para decisões mais assertivas
          </p>
          <Button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Começar Agora
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-white"
              >
                <Icon className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
