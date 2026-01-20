// src/weather/schemas/weather.schema.ts
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
  condition: string;

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

// ✅ NOVO: Sub-schema para insights da IA
@Schema({ _id: false })
export class AiInsight {
  @Prop()
  summary: string;

  @Prop({ type: [String], default: [] })
  alerts: string[];

  @Prop({ type: [String], default: [] })
  recommendations: string[];

  @Prop()
  trends: string;

  @Prop({ type: Date, default: Date.now })
  generatedAt: Date;
}

@Schema({ timestamps: true })
export class Weather {
  @Prop({ required: true, type: Date, index: true })
  timestamp: Date;

  @Prop({ required: true, type: Location })
  location: Location;

  @Prop({ required: true, type: CurrentWeather })
  current: CurrentWeather;

  @Prop({ required: true, type: DailyWeather })
  daily: DailyWeather;

  @Prop({ default: 'open-meteo' })
  source: string;

  @Prop({ type: AiInsight }) // ✅ Agora é um objeto estruturado
  aiInsight?: AiInsight;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);

// Índices para otimizar queries comuns
WeatherSchema.index({ timestamp: -1 });
WeatherSchema.index({ 'location.city': 1, timestamp: -1 });
