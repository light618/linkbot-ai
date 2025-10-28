package reply

import (
	"encoding/json"
	"fmt"
	"log"
	"time"
)

// Reply 回复消息结构
type Reply struct {
	ID        string `json:"id"`
	Channel   string `json:"channel"`
	RoomID    string `json:"room_id"`
	UserID    string `json:"user_id"`
	Content   string `json:"content"`
	Type      string `json:"type"` // text, image, video
	Timestamp int64  `json:"timestamp"`
}

// NewReply 创建新的回复
func NewReply(channel, roomID, userID, content string) *Reply {
	return &Reply{
		ID:        fmt.Sprintf("reply_%d", time.Now().UnixNano()),
		Channel:   channel,
		RoomID:    roomID,
		UserID:    userID,
		Content:   content,
		Type:      "text",
		Timestamp: time.Now().Unix(),
	}
}

// Send 发送回复
func (r *Reply) Send() error {
	log.Printf("📤 发送回复: %s -> %s (%s)", r.Channel, r.UserID, r.Content)
	
	// 这里应该调用对应渠道的API发送消息
	// 目前只是模拟发送
	return nil
}

// ToJSON 转换为JSON
func (r *Reply) ToJSON() ([]byte, error) {
	return json.Marshal(r)
}

// FromJSON 从JSON解析
func FromJSON(data []byte) (*Reply, error) {
	var reply Reply
	err := json.Unmarshal(data, &reply)
	return &reply, err
}
