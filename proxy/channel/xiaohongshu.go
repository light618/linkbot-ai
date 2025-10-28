package channel

import (
	"fmt"
	"log"
	"time"

	"live-im-proxy/event"
	"live-im-proxy/pipeline"
)

// XiaohongshuChannel 小红书渠道
type XiaohongshuChannel struct {
	pipeline *pipeline.Pipeline
	roomID   string
	connected bool
}

// NewXiaohongshuChannel 创建小红书渠道
func NewXiaohongshuChannel(pipeline *pipeline.Pipeline) (*XiaohongshuChannel, error) {
	return &XiaohongshuChannel{
		pipeline: pipeline,
		connected: false,
	}, nil
}

// Start 启动渠道
func (x *XiaohongshuChannel) Start(roomID, accessToken string) error {
	x.roomID = roomID
	x.connected = true

	log.Printf("📝 小红书渠道启动，房间ID: %s", roomID)

	// 模拟接收事件
	go x.simulateEvents()

	return nil
}

// Stop 停止渠道
func (x *XiaohongshuChannel) Stop() error {
	x.connected = false
	log.Printf("🛑 小红书渠道已停止")
	return nil
}

// SendMessage 发送消息
func (x *XiaohongshuChannel) SendMessage(content string) error {
	if !x.connected {
		return fmt.Errorf("渠道未连接")
	}

	log.Printf("📤 小红书发送消息: %s", content)
	return nil
}

// IsConnected 检查是否已连接
func (x *XiaohongshuChannel) IsConnected() bool {
	return x.connected
}

// GetStatus 获取状态
func (x *XiaohongshuChannel) GetStatus() string {
	if x.connected {
		return "online"
	}
	return "offline"
}

// simulateEvents 模拟事件
func (x *XiaohongshuChannel) simulateEvents() {
	ticker := time.NewTicker(12 * time.Second)
	defer ticker.Stop()

	eventTypes := []string{"enter", "comment", "like", "follow"}
	users := []string{"小红书用户1", "小红书用户2", "小红书用户3", "小红书用户4", "小红书用户5"}
	comments := []string{
		"这个看起来很棒！",
		"在哪里买？",
		"价格怎么样？",
		"有推荐吗？",
		"效果如何？",
		"值得购买吗？",
	}

	for {
		select {
		case <-ticker.C:
			if !x.connected {
				return
			}

			eventType := eventTypes[time.Now().Unix()%int64(len(eventTypes))]
			user := users[time.Now().Unix()%int64(len(users))]
			userID := fmt.Sprintf("xiaohongshu_%d", time.Now().Unix())

			evt := event.NewEvent(eventType, "xiaohongshu", x.roomID, userID, user)

			if eventType == "comment" {
				comment := comments[time.Now().Unix()%int64(len(comments))]
				evt.SetContent(comment)
			}

			if err := x.pipeline.ProcessEvent(evt); err != nil {
				log.Printf("❌ 处理事件失败: %v", err)
			}

			log.Printf("📨 小红书事件: %s - %s", eventType, user)
		}
	}
}
