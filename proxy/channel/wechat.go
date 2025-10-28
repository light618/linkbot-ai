package channel

import (
	"fmt"
	"log"
	"time"

	"live-im-proxy/event"
	"live-im-proxy/pipeline"
)

// WechatChannel 微信视频号渠道
type WechatChannel struct {
	pipeline *pipeline.Pipeline
	roomID   string
	connected bool
}

// NewWechatChannel 创建微信渠道
func NewWechatChannel(pipeline *pipeline.Pipeline) (*WechatChannel, error) {
	return &WechatChannel{
		pipeline: pipeline,
		connected: false,
	}, nil
}

// Start 启动渠道
func (w *WechatChannel) Start(roomID, accessToken string) error {
	w.roomID = roomID
	w.connected = true

	log.Printf("💬 微信视频号渠道启动，房间ID: %s", roomID)

	// 模拟接收事件
	go w.simulateEvents()

	return nil
}

// Stop 停止渠道
func (w *WechatChannel) Stop() error {
	w.connected = false
	log.Printf("🛑 微信视频号渠道已停止")
	return nil
}

// SendMessage 发送消息
func (w *WechatChannel) SendMessage(content string) error {
	if !w.connected {
		return fmt.Errorf("渠道未连接")
	}

	log.Printf("📤 微信发送消息: %s", content)
	return nil
}

// IsConnected 检查是否已连接
func (w *WechatChannel) IsConnected() bool {
	return w.connected
}

// GetStatus 获取状态
func (w *WechatChannel) GetStatus() string {
	if w.connected {
		return "online"
	}
	return "offline"
}

// simulateEvents 模拟事件
func (w *WechatChannel) simulateEvents() {
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()

	eventTypes := []string{"enter", "comment", "like", "follow"}
	users := []string{"微信用户1", "微信用户2", "微信用户3"}
	comments := []string{
		"这个产品好用吗？",
		"价格多少？",
		"怎么联系？",
		"有优惠吗？",
		"质量如何？",
	}

	for {
		select {
		case <-ticker.C:
			if !w.connected {
				return
			}

			eventType := eventTypes[time.Now().Unix()%int64(len(eventTypes))]
			user := users[time.Now().Unix()%int64(len(users))]
			userID := fmt.Sprintf("wechat_%d", time.Now().Unix())

			evt := event.NewEvent(eventType, "wechat", w.roomID, userID, user)

			if eventType == "comment" {
				comment := comments[time.Now().Unix()%int64(len(comments))]
				evt.SetContent(comment)
			}

			if err := w.pipeline.ProcessEvent(evt); err != nil {
				log.Printf("❌ 处理事件失败: %v", err)
			}

			log.Printf("📨 微信事件: %s - %s", eventType, user)
		}
	}
}
