import { useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { WeatherApiService } from "../../services/weatherApi";

export function ExportButtons() {
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: "csv" | "xlsx") => {
    setLoading(true);
    try {
      await WeatherApiService.exportWeatherData(format);
      alert(`✅ Arquivo ${format.toUpperCase()} baixado com sucesso!`);
    } catch (error) {
      console.error("Erro ao exportar:", error);
      alert("❌ Erro ao exportar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex mt-2 -mb-7 gap-3">
      <button
        onClick={() => handleExport("csv")}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Download size={16} />
        Exportar CSV
      </button>

      <button
        onClick={() => handleExport("xlsx")}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FileSpreadsheet size={16} />
        Exportar Excel
      </button>
    </div>
  );
}
