// src/ai/ai.module.ts
import { Module } from '@nestjs/common';
import { AiService } from './ia.service';

@Module({
  providers: [AiService],
  exports: [AiService], // Exporta para ser usado em outros módulos
})
export class AiModule {}
