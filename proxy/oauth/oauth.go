package oauth

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// DouyinOAuth 抖音OAuth授权
type DouyinOAuth struct {
	AppID       string
	AppSecret   string
	RedirectURI string
	State       string
	Scope       string
}

// DefaultScopes 默认权限范围
var DefaultScopes = []string{"user_info", "video.list", "video.comment"}

// WhitelistScope 白名单权限
var WhitelistScope = []string{"trial.whitelist"}

// OAuthToken OAuth令牌
type OAuthToken struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresIn    int    `json:"expires_in"`
	Scope        string `json:"scope"`
	OpenID       string `json:"open_id"`
	UnionID      string `json:"union_id"`
}

// UserInfo 用户信息
type UserInfo struct {
	OpenID   string `json:"open_id"`
	UnionID  string `json:"union_id"`
	Nickname string `json:"nickname"`
	Avatar   string `json:"avatar"`
}

// NewDouyinOAuth 创建抖音OAuth实例
func NewDouyinOAuth(appID, appSecret, redirectURI string, scopes ...string) *DouyinOAuth {
	scopeStr := "user_info,video.list,video.comment"
	if len(scopes) > 0 {
		scopeStr = scopes[0]
	}
	
	return &DouyinOAuth{
		AppID:       appID,
		AppSecret:   appSecret,
		RedirectURI: redirectURI,
		State:       generateState(),
		Scope:       scopeStr,
	}
}

// GetAuthURL 获取授权URL
func (o *DouyinOAuth) GetAuthURL() string {
	params := url.Values{}
	params.Set("client_key", o.AppID)
	params.Set("response_type", "code")
	
	// 使用配置的scope或默认scope
	scope := o.Scope
	if scope == "" {
		scope = "user_info,video.list,video.comment"
	}
	params.Set("scope", scope)
	params.Set("redirect_uri", o.RedirectURI)
	params.Set("state", o.State)

	authURL := fmt.Sprintf("https://open.douyin.com/platform/oauth/connect?%s", params.Encode())
	log.Printf("🔗 生成抖音授权URL: %s", authURL)
	return authURL
}

// ExchangeCodeForToken 用授权码换取访问令牌
func (o *DouyinOAuth) ExchangeCodeForToken(code string) (*OAuthToken, error) {
	// 构建请求参数
	data := url.Values{}
	data.Set("client_key", o.AppID)
	data.Set("client_secret", o.AppSecret)
	data.Set("code", code)
	data.Set("grant_type", "authorization_code")

	// 发送请求
	resp, err := http.PostForm("https://open.douyin.com/oauth/access_token/", data)
	if err != nil {
		return nil, fmt.Errorf("请求访问令牌失败: %v", err)
	}
	defer resp.Body.Close()

	// 解析响应
	var result struct {
		Data OAuthToken `json:"data"`
		Error struct {
			Code    int    `json:"code"`
			Message string `json:"message"`
		} `json:"error"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("解析响应失败: %v", err)
	}

	if result.Error.Code != 0 {
		return nil, fmt.Errorf("获取访问令牌失败: %s", result.Error.Message)
	}

	// 检查token是否为空
	if result.Data.AccessToken == "" {
		return nil, fmt.Errorf("获取访问令牌失败: token为空，可能是授权码无效")
	}

	log.Printf("✅ 成功获取访问令牌: %s", result.Data.AccessToken)
	return &result.Data, nil
}

// GetUserInfo 获取用户信息
func (o *DouyinOAuth) GetUserInfo(accessToken string) (*UserInfo, error) {
	// 构建请求URL
	reqURL := fmt.Sprintf("https://open.douyin.com/oauth/userinfo/?access_token=%s", accessToken)
	
	log.Printf("🔍 请求用户信息URL: %s", reqURL)

	// 发送请求
	resp, err := http.Get(reqURL)
	if err != nil {
		return nil, fmt.Errorf("请求用户信息失败: %v", err)
	}
	defer resp.Body.Close()
	
	// 读取原始响应以便调试
	body := make([]byte, 4096)
	n, _ := resp.Body.Read(body)
	log.Printf("📥 用户信息API原始响应: %s", string(body[:n]))
	
	// 用读取的body创建一个新的reader
	reader := strings.NewReader(string(body[:n]))
	
	// 解析响应
	var result struct {
		Data    UserInfo `json:"data"`
		ErrNo   int      `json:"err_no"`
		ErrMsg  string   `json:"err_msg"`
		Message string   `json:"message"`
	}

	if err := json.NewDecoder(reader).Decode(&result); err != nil {
		return nil, fmt.Errorf("解析用户信息失败: %v", err)
	}

	if result.ErrNo != 0 {
		return nil, fmt.Errorf("获取用户信息失败: %s (err_no: %d)", result.ErrMsg, result.ErrNo)
	}

	// 检查用户信息是否为空
	if result.Data.OpenID == "" {
		return nil, fmt.Errorf("获取用户信息失败: open_id为空")
	}

	log.Printf("✅ 成功获取用户信息: %s", result.Data.Nickname)
	return &result.Data, nil
}

// RefreshToken 刷新访问令牌
func (o *DouyinOAuth) RefreshToken(refreshToken string) (*OAuthToken, error) {
	// 构建请求参数
	data := url.Values{}
	data.Set("client_key", o.AppID)
	data.Set("client_secret", o.AppSecret)
	data.Set("refresh_token", refreshToken)
	data.Set("grant_type", "refresh_token")

	// 发送请求
	resp, err := http.PostForm("https://open.douyin.com/oauth/refresh_token/", data)
	if err != nil {
		return nil, fmt.Errorf("刷新访问令牌失败: %v", err)
	}
	defer resp.Body.Close()

	// 解析响应
	var result struct {
		Data OAuthToken `json:"data"`
		Error struct {
			Code    int    `json:"code"`
			Message string `json:"message"`
		} `json:"error"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("解析刷新响应失败: %v", err)
	}

	if result.Error.Code != 0 {
		return nil, fmt.Errorf("刷新访问令牌失败: %s", result.Error.Message)
	}

	log.Printf("✅ 成功刷新访问令牌: %s", result.Data.AccessToken)
	return &result.Data, nil
}

// generateState 生成随机状态码
func generateState() string {
	return fmt.Sprintf("state_%d", time.Now().UnixNano())
}
