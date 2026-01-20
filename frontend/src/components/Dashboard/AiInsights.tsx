// src/components/Dashboard/AiInsights.tsx
import React from "react";
import { Sparkles, AlertCircle, Lightbulb, TrendingUp } from "lucide-react";
import type { WeatherDocument } from "../../types";
import { Button } from "../common/button";

interface AiInsightsProps {
  weatherData: WeatherDocument | null;
  onGenerateInsight: () => Promise<void>;
  generatingInsight: boolean;
}

const AiInsights: React.FC<AiInsightsProps> = ({
  weatherData,
  onGenerateInsight,
  generatingInsight,
}) => {
  //format a data
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data não disponível";

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Data inválida";
      }

      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Erro ao formatar data";
    }
  };

  const insight = weatherData?.aiInsight;

  return (
    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Insights de IA
        </h2>
        <Button
          onClick={onGenerateInsight}
          disabled={generatingInsight || !weatherData}
          size="sm"
          className="flex items-center gap-2"
        >
          {generatingInsight ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Gerando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Gerar Insight
            </>
          )}
        </Button>
      </div>

      {!insight ? (
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-4">
            Nenhum insight gerado ainda.
          </p>
          <p className="text-gray-400 text-xs">
            Clique em "Gerar Insight" para obter uma análise detalhada dos dados
            meteorológicos atuais.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Resumo */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Resumo
            </h3>
            <p className="text-sm text-blue-800">{insight.summary}</p>
          </div>

          {/* Alertas */}
          {insight.alerts && insight.alerts.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Alertas
              </h3>
              <ul className="space-y-1">
                {insight.alerts.map((alert, index) => (
                  <li
                    key={index}
                    className="text-sm text-yellow-800 flex items-start gap-2"
                  >
                    <span className="text-yellow-600 mt-1">•</span>
                    <span>{alert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recomendações */}
          {insight.recommendations && insight.recommendations.length > 0 && (
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Recomendações
              </h3>
              <ul className="space-y-1">
                {insight.recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="text-sm text-green-800 flex items-start gap-2"
                  >
                    <span className="text-green-600 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tendências */}
          {insight.trends && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">Tendências</h3>
              <p className="text-sm text-purple-800">{insight.trends}</p>
            </div>
          )}

          {/* ✅ Data de geração do insight */}
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            Insight gerado em: {formatDate(insight.generatedAt)}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiInsights;
