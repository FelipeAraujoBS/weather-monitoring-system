// src/weather/weather.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from './schemas/weather.schema';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { QueryWeatherDto } from './dto/query-weather.dto';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
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
  async generateAIInsight(id: string): Promise<Weather | null> {
    const weather = await this.weatherModel.findById(id).exec();

    if (!weather) {
      return null;
    }

    // TODO: Integrar com API de IA (Claude, GPT, etc.)
    const insight = `Temperatura de ${weather.current.temperature}°C com umidade de ${weather.current.humidity}%. Condições: ${weather.current.condition}.`;

    weather.aiInsight = insight;
    return weather.save();
  }

  // 6. EXPORTAR DADOS (placeholder)
  async exportData(query: QueryWeatherDto, format: 'csv' | 'xlsx') {
    const data = await this.getHistory(query);

    // TODO: Implementar lógica de exportação CSV/XLSX
    return {
      format,
      records: data.length,
      message: 'Export functionality to be implemented',
    };
  }

  // Método auxiliar para calcular média
  private average(numbers: number[]): number {
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }

  // MÉTODOS LEGADOS (se você ainda tiver código antigo usando eles)
  async updateWeatherData(data: any): Promise<Weather> {
    // Wrapper para manter compatibilidade
    return this.create(data as CreateWeatherDto);
  }

  async getCurrentData(): Promise<Weather | null> {
    // Wrapper para manter compatibilidade
    return this.getLatest();
  }
}
