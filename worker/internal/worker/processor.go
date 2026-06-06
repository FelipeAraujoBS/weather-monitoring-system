package worker

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"go-rabbitmq-worker/internal/config"
)

var httpClient = &http.Client{Timeout: 30 * time.Second}

func ProcessAndSend(body []byte, cfg *config.Config) bool {
	log.Printf("📤 Sending to API: %s", cfg.NestJSAPIURL)
	return sendToNestJSAPI(body, cfg)
}

func sendToNestJSAPI(body []byte, cfg *config.Config) bool {
	ctx, cancel := context.WithTimeout(context.Background(), cfg.HTTPTimeout)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, "POST", cfg.NestJSAPIURL, bytes.NewBuffer(body))
	if err != nil {
		log.Printf("❌ Error creating HTTP request: %v", err)
		return false
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "GoWorker/1.0")

	resp, err := httpClient.Do(req)
	if err != nil {
		log.Printf("❌ Error sending HTTP request: %v", err)
		return false
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("❌ Error reading response body: %v", err)
		return false
	}

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		log.Printf("❌ API returned %d: %s", resp.StatusCode, string(respBody))
		return false
	}

	log.Printf("✅ Successfully sent to NestJS API (Status: %d)", resp.StatusCode)
	return true
}