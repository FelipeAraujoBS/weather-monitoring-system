import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeatherDocument = HydratedDocument<Weather>;

// Sub-schema para localização
@Schema({ _id: false })
export class Location {
  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop()
  latitude?: number;

  @Prop()
  longitude?: number;
}

// Sub-schema para dados atuais
@Schema({ _id: false })
export class CurrentWeather {
  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  feelsLike: number;

  @Prop({ required: true })
  humidity: number;

  @Prop({ required: true })
  pressure: number;

  @Prop({ required: true })
  windSpeed: number;

  @Prop({ required: true })
  windDirection: number;

  @Prop({ required: true })
  uvIndex: number;

  @Prop({ required: true })
  cloudCover: number;

  @Prop({ required: true })
  visibility: number;

  @Prop({ required: true })
  weatherCode: number;

  @Prop({ required: true })
  condition: string; // Descrição textual (ex: "Céu limpo", "Parcialmente nublado")

  @Prop({ default: 0 })
  precipitation: number;

  @Prop({ default: 0 })
  precipitationProbability: number;
}

// Sub-schema para dados diários
@Schema({ _id: false })
export class DailyWeather {
  @Prop({ required: true })
  tempMin: number;

  @Prop({ required: true })
  tempMax: number;
}

@Schema({ timestamps: true }) // Adiciona createdAt e updatedAt automaticamente
export class Weather {
  @Prop({ required: true, type: Date, index: true })
  timestamp: Date; // Data/hora da coleta dos dados

  @Prop({ required: true, type: Location })
  location: Location;

  @Prop({ required: true, type: CurrentWeather })
  current: CurrentWeather;

  @Prop({ required: true, type: DailyWeather })
  daily: DailyWeather;

  // Campos opcionais úteis
  @Prop({ default: 'open-meteo' })
  source: string; // Fonte dos dados

  @Prop()
  aiInsight?: string; // Campo para armazenar insights gerados pela IA
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);

// Índices para otimizar queries comuns
WeatherSchema.index({ timestamp: -1 }); // Para buscar dados mais recentes
WeatherSchema.index({ 'location.city': 1, timestamp: -1 }); // Para filtrar por cidade e data
