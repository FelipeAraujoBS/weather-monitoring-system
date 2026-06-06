import { useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { WeatherApiService } from "../../services/weatherApi";

export function ExportButtons() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleExport = async (format: "csv" | "xlsx") => {
    setLoading(true);
    setFeedback(null);
    try {
      await WeatherApiService.exportWeatherData(format);
      setFeedback({ type: "success", message: `Arquivo ${format.toUpperCase()} baixado com sucesso!` });
    } catch (error) {
      console.error("Erro ao exportar:", error);
      setFeedback({ type: "error", message: "Erro ao exportar dados. Tente novamente." });
    } finally {
      setLoading(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3">
        <button
          onClick={() => handleExport("csv")}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download size={16} />
          {loading ? "Exportando..." : "Exportar CSV"}
        </button>

        <button
          onClick={() => handleExport("xlsx")}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FileSpreadsheet size={16} />
          {loading ? "Exportando..." : "Exportar Excel"}
        </button>
      </div>
      {feedback && (
        <p className={`text-sm ${feedback.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {feedback.message}
        </p>
      )}
    </div>
  );
}
