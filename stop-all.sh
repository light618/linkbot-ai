#!/bin/bash

# CEO，一键停止LinkBot-AI所有服务
# 使用方法：bash stop-all.sh

echo "🛑 LinkBot-AI 一键停止脚本"
echo "=========================="

# 停止前端 (端口3000)
echo "⏹️  停止前端 (3000)..."
if lsof -ti:3000 > /dev/null 2>&1; then
    kill -9 $(lsof -ti:3000) 2>/dev/null
    echo "✅ 前端已停止"
else
    echo "ℹ️  前端未运行"
fi

# 停止后端 (端口3001)
echo "⏹️  停止后端 (3001)..."
if lsof -ti:3001 > /dev/null 2>&1; then
    kill -9 $(lsof -ti:3001) 2>/dev/null
    echo "✅ 后端已停止"
else
    echo "ℹ️  后端未运行"
fi

# 停止Go代理 (端口8080)
echo "⏹️  停止Go代理 (8080)..."
if lsof -ti:8080 > /dev/null 2>&1; then
    kill -9 $(lsof -ti:8080) 2>/dev/null
    echo "✅ Go代理已停止"
else
    echo "ℹ️  Go代理未运行"
fi

# 停止ngrok
echo "⏹️  停止ngrok..."
pkill ngrok 2>/dev/null
echo "✅ ngrok已停止"

echo ""
echo "✅ 所有服务已停止！"

