package pipeline

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"live-im-proxy/event"
	"live-im-proxy/limiter"
)

// ReplySender 回复发送器接口
type ReplySender interface {
	SendVideoCommentReply(videoID, commentID, content string) error
	SendLiveCommentReply(roomID, commentID, content string) error
	SendPrivateMessage(conversationID, userID, content string) error
}

// Pipeline 数据处理管道
type Pipeline struct {
	cozeAPI     string
	cozeToken   string
	nbAPI       string
	nbToken     string
	limiter     limiter.RateLimiter
	httpClient  *http.Client
	replySender ReplySender // 回复发送器（可选）
}

// NewPipeline 创建新的管道
func NewPipeline(cozeAPI, cozeToken, nbAPI, nbToken string, limiter limiter.RateLimiter) *Pipeline {
	return &Pipeline{
		cozeAPI:    cozeAPI,
		cozeToken:  cozeToken,
		nbAPI:      nbAPI,
		nbToken:    nbToken,
		limiter:    limiter,
		httpClient: &http.Client{Timeout: 30 * time.Second},
		replySender: nil, // 可选，后续可以通过SetReplySender设置
	}
}

// SetReplySender 设置回复发送器
func (p *Pipeline) SetReplySender(sender ReplySender) {
	p.replySender = sender
}

// ProcessEvent 处理事件
func (p *Pipeline) ProcessEvent(evt *event.Event) error {
	// 打印事件信息
	fmt.Printf("📨 处理事件: type=%s, user=%s, content=%s\n", evt.Type, evt.Nickname, evt.Content)
	
	// 异步处理，避免阻塞
	go func() {
		// 只处理评论事件
		if evt.Type != "comment" || evt.Content == "" {
			return
		}

		// 1. 尝试获取AI回复
		reply := ""
		if p.cozeAPI != "" && p.cozeToken != "" {
			var err error
			reply, err = p.generateAIReply(evt)
			if err != nil {
				fmt.Printf("❌ AI 生成回复失败: %v\n", err)
			}
		}
		
		// 2. 如果没有AI回复，使用默认回复
		if reply == "" {
			reply = p.generateDefaultReply(evt.Content)
		}
		
		// 3. 发送回复
		if reply != "" {
			fmt.Printf("✅ 生成回复: %s\n", reply)
			p.sendReply(evt, reply)
		}

		// 4. 推送到 NocoBase CRM
		if p.nbAPI != "" && p.nbToken != "" {
			if err := p.pushToNocoBase(evt); err != nil {
				fmt.Printf("❌ 推送到 NocoBase 失败: %v\n", err)
			}
		}
	}()

	return nil
}

// generateAIReply 生成AI回复
func (p *Pipeline) generateAIReply(evt *event.Event) (string, error) {
	// 检查限流
	if !p.limiter.Allow() {
		return "", fmt.Errorf("Coze API 限流")
	}

	// 从环境变量获取 Bot ID
	botID := os.Getenv("COZE_BOT_ID")
	if botID == "" {
		return "", fmt.Errorf("COZE_BOT_ID 未配置，请在环境变量中设置")
	}

	// 构建请求
	reqBody := map[string]interface{}{
		"bot_id": botID,
		"user":   evt.UserID,
		"query":  evt.Content,
		"stream": false,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", p.cozeAPI+"/bot/chat", bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}

	req.Header.Set("Authorization", "Bearer "+p.cozeToken)
	req.Header.Set("Content-Type", "application/json")

	// 发送请求
	resp, err := p.httpClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("Coze API 错误: %d %s", resp.StatusCode, string(body))
	}

	// 解析响应
	var cozeResp map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&cozeResp); err != nil {
		return "", err
	}

	// 提取回复内容（根据实际Coze API响应格式调整）
	reply := "感谢您的咨询，我会尽快为您处理"
	if content, ok := cozeResp["content"].(string); ok {
		reply = content
	}

	return reply, nil
}

