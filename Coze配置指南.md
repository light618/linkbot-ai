# Coze AI 配置指南

## 📋 需要配置的信息

主公，您需要在 Coze 平台创建以下内容：

### 1. Coze 账号和 API Token

**步骤：**
1. 访问 [Coze 开放平台](https://www.coze.com/open)
2. 注册/登录账号
3. 进入「开发者中心」→「API密钥」
4. 创建新的 API Token（类似：`pat_xxxxxxxxxxxxx`）

### 2. 创建 Coze Bot（机器人）

**步骤：**
1. 访问 [Coze 工作台](https://www.coze.com/)
2. 点击「创建 Bot」
3. 配置 Bot 信息：
   - **名称**：智能客服机器人（或自定义）
   - **描述**：用于抖音智能客服自动回复
   - **模型**：选择 GPT-4o（推荐）或 GPT-3.5
4. 配置 Bot 能力：
   - 添加「知识库」（可选，用于FAQ）
   - 添加「插件」（可选，用于扩展功能）
   - 配置「提示词」：
     ```
     你是一个专业的智能客服助手，负责回复抖音直播间和私信的客户咨询。
     要求：
     1. 回复要友好、专业、简洁
     2. 针对客户问题给出准确回答
     3. 如果无法回答，引导客户联系人工客服
     4. 回复长度控制在50字以内
     ```
5. 保存并发布 Bot
6. **重要**：复制 Bot ID（类似：`1234567890123456789`）

## 🔧 环境变量配置

### Go 服务配置（`linkbot-ai/.env`）

在 `.env` 文件中添加：

```bash
# Coze API 配置
COZE_API=https://api.coze.com/open/v1
COZE_TOKEN=pat_你的API_Token
COZE_BOT_ID=你的Bot_ID
```

### 后端 API 配置（`linkbot-ai/backend/.env`）

在 `backend/.env` 文件中添加：

```bash
# Coze API 配置
COZE_API_URL=https://api.coze.com/open/v1
COZE_TOKEN=pat_你的API_Token
COZE_BOT_ID=你的Bot_ID
```

## 📝 代码修改

### 1. 修改 Go 服务中的 Bot ID

**文件**：`linkbot-ai/pipeline/pipeline.go`

**位置**：第 104 行

**修改前**：
```go
reqBody := map[string]interface{}{
    "bot_id": "your_bot_id", // 从环境变量获取
    ...
}
```

**修改后**：
```go
botID := getEnv("COZE_BOT_ID", "")
if botID == "" {
    return "", fmt.Errorf("COZE_BOT_ID 未配置")
}

reqBody := map[string]interface{}{
    "bot_id": botID,
    ...
}
```

需要添加 `getEnv` 函数或从配置中读取。

### 2. 修改后端 API 中的配置

**文件**：`linkbot-ai/backend/src/routes/ai.ts`

**位置**：第 171 行

**当前代码**：
```typescript
bot_id: process.env.COZE_BOT_ID,
```

这个已经正确，只需要确保环境变量已配置。

## 🚀 快速开始

### 方案一：使用 Coze（推荐）

1. **注册 Coze 账号**
   - 访问：https://www.coze.com/
   - 使用手机号或邮箱注册

2. **创建 API Token**
   - 访问：https://www.coze.com/open
   - 开发者中心 → API密钥 → 创建密钥
   - 复制 Token（格式：`pat_xxxxxxxxxxxxx`）

3. **创建 Bot**
   - 在工作台创建新 Bot
   - 配置提示词和知识库
   - 复制 Bot ID

4. **配置环境变量**
   ```bash
   # Go 服务
   cd /Users/yiche/linkbot-ai
   echo "COZE_API=https://api.coze.com/open/v1" >> .env
   echo "COZE_TOKEN=pat_你的Token" >> .env
   echo "COZE_BOT_ID=你的Bot_ID" >> .env
   
   # 后端 API
   cd /Users/yiche/linkbot-ai/backend
   echo "COZE_API_URL=https://api.coze.com/open/v1" >> .env
   echo "COZE_TOKEN=pat_你的Token" >> .env
   echo "COZE_BOT_ID=你的Bot_ID" >> .env
   ```

### 方案二：使用 OpenAI（备选）

如果不想使用 Coze，也可以直接使用 OpenAI API：

1. **获取 OpenAI API Key**
   - 访问：https://platform.openai.com/api-keys
   - 创建新的 API Key

2. **配置环境变量**
   ```bash
   OPENAI_API_KEY=sk-你的API_Key
   OPENAI_MODEL=gpt-4o
   ```

3. **修改代码使用 OpenAI**
   - 需要修改 `pipeline/pipeline.go` 中的 `generateAIReply` 方法

## ✅ 验证配置

配置完成后，可以通过以下方式验证：

1. **检查环境变量**
   ```bash
   cd /Users/yiche/linkbot-ai
   cat .env | grep COZE
   ```

2. **测试 Coze API**
   ```bash
   curl -X POST https://api.coze.com/open/v1/bot/chat \
     -H "Authorization: Bearer pat_你的Token" \
     -H "Content-Type: application/json" \
     -d '{
       "bot_id": "你的Bot_ID",
       "user": "test_user",
       "query": "你好",
       "stream": false
     }'
   ```

## 📚 Coze API 文档

- 官方文档：https://www.coze.com/open/docs
- API 参考：https://www.coze.com/open/docs/api-reference

## ⚠️ 注意事项

1. **API 限流**：Coze 有调用频率限制，代码中已实现限流（10 QPS）
2. **费用**：Coze 按调用次数计费，注意控制成本
3. **Bot ID**：每个 Bot 都有独立的 ID，不要混淆
4. **Token 安全**：不要将 Token 提交到代码仓库

## 🎯 推荐配置

**智能客服 Bot 提示词模板**：

```
你是一个专业的智能客服助手，负责回复抖音直播间和私信的客户咨询。

你的职责：
1. 友好、专业地回答客户问题
2. 针对产品价格、功能、购买方式等问题给出准确回答
3. 如果无法回答，引导客户联系人工客服或留下联系方式
4. 回复要简洁明了，控制在50字以内
5. 使用亲切的语气，避免生硬的回复

产品信息：
- 产品名称：[你的产品名称]
- 主要功能：[功能描述]
- 价格范围：[价格信息]
- 购买方式：[购买渠道]

请根据客户的问题，给出专业、友好的回复。
```

