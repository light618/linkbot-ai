#!/bin/bash

# LinkBot-AI 停止服务脚本

echo "🛑 正在停止 LinkBot-AI 服务..."

# 读取 PID 文件并停止进程
if [ -f .go-service.pid ]; then
    PID=$(cat .go-service.pid)
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID 2>/dev/null
        echo "✅ 已停止 Go 服务 (PID: $PID)"
    fi
    rm -f .go-service.pid
fi

if [ -f .backend.pid ]; then
    PID=$(cat .backend.pid)
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID 2>/dev/null
        echo "✅ 已停止后端服务 (PID: $PID)"
    fi
    rm -f .backend.pid
fi

if [ -f .frontend.pid ]; then
    PID=$(cat .frontend.pid)
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID 2>/dev/null
        echo "✅ 已停止前端服务 (PID: $PID)"
    fi
    rm -f .frontend.pid
fi

# 清理端口占用
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "✅ 所有服务已停止"