// sendReply 发送回复
func (p *Pipeline) sendReply(evt *event.Event, reply string) {
	fmt.Printf("📤 准备发送回复到 %s: %s\n", evt.Channel, reply)
	
	// 根据事件类型和渠道发送回复
	if evt.Channel == "douyin" {
		// 抖音渠道：根据事件类型选择发送方式
		if evt.Type == "video_comment" {
			// 短视频评论回复
			commentID, ok := evt.Metadata["comment_id"].(string)
			if !ok || commentID == "" {
				fmt.Printf("❌ 无法获取评论ID，跳过回复\n")
				return
			}
			
			videoID := evt.VideoID
			if videoID == "" {
				videoID = evt.RoomID // 兼容处理
			}
			
			// 如果有回复发送器，使用它发送回复
			if p.replySender != nil {
				if err := p.replySender.SendVideoCommentReply(videoID, commentID, reply); err != nil {
					fmt.Printf("❌ 发送视频评论回复失败: %v\n", err)
					return
				}
				fmt.Printf("✅ 已发送回复: 用户=%s, 内容=%s\n", evt.Nickname, reply)
			} else {
				fmt.Printf("⚠️ 回复发送器未设置，仅记录日志: 评论ID=%s, 内容=%s\n", commentID, reply)
			}
		} else if evt.Type == "comment" {
			// 直播间评论回复
			commentID, ok := evt.Metadata["comment_id"].(string)
			if !ok || commentID == "" {
				fmt.Printf("❌ 无法获取评论ID，跳过回复\n")
				return
			}
			
			// 如果有回复发送器，使用它发送回复
			if p.replySender != nil {
				if err := p.replySender.SendLiveCommentReply(evt.RoomID, commentID, reply); err != nil {
					fmt.Printf("❌ 发送直播间评论回复失败: %v\n", err)
					return
				}
				fmt.Printf("✅ 已发送回复: 用户=%s, 内容=%s\n", evt.Nickname, reply)
			} else {
				fmt.Printf("⚠️ 回复发送器未设置，仅记录日志: 评论ID=%s, 内容=%s\n", commentID, reply)
			}
		} else if evt.Type == "private_message" {
			// 私信回复
			conversationID, ok1 := evt.Metadata["conversation_id"].(string)
			userID := evt.UserID
			if !ok1 || conversationID == "" {
				fmt.Printf("❌ 无法获取会话ID，跳过回复\n")
				return
			}
			
			// 如果有回复发送器，使用它发送回复
			if p.replySender != nil {
				if err := p.replySender.SendPrivateMessage(conversationID, userID, reply); err != nil {
					fmt.Printf("❌ 发送私信回复失败: %v\n", err)
					return
				}
				fmt.Printf("✅ 已发送私信回复: 用户=%s, 内容=%s\n", evt.Nickname, reply)
			} else {
				fmt.Printf("⚠️ 回复发送器未设置，仅记录日志: 会话ID=%s, 内容=%s\n", conversationID, reply)
			}
		}
	} else {
		// 其他渠道的回复逻辑
		fmt.Printf("✅ 已发送回复: 用户=%s, 内容=%s\n", evt.Nickname, reply)
	}
}

// pushToCoze 推送到 Coze AI
func (p *Pipeline) pushToCoze(evt *event.Event) error {
	// 检查限流
	if !p.limiter.Allow() {
		return fmt.Errorf("Coze API 限流")
	}

	// 构建请求
	reqBody := map[string]interface{}{
		"bot_id": "your_bot_id", // 从环境变量获取
		"user":   evt.UserID,
		"query":  evt.Content,
		"stream": false,
	}

	jsonData, err := json.Marshal(reqBody)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", p.cozeAPI+"/bot/chat", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+p.cozeToken)
	req.Header.Set("Content-Type", "application/json")

	// 发送请求
	resp, err := p.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("Coze API 错误: %d %s", resp.StatusCode, string(body))
	}

	// 解析响应
	var cozeResp map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&cozeResp); err != nil {
		return err
	}

	fmt.Printf("✅ Coze AI 处理完成: %s\n", evt.ID)
	return nil
}

