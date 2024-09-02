package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"goredis/kvstore"
)

var redisStore *kvstore.RedisStore

type KeyValue struct {
	Key   string `json:"key"`
	Value string `json:"value"`
	TTL   int    `json:"ttl,omitempty"`
}

func main() {
	var err error
	redisStore, err = kvstore.NewRedisStore("localhost:6379")
	if err != nil {
		log.Fatalf("Failed to create Redis store: %v", err)
	}
	defer redisStore.Close()

	http.HandleFunc("/get", handleGet)
	http.HandleFunc("/set", handleSet)

	fmt.Println("Server is running on http://localhost:8100")
	log.Fatal(http.ListenAndServe(":8100", nil))
}

func handleGet(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	key := r.URL.Query().Get("key")
	if key == "" {
		http.Error(w, "Key is required", http.StatusBadRequest)
		return
	}

	value, err := redisStore.Get(r.Context(), key)
	if err != nil {
		msg := fmt.Sprintf("Failed to get value: %v", err)
		fmt.Println(key + ":", msg)
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"value": string(value)})
}

func handleSet(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()
	var data KeyValue
	err = json.Unmarshal(body, &data)
	if err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if data.Key == "" || data.Value == "" {
		http.Error(w, "Key and value are required", http.StatusBadRequest)
		return
	}

	var setErr error
	if data.TTL > 0 {
		setErr = redisStore.SetWithTTL(r.Context(), data.Key, []byte(data.Value), time.Duration(data.TTL)*time.Second)
	} else {
		setErr = redisStore.Set(r.Context(), data.Key, []byte(data.Value))
	}

	if setErr != nil {
		http.Error(w, fmt.Sprintf("Failed to set value: %v", setErr), http.StatusInternalServerError)
		return
	}

	fmt.Println(data.Key, "success")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}
