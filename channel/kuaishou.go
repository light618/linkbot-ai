package channel

import (
	"fmt"
	"log"
	"time"

	"live-im-proxy/event"
	"live-im-proxy/pipeline"
)

// KuaishouChannel 快手渠道
type KuaishouChannel struct {
	pipeline *pipeline.Pipeline
	roomID   string
	connected bool
}

// NewKuaishouChannel 创建快手渠道
func NewKuaishouChannel(pipeline *pipeline.Pipeline) (*KuaishouChannel, error) {
	return &KuaishouChannel{
		pipeline: pipeline,
		connected: false,
	}, nil
}

// Start 启动渠道，传入access_token
func (k *KuaishouChannel) Start(roomID, accessToken string) error {
	k.roomID = roomID
	k.connected = true

	log.Printf("⚡ 快手渠道启动，房间ID: %s", roomID)

	// 模拟接收事件
	go k.simulateEvents()

	return nil
}

// Stop 停止渠道
func (k *KuaishouChannel) Stop() error {
	k.connected = false
	log.Printf("🛑 快手渠道已停止")
	return nil
}

// SendMessage 发送消息
func (k *KuaishouChannel) SendMessage(content string) error {
	if !k.connected {
		return fmt.Errorf("渠道未连接")
	}

	log.Printf("📤 快手发送消息: %s", content)
	return nil
}

// IsConnected 检查是否已连接
func (k *KuaishouChannel) IsConnected() bool {
	return k.connected
}

// GetStatus 获取状态
func (k *KuaishouChannel) GetStatus() string {
	if k.connected {
		return "online"
	}
	return "offline"
}

// simulateEvents 模拟事件
func (k *KuaishouChannel) simulateEvents() {
	ticker := time.NewTicker(8 * time.Second)
	defer ticker.Stop()

	eventTypes := []string{"enter", "comment", "like", "follow"}
	users := []string{"快手用户1", "快手用户2", "快手用户3", "快手用户4"}
	comments := []string{
		"这个看起来不错",
		"多少钱？",
		"怎么买？",
		"有现货吗？",
		"包邮吗？",
	}

	for {
		select {
		case <-ticker.C:
			if !k.connected {
				return
			}

			eventType := eventTypes[time.Now().Unix()%int64(len(eventTypes))]
			user := users[time.Now().Unix()%int64(len(users))]
			userID := fmt.Sprintf("kuaishou_%d", time.Now().Unix())

			evt := event.NewEvent(eventType, "kuaishou", k.roomID, userID, user)

			if eventType == "comment" {
				comment := comments[time.Now().Unix()%int64(len(comments))]
				evt.SetContent(comment)
			}

			if err := k.pipeline.ProcessEvent(evt); err != nil {
				log.Printf("❌ 处理事件失败: %v", err)
			}

			log.Printf("📨 快手事件: %s - %s", eventType, user)
		}
	}
}