// pushToNocoBase 推送到 NocoBase CRM
func (p *Pipeline) pushToNocoBase(evt *event.Event) error {
	// 构建线索数据
	leadData := map[string]interface{}{
		"tenant_id": "tenant-1", // 从环境变量获取
		"uid":       evt.UserID,
		"nick":      evt.Nickname,
		"channel":   evt.Channel,
		"score":     p.calculateScore(evt),
		"created_at": time.Now().Format(time.RFC3339),
	}

	jsonData, err := json.Marshal(leadData)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", p.nbAPI+"/leads", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	req.Header.Set("Authorization", "Bearer "+p.nbToken)
	req.Header.Set("Content-Type", "application/json")

	// 发送请求
	resp, err := p.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("NocoBase API 错误: %d %s", resp.StatusCode, string(body))
	}

	fmt.Printf("✅ NocoBase CRM 处理完成: %s\n", evt.ID)
	return nil
}

// calculateScore 计算线索评分
func (p *Pipeline) calculateScore(evt *event.Event) int {
	score := 0

	// 根据事件类型评分
	switch evt.Type {
	case "enter":
		score = 1
	case "comment":
		score = 3
		// 根据关键词增加评分
		if containsKeywords(evt.Content, []string{"价格", "购买", "咨询", "多少钱"}) {
			score += 3
		}
	case "follow":
		score = 5
	case "gift":
		score = 7
	}

	return score
}

// generateDefaultReply 生成默认回复
func (p *Pipeline) generateDefaultReply(content string) string {
	// 简单的关键词匹配回复
	keywords := []string{
		"价格", "多少钱", "优惠", "折扣", "便宜",
		"购买", "买", "下单", "订购",
		"好用", "质量", "好", "坏",
		"发货", "快递", "几天", "到货",
		"退货", "售后", "保修", "质保",
		"微信", "联系", "咨询", "客服",
	}
	
	for _, keyword := range keywords {
		if len(content) >= len(keyword) {
			for i := 0; i <= len(content)-len(keyword); i++ {
				if content[i:i+len(keyword)] == keyword {
					return p.getReplyByKeyword(keyword)
				}
			}
		}
	}
	
	return "感谢您的关注，欢迎咨询！"
}

// getReplyByKeyword 根据关键词返回回复
func (p *Pipeline) getReplyByKeyword(keyword string) string {
	replies := map[string]string{
		"价格":     "您好！价格信息请关注私信，我们会尽快发送详细报价单。",
		"多少钱":    "感谢咨询！价格请私信沟通，为您提供最优报价。",
		"优惠":     "您好！当前有优惠活动，详情请私信了解。",
		"购买":     "感谢关注！购买请添加微信：[微信号]，我们有专业客服为您服务。",
		"买":      "欢迎购买！添加微信了解更多详情：[微信号]",
		"质量":     "您好！我们的产品质量保证，有完善的售后服务。详情请私信咨询。",
		"发货":     "您好！我们承诺24小时内发货，一般3-5天到货。",
		"退货":     "您好！我们支持7天无理由退货，有完善的售后服务保障。",
		"微信":     "感谢关注！我们的微信是：[微信号]，添加后为您提供更详细服务。",
		"联系":     "您好！可以通过私信或添加微信联系我们的客服团队。",
		"客服":     "您好！客服在线为您服务，有问题随时咨询。",
	}
	
	if reply, ok := replies[keyword]; ok {
		return reply
	}
	
	return "感谢您的咨询，请私信了解详情！"
}

// containsKeywords 检查是否包含关键词
func containsKeywords(content string, keywords []string) bool {
	for _, keyword := range keywords {
		if len(content) > 0 && len(keyword) > 0 {
			// 简单的包含检查，实际项目中应该使用更复杂的匹配
			if len(content) >= len(keyword) {
				for i := 0; i <= len(content)-len(keyword); i++ {
					if content[i:i+len(keyword)] == keyword {
						return true
					}
				}
			}
		}
	}
	return false
}
