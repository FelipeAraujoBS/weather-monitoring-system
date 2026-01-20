package main

import (
	"log"
	"go-rabbitmq-worker/internal/config"
	"go-rabbitmq-worker/internal/worker"
)

func main() {
	log.Println("🚀 Iniciando Worker Go...")
	
	// 1. Carregar Configurações
	cfg := config.LoadConfig()
	
	// 2. Iniciar o Worker
	worker.StartWorker(cfg)
}