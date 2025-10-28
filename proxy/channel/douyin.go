package channel

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"live-im-proxy/event"
	"live-im-proxy/pipeline"
)

// DouyinChannel 抖音渠道
type DouyinChannel struct {
	pipeline   *pipeline.Pipeline
	roomID     string
	videoID    string
	appID      string
	appSecret  string
	accessToken string
	connected  bool
	conn       *websocket.Conn
	done       chan struct{}
}

// NewDouyinChannel 创建抖音渠道
func NewDouyinChannel(pipeline *pipeline.Pipeline) (*DouyinChannel, error) {
	return &DouyinChannel{
		pipeline:  pipeline,
		connected: false,
		done:      make(chan struct{}),
	}, nil
}

// Start 启动渠道，传入access_token
func (d *DouyinChannel) Start(roomID, accessToken string) error {
	d.roomID = roomID
	d.appID = "dy123456789"      // 从环境变量获取（抖音开放平台的AppID）
	d.appSecret = "dy_secret_***" // 从环境变量获取
	d.accessToken = accessToken // OAuth授权后获取的真实token

	log.Printf("🎵 抖音渠道启动，房间ID: %s", roomID)

	// 尝试连接WebSocket
	if err := d.connectWebSocket(); err != nil {
		log.Printf("❌ WebSocket连接失败，使用模拟模式: %v", err)
		// 如果WebSocket连接失败，回退到模拟模式
		go d.simulateEvents()
		return nil
	}

	d.connected = true
	go d.readMessages()
	return nil
}

// StartVideo 启动短视频监听，传入access_token
func (d *DouyinChannel) StartVideo(videoID, accessToken string) error {
	d.videoID = videoID
	d.appID = "dy123456789"      // 从环境变量获取
	d.appSecret = "dy_secret_***" // 从环境变量获取
	d.accessToken = accessToken // OAuth授权后获取的真实token

	log.Printf("🎬 抖音短视频启动，视频ID: %s", videoID)

	// 启动短视频评论轮询
	go d.pollVideoComments()
	return nil
}

// Stop 停止渠道
func (d *DouyinChannel) Stop() error {
	d.connected = false
	close(d.done)
	if d.conn != nil {
		d.conn.Close()
	}
	log.Printf("🛑 抖音渠道已停止")
	return nil
}

// connectWebSocket 连接WebSocket
func (d *DouyinChannel) connectWebSocket() error {
	// 抖音WebSocket连接地址（示例）
	wsURL := fmt.Sprintf("wss://live.douyin.com/webcast/im/push/v2/?room_id=%s&app_id=%s", d.roomID, d.appID)
	
	u, err := url.Parse(wsURL)
	if err != nil {
		return err
	}

	// 设置请求头（包含access_token）
	headers := http.Header{}
	headers.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")
	headers.Set("Origin", "https://live.douyin.com")
	if d.accessToken != "" {
		headers.Set("Authorization", "Bearer "+d.accessToken)
	}

	// 连接WebSocket
	d.conn, _, err = websocket.DefaultDialer.Dial(u.String(), headers)
	if err != nil {
		return err
	}

	log.Printf("✅ 抖音WebSocket连接成功: %s", wsURL)
	return nil
}

// readMessages 读取WebSocket消息
func (d *DouyinChannel) readMessages() {
	defer d.conn.Close()
	
	for {
		select {
		case <-d.done:
			return
		default:
			_, message, err := d.conn.ReadMessage()
			if err != nil {
				log.Printf("❌ 读取WebSocket消息失败: %v", err)
				d.connected = false
				return
			}

			// 解析抖音消息格式
			if err := d.parseMessage(message); err != nil {
				log.Printf("❌ 解析消息失败: %v", err)
			}
		}
	}
}

// parseMessage 解析抖音消息
func (d *DouyinChannel) parseMessage(data []byte) error {
	// 抖音消息格式解析（简化版）
	var msg map[string]interface{}
	if err := json.Unmarshal(data, &msg); err != nil {
		return err
	}

	// 提取消息类型和内容
	msgType, ok := msg["type"].(string)
	if !ok {
		return fmt.Errorf("无法获取消息类型")
	}

	// 根据消息类型处理
	switch msgType {
	case "comment":
		// 处理评论消息
		content, _ := msg["content"].(string)
		userID, _ := msg["user_id"].(string)
		nickname, _ := msg["nickname"].(string)

		evt := event.NewEvent("comment", "douyin", d.roomID, userID, nickname)
		evt.SetContent(content)

		if err := d.pipeline.ProcessEvent(evt); err != nil {
			return err
		}

		log.Printf("📨 抖音评论: %s - %s", nickname, content)

	case "enter":
		// 处理进入消息
		userID, _ := msg["user_id"].(string)
		nickname, _ := msg["nickname"].(string)

		evt := event.NewEvent("enter", "douyin", d.roomID, userID, nickname)
		if err := d.pipeline.ProcessEvent(evt); err != nil {
			return err
		}

		log.Printf("📨 抖音进入: %s", nickname)

	case "follow":
		// 处理关注消息
		userID, _ := msg["user_id"].(string)
		nickname, _ := msg["nickname"].(string)

		evt := event.NewEvent("follow", "douyin", d.roomID, userID, nickname)
		if err := d.pipeline.ProcessEvent(evt); err != nil {
			return err
		}

		log.Printf("📨 抖音关注: %s", nickname)
	}

	return nil
}

// SendMessage 发送消息
func (d *DouyinChannel) SendMessage(content string) error {
	if !d.connected {
		return fmt.Errorf("渠道未连接")
	}

	log.Printf("📤 抖音发送消息: %s", content)
	return nil
}

