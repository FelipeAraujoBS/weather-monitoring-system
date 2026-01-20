// src/weather/dto/create-weather.dto.ts
import {
  IsString,
  IsNumber,
  IsDate,
  ValidateNested,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LocationDto {
  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class CurrentWeatherDto {
  @IsNumber()
  temperature: number;

  @IsNumber()
  feelsLike: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  humidity: number;

  @IsNumber()
  pressure: number;

  @IsNumber()
  @Min(0)
  windSpeed: number;

  @IsNumber()
  @Min(0)
  @Max(360)
  windDirection: number;

  @IsNumber()
  @Min(0)
  uvIndex: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  cloudCover: number;

  @IsNumber()
  @Min(0)
  visibility: number;

  @IsNumber()
  weatherCode: number;

  @IsString()
  condition: string;

  @IsNumber()
  @Min(0)
  precipitation: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  precipitationProbability: number;
}

export class DailyWeatherDto {
  @IsNumber()
  tempMin: number;

  @IsNumber()
  tempMax: number;
}

export class CreateWeatherDto {
  @Type(() => Date)
  @IsDate()
  timestamp: Date;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ValidateNested()
  @Type(() => CurrentWeatherDto)
  current: CurrentWeatherDto;

  @ValidateNested()
  @Type(() => DailyWeatherDto)
  daily: DailyWeatherDto;

  @IsOptional()
  @IsString()
  source?: string;
}
