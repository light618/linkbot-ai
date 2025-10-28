package limiter

import (
	"context"
	"time"
)

// RateLimiter 限流器接口
type RateLimiter interface {
	Allow() bool
	Wait(ctx context.Context) error
}

// rateLimiter 令牌桶限流器
type rateLimiter struct {
	limiter chan time.Time
}

// NewRateLimiter 创建新的限流器
func NewRateLimiter(rate int, burst int) RateLimiter {
	rl := &rateLimiter{
		limiter: make(chan time.Time, burst),
	}

	// 启动令牌生成器
	go rl.tokenGenerator(rate)

	return rl
}

// Allow 检查是否允许请求
func (rl *rateLimiter) Allow() bool {
	select {
	case <-rl.limiter:
		return true
	default:
		return false
	}
}

// Wait 等待直到允许请求
func (rl *rateLimiter) Wait(ctx context.Context) error {
	select {
	case <-rl.limiter:
		return nil
	case <-ctx.Done():
		return ctx.Err()
	}
}

// tokenGenerator 令牌生成器
func (rl *rateLimiter) tokenGenerator(rate int) {
	ticker := time.NewTicker(time.Second / time.Duration(rate))
	defer ticker.Stop()

	for range ticker.C {
		select {
		case rl.limiter <- time.Now():
		default:
			// 桶已满，丢弃令牌
		}
	}
}
