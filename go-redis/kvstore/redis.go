package kvstore

import (
	"context"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
)

type RedisStore struct {
	client *redis.Client
}

func NewRedisStore(address string) (*RedisStore, error) {
	client := redis.NewClient(&redis.Options{
		Addr: address,
	})

	// Ping the Redis server to check if the connection is alive
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("failed to connect to Redis: %v", err)
	}

	return &RedisStore{client: client}, nil
}

func (rs *RedisStore) Get(ctx context.Context, key string) ([]byte, error) {
	val, err := rs.client.Get(ctx, key).Bytes()
	if err == redis.Nil {
		return nil, fmt.Errorf("key not found")
	}
	return val, err
}

func (rs *RedisStore) Set(ctx context.Context, key string, value []byte) error {
	return rs.client.Set(ctx, key, value, 0).Err()
}

func (rs *RedisStore) SetWithTTL(ctx context.Context, key string, value []byte, ttl time.Duration) error {
	return rs.client.Set(ctx, key, value, ttl).Err()
}

func (rs *RedisStore) Delete(ctx context.Context, key string) error {
	return rs.client.Del(ctx, key).Err()
}

func (rs *RedisStore) Keys(ctx context.Context, pattern string) ([]string, error) {
	return rs.client.Keys(ctx, pattern).Result()
}

func (rs *RedisStore) Close() error {
	return rs.client.Close()
}