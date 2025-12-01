package worker

import (
	"log"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	"go-rabbitmq-worker/internal/config"
)

func StartWorker(cfg *config.Config) {
	for {
		func() {
			conn, err := amqp.Dial(cfg.RabbitMQURL)
			if err != nil {
				log.Printf("Failed to connect: %v", err)
				time.Sleep(5 * time.Second)
				return
			}
			defer func() {
				if err := conn.Close(); err != nil {
					log.Printf("Error closing conn: %v", err)
				}
			}()

			ch, err := conn.Channel()
			if err != nil {
				log.Printf("Failed to open channel: %v", err)
				return
			}
			defer func() {
				if err := ch.Close(); err != nil {
					log.Printf("Error closing channel: %v", err)
				}
			}()

			log.Println("✅ Connected to RabbitMQ")

			if err := consumeMessages(ch, cfg); err != nil {
				log.Printf("Consume error: %v", err)
			}
		}()

		log.Println("Reconnecting in 5s...")
		time.Sleep(5 * time.Second)
	}
}

func consumeMessages(ch *amqp.Channel, cfg *config.Config) error {
	_, err := ch.QueueDeclarePassive(
		cfg.QueueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	if err := ch.Qos(1, 0, false); err != nil {
		return err
	}

	msgs, err := ch.Consume(
		cfg.QueueName,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return err
	}

	log.Println("🎧 Waiting for messages...")

	for d := range msgs {
		log.Printf("📨 Received message from Collector")
		
		// ✅ TRANSFORMAR OS DADOS
		transformedData, err := TransformCollectorData(d.Body)
		if err != nil {
			log.Printf("❌ Error transforming data: %v", err)
			// Dados inválidos, não adianta fazer retry
			if err := d.Ack(false); err != nil {
				log.Printf("Ack error: %v", err)
			}
			continue
		}

		log.Println("✅ Data transformed successfully")

		// ENVIAR DADOS TRANSFORMADOS
		if ProcessAndSend(transformedData, cfg) {
			if err := d.Ack(false); err != nil {
				log.Printf("Ack error: %v", err)
			} else {
				log.Println("✅ Message processed and acknowledged")
			}
		} else {
			if err := d.Nack(false, true); err != nil {
				log.Printf("Nack error: %v", err)
			} else {
				log.Println("⚠️ Message processing failed, message requeued")
			}
		}
	}

	return nil
}