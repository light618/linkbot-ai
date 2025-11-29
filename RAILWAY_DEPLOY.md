# Railway 部署指南

## 📦 项目结构

**两个代码库，三个服务：**

1. **linkbot-ai 仓库** - 包含两个服务：
   - **Go 代理服务** (`/`) - 渠道消息监听和转发，监听 8080 端口
   - **Node.js 后端 API** (`/backend`) - 业务逻辑和数据库操作，监听 3001 端口

2. **linkbot-ai-frontend 仓库** - 包含一个服务：
   - **React 前端** (`/`) - 用户界面

**为什么不能合并？**
- Go 服务和 Node.js 后端使用不同的技术栈（Go vs Node.js）
- 需要不同的构建和启动命令
- 监听不同的端口（8080 vs 3001）
- Node.js 后端通过 HTTP 调用 Go 服务（通过 `PROXY_URL` 环境变量）

## 🚀 部署步骤

### 1. 部署 Go 代理服务（从 linkbot-ai 仓库）

#### 1.1 在 Railway 创建新项目
- 登录 [Railway](https://railway.app)
- 点击 "New Project"
- 选择 "Deploy from GitHub repo"
- 选择 `light618/linkbot-ai` 仓库
- **根目录选择：** `/`（根目录，这是第一个服务）

#### 1.2 配置环境变量
在 Railway 项目设置中添加以下环境变量：

```bash
# 服务端口（Railway 会自动设置 PORT，无需手动配置）
PORT=8080

# 抖音开放平台配置
DOUYIN_APP_ID=your_douyin_app_id
DOUYIN_APP_SECRET=your_douyin_app_secret
REDIRECT_URI=https://your-go-service.railway.app/oauth/callback

# Coze AI 配置
COZE_API=https://api.coze.com/open/v1
COZE_TOKEN=your_coze_token

# 其他配置
NB_API=your_nb_api
NB_TOKEN=your_nb_token
REDIS_URL=redis://your-redis-url:6379
```

#### 1.3 配置构建和启动命令
Railway 会自动检测 Go 项目，使用 `railway.json` 配置。

**重要：** 确保 `REDIRECT_URI` 设置为 Railway 分配的公网地址：
```
https://your-go-service.railway.app/oauth/callback
```

### 2. 部署 Node.js 后端 API（从 linkbot-ai 仓库）

#### 2.1 在同一个项目中创建第二个服务
- 在刚才创建的 Railway 项目中，点击 "New Service"
- 选择 "Deploy from GitHub repo"
- 选择 `light618/linkbot-ai` 仓库（**同一个仓库**）
- **根目录选择：** `backend/`（这是第二个服务）

#### 2.2 配置环境变量
```bash
# API 端口
API_PORT=3001

# CORS 配置（前端地址）
CORS_ORIGIN=https://your-frontend.railway.app

# 数据库配置
DB_HOST=your_db_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=linkbot_ai

# Redis 配置
REDIS_URL=redis://your-redis-url:6379

# JWT 密钥
JWT_SECRET=your_jwt_secret

# Go 服务地址（用于调用 Go 代理服务）
PROXY_URL=https://your-go-service.railway.app
```

#### 2.3 配置构建命令
Railway 会自动检测 Node.js 项目，使用 `backend/railway.json` 配置。

### 3. 部署 React 前端（从 linkbot-ai-frontend 仓库）

#### 3.1 创建新项目或新服务
**选项 A：** 在同一个 Railway 项目中创建第三个服务
- 在 Railway 项目中，点击 "New Service"
- 选择 "Deploy from GitHub repo"
- 选择 `light618/linkbot-ai-frontend` 仓库（**不同的仓库**）

**选项 B：** 创建新的 Railway 项目（推荐）
- 点击 "New Project"
- 选择 "Deploy from GitHub repo"
- 选择 `light618/linkbot-ai-frontend` 仓库

#### 3.2 配置环境变量
```bash
# API 地址（后端 API 地址）
REACT_APP_API_URL=https://your-backend.railway.app

# WebSocket 地址（Go 服务地址）
REACT_APP_WS_URL=wss://your-go-service.railway.app
```

#### 3.3 配置构建命令
Railway 会自动检测 React 项目，使用 `railway.json` 配置。

**注意：** 前端需要安装 `serve` 包来提供静态文件服务：
```json
{
  "scripts": {
    "start": "serve -s build -l $PORT"
  },
  "dependencies": {
    "serve": "^14.2.0"
  }
}
```

## 🔗 配置抖音回调地址

### 1. 获取 Railway 公网地址

部署完成后，Railway 会为每个服务分配一个公网地址，格式如下：
```
https://your-service-name.up.railway.app
```

### 2. 配置抖音开放平台回调地址

1. 登录 [抖音开放平台](https://open.douyin.com/)
2. 进入你的应用管理页面
3. 找到 **"授权回调地址"** 或 **"Redirect URI"** 配置项
4. 填写 Go 服务的回调地址：
   ```
   https://your-go-service.railway.app/oauth/callback
   ```
5. 保存配置

### 3. 更新环境变量

确保 Go 服务的 `REDIRECT_URI` 环境变量与抖音后台配置的回调地址完全一致：

```bash
REDIRECT_URI=https://your-go-service.railway.app/oauth/callback
```

### 4. 验证配置

1. 访问前端页面：`https://your-frontend.railway.app`
2. 进入抖音渠道页面
3. 点击"授权登录"按钮
4. 应该能正常跳转到抖音授权页面
5. 授权成功后应该能正确回调到你的服务

## 🔍 常见问题

### Q1: 回调地址不匹配
**错误信息：** `redirect_uri_mismatch`

**解决方案：**
- 确保抖音后台配置的回调地址与 `REDIRECT_URI` 环境变量完全一致
- 注意协议（http/https）和路径（/oauth/callback）都要匹配
- 不要有多余的斜杠或空格

### Q2: CORS 错误
**错误信息：** `Access-Control-Allow-Origin`

**解决方案：**
- 检查后端 API 的 `CORS_ORIGIN` 环境变量
- 确保包含前端地址（协议、域名、端口都要匹配）

### Q3: 服务无法启动
**错误信息：** `Port already in use`

**解决方案：**
- Railway 会自动设置 `PORT` 环境变量
- 确保代码中使用 `process.env.PORT` 或 `os.Getenv("PORT")`
- 不要硬编码端口号

### Q4: 数据库连接失败
**解决方案：**
- 在 Railway 中创建 MySQL 数据库服务
- 使用 Railway 提供的连接字符串
- 确保数据库服务已启动

### Q5: Redis 连接失败
**解决方案：**
- 在 Railway 中创建 Redis 服务
- 使用 Railway 提供的连接字符串
- 确保 Redis 服务已启动

## 📝 部署检查清单

- [ ] Go 服务已部署并运行
- [ ] Node.js 后端 API 已部署并运行
- [ ] React 前端已部署并运行
- [ ] 所有环境变量已正确配置
- [ ] 抖音回调地址已在抖音后台配置
- [ ] `REDIRECT_URI` 与抖音后台配置一致
- [ ] 数据库连接正常
- [ ] Redis 连接正常
- [ ] 前端可以访问后端 API
- [ ] 授权流程可以正常完成

## 🔄 更新部署

当代码更新后，Railway 会自动检测并重新部署。你也可以：

1. 在 Railway 控制台点击 "Redeploy"
2. 或者推送代码到 GitHub，Railway 会自动触发部署

## 📞 技术支持

如遇到问题，请检查：
1. Railway 服务日志
2. 环境变量配置
3. 抖音开放平台配置
4. 网络连接状态

