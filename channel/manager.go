package channel

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sync"

	"live-im-proxy/pipeline"
)

// Manager 渠道管理器
type Manager struct {
	pipeline      *pipeline.Pipeline
	channels      map[string]Channel
	mu            sync.RWMutex
	ctx           context.Context
	cancel        context.CancelFunc
}

// Channel 渠道接口
type Channel interface {
	Start(roomID, accessToken string) error
	Stop() error
	SendMessage(content string) error
	IsConnected() bool
	GetStatus() string
}

// NewManager 创建新的渠道管理器
func NewManager(pipeline *pipeline.Pipeline) *Manager {
	ctx, cancel := context.WithCancel(context.Background())
	return &Manager{
		pipeline: pipeline,
		channels: make(map[string]Channel),
		ctx:      ctx,
		cancel:   cancel,
	}
}

// StartChannel 启动渠道
func (m *Manager) StartChannel(channelType string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	var ch Channel
	var err error

	switch channelType {
	case "douyin":
		ch, err = NewDouyinChannel(m.pipeline)
	case "kuaishou":
		ch, err = NewKuaishouChannel(m.pipeline)
	case "wechat":
		ch, err = NewWechatChannel(m.pipeline)
	case "xiaohongshu":
		ch, err = NewXiaohongshuChannel(m.pipeline)
	default:
		return fmt.Errorf("不支持的渠道类型: %s", channelType)
	}

	if err != nil {
		return err
	}

	m.channels[channelType] = ch

	// 启动渠道
	go func() {
		roomID := getRoomID(channelType)
		accessToken := "" // 临时空token，等待OAuth授权
		if err := ch.Start(roomID, accessToken); err != nil {
			log.Printf("❌ 渠道 %s 启动失败: %v", channelType, err)
		}
	}()

	log.Printf("✅ 渠道 %s 启动成功", channelType)
	return nil
}

// StopAll 停止所有渠道
func (m *Manager) StopAll() {
	m.mu.Lock()
	defer m.mu.Unlock()

	for name, ch := range m.channels {
		if err := ch.Stop(); err != nil {
			log.Printf("❌ 停止渠道 %s 失败: %v", name, err)
		}
	}

	m.cancel()
}

// GetChannelStatus 获取渠道状态
func (m *Manager) GetChannelStatus() map[string]string {
	m.mu.RLock()
	defer m.mu.RUnlock()

	status := make(map[string]string)
	for name, ch := range m.channels {
		status[name] = ch.GetStatus()
	}

	return status
}

// WebSocketHandler WebSocket 处理器
func (m *Manager) WebSocketHandler(w http.ResponseWriter, r *http.Request) {
	// 这里可以实现 WebSocket 连接处理
	// 用于实时监控和调试
	fmt.Fprintf(w, "WebSocket 连接已建立")
}

// getRoomID 获取房间ID（从环境变量或配置）
func getRoomID(channelType string) string {
	// 实际项目中应该从环境变量或配置文件获取
	switch channelType {
	case "douyin":
		return "123456789"
	case "kuaishou":
		return "987654321"
	case "wechat":
		return "456789123"
	case "xiaohongshu":
		return "789123456"
	default:
		return "000000000"
	}
}