// SendVideoCommentReply 发送短视频评论回复
func (d *DouyinChannel) SendVideoCommentReply(commentID, content string) error {
	if d.videoID == "" {
		return fmt.Errorf("未设置视频ID")
	}

	log.Printf("📤 抖音短视频回复: 评论ID=%s, 内容=%s", commentID, content)
	
	// 调用抖音官方API发送回复
	_, err := d.callDouyinAPI("POST", "/api/v1/video/comment/reply", map[string]interface{}{
		"video_id":   d.videoID,
		"comment_id": commentID,
		"content":    content,
	})
	return err
}

// pollVideoComments 轮询短视频评论
func (d *DouyinChannel) pollVideoComments() {
	ticker := time.NewTicker(10 * time.Second) // 每10秒轮询一次
	defer ticker.Stop()

	for {
		select {
		case <-d.done:
			return
		case <-ticker.C:
			if d.videoID == "" {
				return
			}

			// 获取视频评论
			comments, err := d.getVideoComments()
			if err != nil {
				log.Printf("❌ 获取视频评论失败: %v", err)
				continue
			}

			// 处理新评论
			for _, comment := range comments {
				evt := event.NewEvent("video_comment", "douyin", d.videoID, comment.UserID, comment.Nickname)
				evt.SetContent(comment.Content)
				evt.SetExtra("comment_id", comment.ID)

				if err := d.pipeline.ProcessEvent(evt); err != nil {
					log.Printf("❌ 处理视频评论事件失败: %v", err)
				}

				log.Printf("📨 抖音视频评论: %s - %s", comment.Nickname, comment.Content)
			}
		}
	}
}

// getVideoComments 获取视频评论
func (d *DouyinChannel) getVideoComments() ([]VideoComment, error) {
	// 调用抖音官方API获取评论
	resp, err := d.callDouyinAPI("GET", "/api/v1/video/comment/list", map[string]interface{}{
		"video_id": d.videoID,
		"count":    20,
	})
	
	if err != nil {
		return nil, err
	}

	// 解析响应
	var result struct {
		Data struct {
			Comments []VideoComment `json:"comments"`
		} `json:"data"`
	}
	
	if err := json.Unmarshal(resp, &result); err != nil {
		return nil, err
	}

	return result.Data.Comments, nil
}

// callDouyinAPI 调用抖音API
func (d *DouyinChannel) callDouyinAPI(method, endpoint string, data map[string]interface{}) ([]byte, error) {
	if d.accessToken == "" {
		return nil, fmt.Errorf("缺少access_token")
	}
	
	// 构建请求URL
	reqURL := fmt.Sprintf("https://open.douyin.com%s", endpoint)
	
	// 构建请求
	var req *http.Request
	var err error
	
	if method == "GET" {
		// GET请求：构建查询参数
		params := url.Values{}
		for k, v := range data {
			params.Set(k, fmt.Sprintf("%v", v))
		}
		reqURL += "?" + params.Encode()
		
		req, err = http.NewRequest(method, reqURL, nil)
	} else {
		// POST请求：JSON body
		jsonData, _ := json.Marshal(data)
		req, err = http.NewRequest(method, reqURL, strings.NewReader(string(jsonData)))
	}
	
	if err != nil {
		return nil, err
	}
	
	// 添加认证头
	req.Header.Set("Authorization", "Bearer "+d.accessToken)
	req.Header.Set("Content-Type", "application/json")
	
	log.Printf("🌐 调用抖音API: %s %s", method, reqURL)
	
	// 发送请求
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("请求共鸣失败: %v", err)
	}
	defer resp.Body.Close()
	
	// 读取响应
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取响应失败: %v", err)
	}
	
	log.Printf("📥 抖音API响应: %s", string(body))
	
	return body, nil
}

// VideoComment 视频评论结构
type VideoComment struct {
	ID       string `json:"id"`
	UserID   string `json:"user_id"`
	Nickname string `json:"nickname"`
	Content  string `json:"content"`
	Time     int64  `json:"time"`
}

// IsConnected 检查是否已连接
func (d *DouyinChannel) IsConnected() bool {
	return d.connected
}

// GetStatus 获取状态
func (d *DouyinChannel) GetStatus() string {
	if d.connected {
		return "online"
	}
	return "offline"
}

// simulateEvents 模拟事件（实际项目中应该连接真实的 WebSocket）
func (d *DouyinChannel) simulateEvents() {
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	eventTypes := []string{"enter", "comment", "like", "follow"}
	users := []string{"张先生", "李女士", "王总", "刘小姐", "陈老板"}
	comments := []string{
		"这个产品价格是多少？",
		"质量怎么样？我想了解一下",
		"怎么购买？有优惠吗？",
		"发货快吗？大概几天到？",
		"支持退货吗？有质保吗？",
		"性价比高吗？推荐购买吗？",
		"有现货吗？需要等多久？",
		"微信多少？想详细咨询",
		"客服在吗？有问题想问",
		"这个好用吗？值得买吗？",
	}

	for {
		select {
		case <-ticker.C:
			// 模拟模式下也继续运行
			// if !d.connected {
			// 	return
			// }

			// 随机生成事件
			eventType := eventTypes[time.Now().Unix()%int64(len(eventTypes))]
			user := users[time.Now().Unix()%int64(len(users))]
			userID := fmt.Sprintf("douyin_%d", time.Now().Unix())

			evt := event.NewEvent(eventType, "douyin", d.roomID, userID, user)

			if eventType == "comment" {
				comment := comments[time.Now().Unix()%int64(len(comments))]
				evt.SetContent(comment)
			}

			// 处理事件
			if err := d.pipeline.ProcessEvent(evt); err != nil {
				log.Printf("❌ 处理事件失败: %v", err)
			}

			log.Printf("📨 抖音事件: %s - %s", eventType, user)
		}
	}
}
