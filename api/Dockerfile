    # BUILD 
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Copia package.json e package-lock.json/yarn.lock para instalar dependências
    COPY package*.json ./
    
    # Instala as dependências de produção e desenvolvimento
    RUN npm install
    
    # Copia o restante do código
    COPY . .
    
    # Compila o código TypeScript para JavaScript
    RUN npm run build
    
    
    # PRODUÇÃO 
    FROM node:20-alpine AS production
    
    # Define o diretório de trabalho
    WORKDIR /app
    
    # Copia apenas o package.json (para instalar dependências de produção)
    COPY package*.json ./
    
    # Instala apenas as dependências necessárias para rodar (produção)
    # Usa --omit=dev para ignorar dependências de desenvolvimento (como TypeScript, Nest CLI)
    RUN npm install --omit=dev
    
    # Copia os arquivos compilados da fase 'builder'
    # Isso garante que a imagem final seja muito menor
    COPY --from=builder /app/dist ./dist
    
    # Expõe a porta que o NestJS estará ouvindo
    EXPOSE 5000
    
    # Comando para rodar a aplicação em produção
    CMD ["node", "dist/main"]