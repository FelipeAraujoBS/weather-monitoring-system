export interface WeatherData {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

export interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export interface HeaderProps {
  onLogout: () => void;
}

export interface WeatherChartProps {
  data: WeatherData[];
}

export interface LoginPageProps {
  onLogin: () => void;
  onNavigateToRegister: () => void;
}

export interface RegisterPageProps {
  onRegister: () => void;
  onNavigateToLogin: () => void;
}

export interface DashboardProps {
  onLogout: () => void;
}

export interface LandingPageProps {
  onGetStarted: () => void;
}

export interface Insight {
  type: string;
  message: string;
  color: string;
}

export interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

// ==================== WEATHER TYPES ====================

export interface Location {
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  cloudCover: number;
  visibility: number;
  weatherCode: number;
  condition: string;
  precipitation: number;
  precipitationProbability: number;
}

export interface DailyWeather {
  tempMin: number;
  tempMax: number;
}

export interface AiInsight {
  summary: string;
  alerts: string[];
  recommendations: string[];
  trends: string;
  generatedAt: string; // ✅ Data de geração do insight
}

// ✅ NOVO: Tipo para a resposta do generateInsight
export interface AiInsightResponse {
  message: string;
  data: {
    _id: string;
    timestamp: string;
    source: string;
    location: Location;
    current: CurrentWeather;
    daily: DailyWeather;
    aiInsight: AiInsight; // ✅ O insight está aqui dentro
    createdAt: string;
    updatedAt: string;
  };
}

export interface WeatherDocument {
  _id: string;
  timestamp: string;
  location: Location;
  current: CurrentWeather;
  daily: DailyWeather;
  source: string;
  aiInsight?: AiInsight;
  createdAt: string;
  updatedAt: string;
}

export interface WeatherResponse {
  message: string;
  data: WeatherDocument;
}

export interface WeatherHistoryResponse {
  data: WeatherDocument[];
  count: number;
}

export interface WeatherStats {
  averageTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  averageHumidity: number;
  totalRecords: number;
}

// ==================== AUTH TYPES ====================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    access_token: string;
  };
  acess_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
}

// ==================== CHART DATA ====================

export interface WeatherData {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export type PageType = "landing" | "login" | "register" | "dashboard";
