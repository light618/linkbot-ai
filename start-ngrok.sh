#!/bin/bash

# CEO，启动ngrok的独立脚本
# 使用方法：bash start-ngrok.sh

echo "🚀 启动ngrok..."
echo "=========================="

# 停止已有的ngrok
pkill ngrok 2>/dev/null
sleep 1

# 启动ngrok（前台运行，方便查看URL）
echo "⏳ ngrok正在启动..."
echo "⚠️  重要：ngrok会显示公网URL，请记录该URL"
echo ""
ngrok http 8080

