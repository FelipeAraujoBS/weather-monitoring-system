package config

import (
    "fmt"
    "log"
    "os"
    "strings"
    "time"

    "github.com/joho/godotenv"
)

// Config armazena todas as variáveis de ambiente carregadas
type Config struct {
    RabbitMQURL  string
    QueueName    string
    NestJSAPIURL string
    HTTPTimeout  time.Duration
    Environment  string 
}

func LoadConfig() *Config {
    // Tenta carregar .env (útil para desenvolvimento local)
    err := godotenv.Load()
    if err != nil {
        log.Println("⚠️  Arquivo .env não encontrado, usando variáveis de ambiente do sistema")
    }

    cfg := &Config{
        RabbitMQURL:  getEnvOrDefault("RABBITMQ_URL", ""),
        QueueName:    getEnvOrDefault("QUEUE_NAME", ""),
        NestJSAPIURL: getEnvOrDefault("NESTJS_API_URL", ""),
        HTTPTimeout:  10 * time.Second,
        Environment:  getEnvOrDefault("ENVIRONMENT", "production"),
    }

    // Validação de variáveis críticas
    if err := cfg.validate(); err != nil {
        log.Fatalf("❌ Erro de Configuração: %v", err)
    }

    // Log das configurações (apenas em modo debug)
    cfg.logConfig()

    return cfg
}

// validate verifica se todas as variáveis obrigatórias estão definidas
func (c *Config) validate() error {
    if c.RabbitMQURL == "" {
        return fmt.Errorf("RABBITMQ_URL não pode estar vazia")
    }
    if c.QueueName == "" {
        return fmt.Errorf("QUEUE_NAME não pode estar vazia")
    }
    if c.NestJSAPIURL == "" {
        return fmt.Errorf("NESTJS_API_URL não pode estar vazia")
    }
    return nil
}

// logConfig exibe as configurações carregadas
func (c *Config) logConfig() {
    log.Println("✅ Configurações carregadas com sucesso:")
    log.Printf("   🌍 Environment: %s", c.Environment)
    log.Printf("   📡 RabbitMQ URL: %s", maskPassword(c.RabbitMQURL))
    log.Printf("   📬 Queue Name: %s", c.QueueName)
    log.Printf("   🌐 NestJS API URL: %s", c.NestJSAPIURL)
    log.Printf("   ⏱️  HTTP Timeout: %s", c.HTTPTimeout)
}

// getEnvOrDefault retorna o valor da variável de ambiente ou um valor padrão
func getEnvOrDefault(key, defaultValue string) string {
    if value := os.Getenv(key); value != "" {
        return value
    }
    return defaultValue
}

// maskPassword oculta credenciais em URLs para logs
func maskPassword(url string) string {
    // amqp://user:password@host:5672/ -> amqp://user:****@host:5672/
    if strings.Contains(url, "@") {
        parts := strings.Split(url, "@")
        if len(parts) == 2 {
            credentials := strings.Split(parts[0], ":")
            if len(credentials) >= 3 {
                return fmt.Sprintf("%s:%s:****@%s", credentials[0], credentials[1], parts[1])
            }
        }
    }
    return url
}