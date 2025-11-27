# Coze 智能体 Bot ID 获取指南

## 📋 关于 Coze 智能体和 Bot ID

主公，在 Coze 平台中：
- **智能体** = **Bot**（同一个东西，只是叫法不同）
- 您创建的"智能体"就是 Bot，它的 ID 就是 Bot ID

## 🔍 如何找到 Bot ID

### 方法一：在智能体详情页查看

1. 登录 [Coze 工作台](https://www.coze.com/)
2. 进入「我的智能体」或「工作台」
3. 找到您创建的智能体，点击进入详情页
4. 在智能体详情页的 URL 中可以看到 Bot ID
   - URL 格式：`https://www.coze.com/space/xxxxx/bot/1234567890123456789`
   - 最后的数字就是 **Bot ID**（通常是19位数字）

### 方法二：在 API 调用中查看

1. 在智能体详情页，点击「发布」或「API」
2. 查看 API 调用示例
3. Bot ID 会在请求参数中显示

### 方法三：通过 API 获取

```bash
curl -X GET "https://api.coze.com/open/v1/bots" \
  -H "Authorization: Bearer pat_jEyz7XHI2Ss3Q5UCmeDEYPcPS5xeMJnK7oFvUjSxMy92hcVKnO4hnyjI4hbGcSbA"
```

这会返回您所有的 Bot 列表，每个 Bot 都有 `id` 字段。

## 🔧 配置 Bot ID

找到 Bot ID 后，添加到环境变量：

```bash
# Go 服务
cd /Users/yiche/linkbot-ai
echo "COZE_BOT_ID=你的Bot_ID" >> .env

# 后端 API
cd /Users/yiche/linkbot-ai/backend
echo "COZE_BOT_ID=你的Bot_ID" >> .env
```

## ⚠️ 注意事项

1. **Bot ID 格式**：通常是19位数字，例如：`1234567890123456789`
2. **智能体必须发布**：只有已发布的智能体才能通过 API 调用
3. **权限检查**：确保 API Token 有权限访问该 Bot

## 🚀 快速测试

配置好 Bot ID 后，可以测试：

```bash
curl -X POST "https://api.coze.com/open/v1/bot/chat" \
  -H "Authorization: Bearer pat_jEyz7XHI2Ss3Q5UCmeDEYPcPS5xeMJnK7oFvUjSxMy92hcVKnO4hnyjI4hbGcSbA" \
  -H "Content-Type: application/json" \
  -d '{
    "bot_id": "你的Bot_ID",
    "user": "test_user",
    "query": "你好",
    "stream": false
  }'
```

如果返回成功，说明 Bot ID 配置正确。

