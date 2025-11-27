# 🚨 Railway 502 错误修复指南

## 主公！502 错误诊断与修复方案

### 📊 502 错误的常见原因

1. **Nginx 配置错误**（前端服务）
   - `API_BASE` 或 `WS_BASE` 环境变量未设置
   - `envsubst` 变量注入失败
   - Nginx 配置语法错误

2. **后端服务未启动**
   - Go 服务崩溃
   - 端口配置错误
   - 健康检查失败

3. **环境变量缺失**
   - Railway 中未配置必要的环境变量

---

## ✅ 修复步骤

### 1. **前端服务修复**（已完成）

✅ **已修复 Dockerfile**：
- 添加 `API_BASE` 和 `WS_BASE` 的默认值
- 修正 `envsubst` 命令，明确指定需要替换的变量

**需要在 Railway 前端服务中配置的环境变量：**
```
PORT=3000  # Railway 会自动设置
API_BASE=https://linkbot-ai-production.up.railway.app/api  # 后端 API 地址
WS_BASE=https://linkbot-ai-production.up.railway.app/ws    # WebSocket 地址
```

### 2. **后端服务检查**

**需要在 Railway 后端服务中配置的环境变量：**
```
PORT=8080
DOUYIN_APP_ID=aw6hj204nms0vumu
DOUYIN_APP_SECRET=b46cd587e094aae751e45380f9c0e72d
REDIRECT_URI=https://linkbot-ai-production.up.railway.app/oauth/callback
```

### 3. **Railway 检查清单**

#### 前端服务（linkbot-ai-frontend）
- [ ] **Settings → Build**：
  - Builder: Docker
  - Root Directory: `/`
  - Build Command: 留空（使用 Dockerfile）
  - Start Command: 留空（使用 Dockerfile CMD）

- [ ] **Settings → Variables**：
  ```
  API_BASE=https://linkbot-ai-production.up.railway.app/api
  WS_BASE=https://linkbot-ai-production.up.railway.app/ws
  ```

- [ ] **Settings → Deploy**：
  - Watch Paths: 留空
  - Service Healthcheck: `/` (200 OK)

#### 后端服务（linkbot-ai）
- [ ] **Settings → Build**：
  - Builder: Docker
  - Root Directory: `/`
  - Build Command: 留空
  - Start Command: 留空

- [ ] **Settings → Variables**：
  ```
  PORT=8080
  DOUYIN_APP_ID=aw6hj204nms0vumu
  DOUYIN_APP_SECRET=b46cd587e094aae751e45380f9c0e72d
  REDIRECT_URI=https://linkbot-ai-production.up.railway.app/oauth/callback
  ```

- [ ] **Settings → Deploy**：
  - Service Healthcheck: `/health` (200 OK)

### 4. **清除缓存并重新部署**

1. **清除构建缓存**：
   - Settings → Danger → Clear Build Cache

2. **重新部署**：
   - Deployments → 点击最新部署 → Redeploy

### 5. **检查部署日志**

**前端服务日志检查：**
```bash
# 在 Railway 的 Deploy Logs 中查看：
# ✅ 应该看到：nginx 成功启动
# ❌ 如果看到：envsubst 错误、nginx 配置错误
```

**后端服务日志检查：**
```bash
# 在 Railway 的 Deploy Logs 中查看：
# ✅ 应该看到：🚀 LinkBot-AI 渠道代理服务启动中...
# ✅ 应该看到：📡 端口: 8080
# ❌ 如果看到：panic、端口占用、数据库连接失败
```

---

## 🔍 诊断命令（本地测试）

### 测试前端 Docker 构建
```bash
cd /Users/yiche/linkbot-ai-frontend
docker build -t linkbot-frontend .
docker run -p 3000:3000 \
  -e PORT=3000 \
  -e API_BASE=http://localhost:8080/api \
  -e WS_BASE=http://localhost:8080/ws \
  linkbot-frontend
```

### 测试后端 Docker 构建
```bash
cd /Users/yiche/linkbot-ai
docker build -t linkbot-backend .
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e DOUYIN_APP_ID=aw6hj204nms0vumu \
  -e DOUYIN_APP_SECRET=b46cd587e094aae751e45380f9c0e72d \
  linkbot-backend
```

---

## 📝 修复后的代码更改

### 前端 Dockerfile 修改
```dockerfile
# 修复前：
CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

# 修复后：
CMD ["/bin/sh", "-c", "export API_BASE=${API_BASE:-http://localhost:8080} && export WS_BASE=${WS_BASE:-http://localhost:8080} && envsubst '$$PORT $$API_BASE $$WS_BASE' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
```

---

## 🎯 下一步行动

1. **提交并推送代码更改**
2. **在 Railway 中配置环境变量**
3. **清除缓存并重新部署**
4. **检查部署日志确认服务启动成功**

---

**主公，请按照上述步骤操作，应该能解决 502 问题！** 🚀

