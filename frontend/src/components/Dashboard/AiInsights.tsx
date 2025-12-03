import React from "react";
import { Brain, RefreshCw } from "lucide-react";
import { Button } from "../common/button";
import type { WeatherDocument } from "../../types";

interface AIInsightsProps {
  weatherData: WeatherDocument | null;
  onGenerateInsight?: () => void;
  generatingInsight?: boolean;
}

const AIInsights: React.FC<AIInsightsProps> = ({
  weatherData,
  onGenerateInsight,
  generatingInsight = false,
}) => {
  const hasInsight = weatherData?.aiInsight;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Insights de IA
        </h2>
        {onGenerateInsight && (
          <Button
            onClick={onGenerateInsight}
            disabled={generatingInsight}
            size="sm"
            variant="outline"
          >
            <RefreshCw
              className={`w-4 h-4 mr-1 ${
                generatingInsight ? "animate-spin" : ""
              }`}
            />
            {generatingInsight ? "Gerando..." : "Gerar"}
          </Button>
        )}
      </div>

      {hasInsight ? (
        <div className="space-y-4">
          {/* Resumo */}
          {weatherData.aiInsight?.summary && (
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="text-sm text-gray-700">
                <strong>Resumo:</strong> {weatherData.aiInsight.summary}
              </p>
            </div>
          )}

          {/* Alertas */}
          {weatherData.aiInsight?.alerts &&
            weatherData.aiInsight.alerts.length > 0 && (
              <div className="border-l-4 border-orange-500 pl-4 py-2">
                <p className="text-sm font-bold text-gray-700 mb-2">Alertas:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {weatherData.aiInsight.alerts.map((alert, index) => (
                    <li key={index}>• {alert}</li>
                  ))}
                </ul>
              </div>
            )}

          {/* Recomendações */}
          {weatherData.aiInsight?.recommendations &&
            weatherData.aiInsight.recommendations.length > 0 && (
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="text-sm font-bold text-gray-700 mb-2">
                  Recomendações:
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {weatherData.aiInsight.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            )}

          {/* Tendências */}
          {weatherData.aiInsight?.trends && (
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <p className="text-sm text-gray-700">
                <strong>Tendências:</strong> {weatherData.aiInsight.trends}
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600 italic">
              Insight gerado em:{" "}
              {new Date(
                weatherData.aiInsight?.generatedAt || ""
              ).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">Nenhum insight gerado ainda</p>
          {onGenerateInsight && (
            <Button onClick={onGenerateInsight} disabled={generatingInsight}>
              <Brain className="w-4 h-4 mr-2" />
              Gerar Insight com IA
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AIInsights;
