// src/weather/weather.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { QueryWeatherDto } from './dto/query-weather.dto';

@Controller('weather')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  // 1. ENDPOINT DE RECEBIMENTO (Para o Go Worker)
  // Rota: POST /api/weather
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createWeatherDto: CreateWeatherDto) {
    const savedData = await this.weatherService.create(createWeatherDto);
    return {
      message: 'Weather data processed and saved successfully.',
      data: savedData,
    };
  }

  // 2. ENDPOINT PARA DADOS MAIS RECENTES
  // Rota: GET /api/weather/latest
  @Get('latest')
  async getLatest(@Query('city') city?: string) {
    const data = await this.weatherService.getLatest(city);

    if (!data) {
      throw new NotFoundException(
        city
          ? `No weather data found for city: ${city}`
          : 'No weather data available yet.',
      );
    }

    return {
      message: 'Latest weather data retrieved successfully.',
      data,
    };
  }

  // 3. ENDPOINT PARA HISTÓRICO COM FILTROS
  // Rota: GET /api/weather/history
  @Get('history')
  async getHistory(@Query() query: QueryWeatherDto) {
    const data = await this.weatherService.getHistory(query);

    return {
      message: 'Weather history retrieved successfully.',
      count: data.length,
      data,
    };
  }

  // 4. ENDPOINT PARA ESTATÍSTICAS
  // Rota: GET /api/weather/stats
  @Get('stats')
  async getStats(
    @Query('city') city?: string,
    @Query('days') days: number = 7,
  ) {
    const stats = await this.weatherService.getStats(city, days);

    return {
      message: 'Weather statistics calculated successfully.',
      period: `Last ${days} days`,
      data: stats,
    };
  }

  // 5. ENDPOINT PARA GERAR INSIGHT COM IA
  // Rota: POST /api/weather/:id/insight
  @Post(':id/insight')
  async generateInsight(@Param('id') id: string) {
    const updatedWeather = await this.weatherService.generateAIInsight(id);

    if (!updatedWeather) {
      throw new NotFoundException(`Weather data with ID ${id} not found.`);
    }

    return {
      message: 'AI insight generated successfully.',
      data: updatedWeather,
    };
  }

  // 6. ENDPOINT PARA EXPORTAR DADOS (CSV/XLSX)
  // Rota: GET /api/weather/export
  @Get('export')
  async exportData(
    @Query() query: QueryWeatherDto,
    @Query('format') format: 'csv' | 'xlsx' = 'csv',
  ) {
    // Implementar lógica de exportação
    const data = await this.weatherService.exportData(query, format);

    return data; // Retornar o arquivo ou URL do arquivo
  }
}
