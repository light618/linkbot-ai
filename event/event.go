package event

import (
	"fmt"
	"time"
)

// Event 表示直播间事件
type Event struct {
	ID        string                 `json:"id"`
	Type      string                 `json:"type"`      // enter, comment, like, gift, follow, video_comment, private_message
	Channel   string                 `json:"channel"`   // douyin, kuaishou, wechat, xiaohongshu
	RoomID    string                 `json:"room_id"`   // 直播间ID
	VideoID   string                 `json:"video_id"`  // 短视频ID
	UserID    string                 `json:"user_id"`
	Nickname  string                 `json:"nickname"`
	Avatar    string                 `json:"avatar,omitempty"`
	Content   string                 `json:"content,omitempty"`
	Timestamp int64                  `json:"timestamp"`
	Metadata  map[string]interface{} `json:"metadata,omitempty"`
}

// NewEvent 创建新事件
func NewEvent(eventType, channel, roomID, userID, nickname string) *Event {
	return &Event{
		ID:        generateID(),
		Type:      eventType,
		Channel:   channel,
		RoomID:    roomID,
		UserID:    userID,
		Nickname:  nickname,
		Timestamp: time.Now().Unix(),
		Metadata:  make(map[string]interface{}),
	}
}

// SetContent 设置内容
func (e *Event) SetContent(content string) {
	e.Content = content
}

// SetAvatar 设置头像
func (e *Event) SetAvatar(avatar string) {
	e.Avatar = avatar
}

// SetMetadata 设置元数据
func (e *Event) SetMetadata(key string, value interface{}) {
	if e.Metadata == nil {
		e.Metadata = make(map[string]interface{})
	}
	e.Metadata[key] = value
}

// SetExtra 设置额外信息（兼容性方法）
func (e *Event) SetExtra(key string, value interface{}) {
	e.SetMetadata(key, value)
}

// SetVideoID 设置视频ID
func (e *Event) SetVideoID(videoID string) {
	e.VideoID = videoID
}

// generateID 生成唯一ID
func generateID() string {
	return fmt.Sprintf("%d", time.Now().UnixNano())
}
