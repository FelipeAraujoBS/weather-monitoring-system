// src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('AI_API_KEY');

    if (!apiKey) {
      throw new Error('AI_API_KEY não configurada no .env');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });
  }

  // src/ai/ai.service.ts
  async generateWeatherInsight(weatherData: any) {
    const prompt = `
    Analise os seguintes dados climáticos de ${weatherData.city}, ${weatherData.state} e gere insights úteis:
    
    Temperatura: ${weatherData.temperature}°C
    Umidade: ${weatherData.humidity}%
    Velocidade do Vento: ${weatherData.windSpeed} km/h
    Condição: ${weatherData.condition}
    Data/Hora: ${weatherData.timestamp}
    
    Forneça em formato JSON:
    {
      "summary": "resumo breve da situação",
      "alerts": ["alerta1", "alerta2"],
      "recommendations": ["recomendação1", "recomendação2"],
      "trends": "análise de tendência"
    }
  `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Tenta extrair JSON da resposta
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      let insightData;
      if (jsonMatch) {
        insightData = JSON.parse(jsonMatch[0]);
      } else {
        insightData = {
          summary: text,
          alerts: [],
          recommendations: [],
          trends: '',
        };
      }

      // ✅ ADICIONA A DATA DE CRIAÇÃO
      return {
        ...insightData,
        createdAt: new Date().toISOString(),
        generatedAt: new Date().toISOString(), // Nome alternativo mais semântico
      };
    } catch (error) {
      console.error('Erro ao gerar insight:', error);
      throw error;
    }
  }
}
