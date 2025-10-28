#!/bin/bash

# CEO，一键启动LinkBot-AI所有服务
# 使用方法：bash start-all.sh

echo "🚀 LinkBot-AI 一键启动脚本"
echo "=========================="

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查端口占用
check_port() {
    if lsof -ti:$1 > /dev/null 2>&1; then
        echo "дела": "端口 $1 已被占用，尝试停止..."
        kill -9 $(lsof -ti:$1) 2>/dev/null
        sleep 2
    fi
}

# 停止已有进程
echo "🧹 清理已有进程..."
check_port 3000
check_port 3001
check_port 8080

sleep 1

# 启动后端 (端口3001)
echo "📡 启动后端服务 (3001)..."
cd /Users/yiche/linkbot-ai/backend
npm run dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ 后端已启动 (PID: $BACKEND_PID)"

# 等待后端启动
sleep 3

# 启动Go代理 (端口8080)
echo "🌐 启动Go代理服务 (8080)..."
cd /Users/yiche/linkbot-ai/proxy
# 加载.env文件中的环境变量
export $(cat .env | grep -v '^#' | xargs)
./live-im-proxy > /tmp/proxy.log 2>&1 &
PROXY_PID=$!
echo "✅ Go代理已启动 (PID: $PROXY_PID)"

# 等待代理启动
sleep 2

# 启动前端 (端口3000)
echo "🎨 启动前端服务 (3000)..."
cd /Users/yiche/linkbot-ai/frontend
npm start > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ 前端已启动 (PID: $FRONTEND_PID)"

# 启动ngrok (端口4040)
echo "🌐 启动ngrok服务 (4040)..."
cd /Users/yiche/linkbot-ai/proxy
pkill ngrok 2>/dev/null
sleep 2
nohup ngrok http 8080 > /tmp/ngrok.log 2>&1 &
NGROK_PID=$!
echo "✅ ngrok已启动 (PID: $NGROK_PID)"

# 等待ngrok启动
sleep 5

# 检查服务状态
echo ""
echo "=========================="
echo "📊 服务状态检查"
echo "=========================="

# 检查后端
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ 后端: http://localhost:3001 (运行中)"
else
    echo "❌ 后端: 未响应，查看日志: tail -f /tmp/backend.log"
fi

# 检查Go代理
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Go代理: http://localhost:8080 (运行中)"
else
    echo "❌ Go代理: 未响应，查看日志: tail -f /tmp/proxy.log"
fi

# 检查ngrok
if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "import sys, json; data=json.load(sys.stdin); print([t['public_url'] for t in data.get('tunnels',[])][0] if data.get('tunnels') else 'URL获取中...')")
    echo "✅ ngrok: $NGROK_URL (运行中)"
else
    echo "⏳ ngrok: 仍在启动中"
fi

echo ""
echo "=========================="
echo "🎯 访问地址"
echo "=========================="
echo "前端登录页: http://localhost:3000/login"
echo "登录账号: admin / admin123"
echo ""
echo "后端API: http://localhost:3001"
echo "Go代理: http://localhost:8080"
echo "ngrok: $NGROK_URL"
echo ""
echo "=========================="
echo "📝 查看日志"
echo "=========================="
echo "后端: tail -f /tmp/backend.log"
echo "Go代理: tail -f /tmp/proxy.log"
echo "前端: tail -f /tmp/frontend.log"
echo "ngrok: tail -f /tmp/ngrok.log"
echo ""
echo "⚠️  提示: 按 Ctrl+C 不会停止服务"
echo "   停止服务请使用: bash stop-all.sh"
echo ""

# 保存PID到文件
echo "BACKEND_PID=$BACKEND_PID" > /tmp/linkbot-pids.txt
echo "PROXY_PID=$PROXY_PID" >> /tmp/linkbot-pids.txt
echo "FRONTEND_PID=$FRONTEND_PID" >> /tmp/linkbot-pids.txt
echo "NGROK_PID=$NGROK_PID" >> /tmp/linkbot-pids.txt

echo "✅ 所有服务启动完成！"

