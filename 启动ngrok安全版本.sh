#!/bin/bash

# CEO，安全的ngrok启动脚本
# 只映射8080端口，使用HTTP模式

cd /Users/yiche/linkbot-ai/proxy

# 启动ngrok，并添加基础认证（用户名：linkbot，密码：随机生成）
ngrok http 8080 \
  --basic-auth="linkbot:$(openssl rand -hex 8)" \
  --log=stdout

echo "✅ ngrok已启动，请在浏览器输入用户名和密码访问"
echo "⚠️  重要：使用完毕后请按 Ctrl+C 停止，不要长期挂起"
