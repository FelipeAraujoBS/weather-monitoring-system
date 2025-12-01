package worker

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"go-rabbitmq-worker/internal/config"
)

func ProcessAndSend(body []byte, cfg *config.Config) bool {
	log.Printf("📤 Sending to API: %s", cfg.NestJSAPIURL)
	return sendToNestJSAPI(body, cfg)
}

func sendToNestJSAPI(body []byte, cfg *config.Config) bool {
	req, err := http.NewRequest("POST", cfg.NestJSAPIURL, bytes.NewBuffer(body))
	if err != nil {
		log.Printf("❌ Error creating HTTP request: %v", err)
		return false
	}

	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{Timeout: cfg.HTTPTimeout}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("❌ Error sending HTTP request: %v", err)
		return false
	}
	defer resp.Body.Close()

	// Ler resposta
	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		log.Printf("❌ API returned %d: %s", resp.StatusCode, string(respBody))
		return false
	}

	log.Printf("✅ Successfully sent to NestJS API (Status: %d)", resp.StatusCode)
	return true
}