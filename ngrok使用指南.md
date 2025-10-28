# ngrok 使用指南

## ✅ 方案A 完全可行！

主公，ngrok 是业界标准的测试方案，完全可以使用！

## 🚀 快速使用

### 方法1：命令行直接运行（推荐）

```bash
# 打开新的终端窗口，运行
ngrok http 8080
```

会显示类似：
```
ngrok                                                                        

Session Status                online
Account                       your-email@example.com
Version                       3.32.0
Region                        Asia Pacific (ap)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:8080

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### 方法2：后台运行

```bash
# 后台运行
ngrok http 8080 > /tmp/ngrok.log 2>&1 &

# 查看日志获取地址
cat /tmp/ngrok.log | grep "started tunnel"
```

## 📋 使用步骤

### 步骤1：启动服务
```bash
cd /Users/yiche/linkbot-ai/proxy
./live-im-proxy
```

### 步骤2：启动 ngrok（新开一个终端）
```bash
ngrok http 8080
```

### 步骤3：获取公网地址
从 ngrok 输出中复制 `Forwarding` 后面的地址，例如：
```
https://abc123.ngrok-free.app
```

### 步骤4：配置回调地址

#### 在抖音开放平台配置
1. 登录：https://developer.open-douyin.com/
2. 应用管理 → 你的应用
3. 配置回调地址：
```
https://abc123.ngrok-free.app exports/callback
```

#### 更新环境变量（可选）
```bash
# .env 文件
DOUYIN_REDIRECT_URI=https://abc123.ngrok-free.app/oauth/callback
```

### 步骤5：测试授权
访问：
```
https://abc123.ngrok-free.app/oauth/douyin
```

## ⚠️ 注意事项

### ngrok 免费版特点
1. ✅ **完全可用** - 适合开发和测试
2. ⚠️ **动态地址** - 每次重启地址会变
3. ⚠️ **访问限制** - 有次数限制（但足够测试）
4. ⚠️ **带宽限制** - 对测试影响不大

### 解决方法
如果地址经常变，有两个方案：

#### 方案A：使用固定的免费域名（推荐）
1. 注册 ngrok 账号：https://dashboard.ngrok.com/
2. 获取 authtoken
3. 配置固定域名：
```bash
ngrok authtoken YOUR_AUTHTOKEN
ngrok http --domain=your-fixed-domain.ngrok-free.app 8080
```

#### 方案B：使用付费版
- 每月 $8
- 固定域名
- 无限制

## 🎯 下一步

主公，现在您可以：

### 立即测试
1. 打开新终端运行：`ngrok http 8080`
2. 复制公网地址
3. 在抖音开放平台配置回调地址
4. 访问公网地址测试授权

### 或使用固定域名
1. 注册 ngrok 账号
2. 配置固定域名
3. 长期使用

## 💡 推荐做法

对于开发测试阶段，**直接运行 ngrok 即可**：
```bash
ngrok http 8080
```

每次启动时复制新的地址，在抖音开放平台重新配置回调地址（只需改一次，不是每次授权都要改）。

**结论：方案A完全可行！直接使用即可！**

---

**状态**：✅ 可以使用  
**下一步**：运行 ngrok，获取地址，配置回调
