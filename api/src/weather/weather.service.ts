// src/weather/weather.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from './schemas/weather.schema';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { QueryWeatherDto } from './dto/query-weather.dto';
import { AiService } from 'src/ai/ia.service';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
    private readonly aiService: AiService,
  ) {}

  // 1. CRIAR NOVO REGISTRO (Recebe dados do Worker Go)
  async create(createWeatherDto: CreateWeatherDto): Promise<Weather> {
    const createdWeather = new this.weatherModel({
      ...createWeatherDto,
      source: createWeatherDto.source || 'open-meteo',
    });

    return createdWeather.save();
  }

  // 2. BUSCAR DADOS MAIS RECENTES
  async getLatest(city?: string): Promise<Weather | null> {
    const filter = city ? { 'location.city': city } : {};

    return this.weatherModel
      .findOne(filter)
      .sort({ timestamp: -1 }) // Ordena do mais recente para o mais antigo
      .exec();
  }

  // 3. BUSCAR HISTÓRICO COM FILTROS
  async getHistory(query: QueryWeatherDto): Promise<Weather[]> {
    const filter: any = {};

    // Filtro por cidade
    if (query.city) {
      filter['location.city'] = query.city;
    }

    // Filtro por intervalo de datas
    if (query.startDate || query.endDate) {
      filter.timestamp = {};

      if (query.startDate) {
        filter.timestamp.$gte = new Date(query.startDate);
      }

      if (query.endDate) {
        filter.timestamp.$lte = new Date(query.endDate);
      }
    }

    return this.weatherModel
      .find(filter)
      .sort({ timestamp: -1 })
      .limit(query.limit || 10)
      .skip(query.skip || 0)
      .exec();
  }

  // 4. CALCULAR ESTATÍSTICAS
  async getStats(city?: string, days: number = 7) {
    const filter: any = {
      timestamp: {
        $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      },
    };

    if (city) {
      filter['location.city'] = city;
    }

    const data = await this.weatherModel.find(filter).exec();

    if (data.length === 0) {
      return null;
    }

    // Calcula estatísticas
    const temperatures = data.map((d) => d.current.temperature);
    const humidities = data.map((d) => d.current.humidity);
    const uvIndexes = data.map((d) => d.current.uvIndex);

    return {
      period: {
        days,
        startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      },
      totalRecords: data.length,
      temperature: {
        avg: this.average(temperatures),
        min: Math.min(...temperatures),
        max: Math.max(...temperatures),
      },
      humidity: {
        avg: this.average(humidities),
        min: Math.min(...humidities),
        max: Math.max(...humidities),
      },
      uvIndex: {
        avg: this.average(uvIndexes),
        max: Math.max(...uvIndexes),
      },
    };
  }

  // 5. GERAR INSIGHT COM IA (placeholder - você implementará depois)
  async generateInsightForWeather(weatherId: string): Promise<WeatherDocument> {
    // 1. Busca os dados do MongoDB
    const weather = await this.weatherModel.findById(weatherId).exec();

    if (!weather) {
      throw new NotFoundException(
        `Weather data with ID ${weatherId} not found.`,
      );
    }

    // 2. Prepara os dados para a IA (usando a estrutura do seu schema)
    const weatherData = {
      temperature: weather.current.temperature,
      humidity: weather.current.humidity,
      windSpeed: weather.current.windSpeed,
      condition: weather.current.condition,
      timestamp: weather.timestamp,
    };

    // 3. Chama o AiService para gerar o insight
    const insight = await this.aiService.generateWeatherInsight(weatherData);

    // 4. Atualiza o documento com o insight gerado
    weather.aiInsight = {
      ...insight,
      generatedAt: new Date(),
    };

    await weather.save();

    return weather;
  }

  async exportData(
    query: QueryWeatherDto,
    format: 'csv' | 'xlsx',
  ): Promise<{ buffer: Buffer; filename: string; mimeType: string }> {
    // Buscar os dados do histórico
    const data = await this.getHistory(query);

    // Mapear dados para formato de exportação
    const exportData = data.map((record) => ({
      Data: new Date(record.timestamp).toLocaleString('pt-BR'),
      Temperatura: record.current?.temperature || 'N/A',
      'Sensação Térmica': record.current?.feelsLike || 'N/A',
      'Umidade (%)': record.current?.humidity || 'N/A',
      'Precipitação (mm)': record.current?.precipitation || 0,
      'Probabilidade de Chuva (%)':
        record.current?.precipitationProbability || 0,
      'Condição Climática': record.current?.condition || 'N/A',
      'Velocidade do Vento (km/h)': record.current?.windSpeed || 'N/A',
      'Direção do Vento (°)': record.current?.windDirection || 'N/A',
      'Pressão Atmosférica (hPa)': record.current?.pressure || 'N/A',
      'Índice UV': record.current?.uvIndex || 'N/A',
      'Cobertura de Nuvens (%)': record.current?.cloudCover || 'N/A',
      'Visibilidade (m)': record.current?.visibility || 'N/A',
      'Temperatura Mínima': record.daily?.tempMin || 'N/A',
      'Temperatura Máxima': record.daily?.tempMax || 'N/A',
      Localização:
        record.location?.city && record.location?.state
          ? `${record.location.city}/${record.location.state}`
          : 'N/A',
      País: record.location?.country || 'N/A',
      Fonte: record.source || 'N/A',
      'Sumário IA': record.aiInsight?.summary || 'N/A',
      'Recomendações IA': record.aiInsight?.recommendations
        ? Array.isArray(record.aiInsight.recommendations)
          ? record.aiInsight.recommendations.join(' | ')
          : record.aiInsight.recommendations
        : 'N/A',
      'Alertas IA': record.aiInsight?.alerts
        ? Array.isArray(record.aiInsight.alerts)
          ? record.aiInsight.alerts.join(' | ')
          : record.aiInsight.alerts
        : 'N/A',
      'Horário do Insight': record.aiInsight?.generatedAt
        ? new Date(record.aiInsight.generatedAt).toLocaleString('pt-BR')
        : 'N/A',
    }));

    if (format === 'csv') {
      return this.generateCSV(exportData);
    } else {
      return this.generateXLSX(exportData);
    }
  }

  // Gerar arquivo CSV
  private generateCSV(data: any[]): {
    buffer: Buffer;
    filename: string;
    mimeType: string;
  } {
    const csv = Papa.unparse(data, {
      delimiter: ',',
      header: true,
      newline: '\r\n',
    });

    const buffer = Buffer.from('\ufeff' + csv, 'utf-8'); // BOM para Excel PT-BR
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `dados-climaticos-${timestamp}.csv`;

    return {
      buffer,
      filename,
      mimeType: 'text/csv',
    };
  }

  // Gerar arquivo XLSX
  private generateXLSX(data: any[]): {
    buffer: Buffer;
    filename: string;
    mimeType: string;
  } {
    // Criar workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados Climáticos');

    // Ajustar largura das colunas
    const maxWidth = 20;
    const cols = Object.keys(data[0] || {}).map(() => ({ wch: maxWidth }));
    worksheet['!cols'] = cols;

    // Gerar buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `dados-climaticos-${timestamp}.xlsx`;

    return {
      buffer,
      filename,
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
  }

  // Método auxiliar para calcular média
  private average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  // MÉTODOS LEGADOS (se você ainda tiver código antigo usando eles)
  async updateWeatherData(data: any): Promise<Weather> {
    return this.create(data as CreateWeatherDto);
  }

  async getCurrentData(): Promise<Weather | null> {
    return this.getLatest();
  }
}
