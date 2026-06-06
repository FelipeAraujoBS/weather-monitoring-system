package worker

import (
	"context"
	"log"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	"go-rabbitmq-worker/internal/config"
)

func StartWorker(cfg *config.Config) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)

	var wg sync.WaitGroup

	go func() {
		<-sigCh
		log.Println("🛑 Signal received, shutting down gracefully...")
		cancel()
	}()

	for {
		select {
		case <-ctx.Done():
			log.Println("Worker stopped by context")
			wg.Wait()
			return
		default:
		}

		func() {
			conn, err := amqp.Dial(cfg.RabbitMQURL)
			if err != nil {
				log.Printf("Failed to connect: %v", err)
				select {
				case <-ctx.Done():
					return
				case <-time.After(5 * time.Second):
				}
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

			if err := consumeMessages(ctx, ch, cfg); err != nil {
				log.Printf("Consume error: %v", err)
			}
		}()

		select {
		case <-ctx.Done():
			return
		case <-time.After(5 * time.Second):
		}
	}
}

func consumeMessages(ctx context.Context, ch *amqp.Channel, cfg *config.Config) error {
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

	for {
		select {
		case <-ctx.Done():
			log.Println("Context cancelled, stopping consumer")
			return nil
		case d, ok := <-msgs:
			if !ok {
				return nil
			}
			log.Printf("📨 Received message from Collector")

			transformedData, err := TransformCollectorData(d.Body)
			if err != nil {
				log.Printf("❌ Error transforming data: %v", err)
				if err := d.Nack(false, false); err != nil {
					log.Printf("Nack error: %v", err)
				}
				continue
			}

			log.Println("✅ Data transformed successfully")

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
	}
}