package main 

import (
	"log"
	"time"

	"github.com/rabbitmq/amqp091-go"
	"github.com/joho/godotenv"
)

const (
	rabbitMqURL = "amqp://:guest@localhost:5672/"
	queueName    = ""

)