#!/bin/bash

# LinkBot-AI 一键启动脚本
# 作者：赵国第一科技官

set -e

echo "🚀 LinkBot-AI 服务启动中..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查端口占用
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${YELLOW}⚠️  端口 $port 已被占用，正在释放...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

# 检查并安装依赖
check_dependencies() {
    echo "📦 检查依赖..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ 未安装 Node.js，请先安装${NC}"
        exit 1
    fi
    
    # 检查 Go
    if ! command -v go &> /dev/null; then
        echo -e "${RED}❌ 未安装 Go，请先安装${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 依赖检查通过${NC}"
}

# 加载环境变量
load_env() {
    if [ -f .env ]; then
        export $(cat .env | grep -v '^#' | xargs)
        echo -e "${GREEN}✅ 已加载环境变量${NC}"
    else
        echo -e "${YELLOW}⚠️  未找到 .env 文件${NC}"
    fi
}

# 启动 Go 服务
start_go_service() {
    echo "🔧 启动 Go 代理服务 (端口 8080)..."
    check_port 8080
    
    cd "$(dirname "$0")"
    nohup go run main.go > logs/go-service.log 2>&1 &
    GO_PID=$!
    echo $GO_PID > .go-service.pid
    
    sleep 3
    if ps -p $GO_PID > /dev/null; then
        echo -e "${GREEN}✅ Go 服务已启动 (PID: $GO_PID)${NC}"
    else
        echo -e "${RED}❌ Go 服务启动失败，请查看 logs/go-service.log${NC}"
        exit 1
    fi
}

# 启动后端 API
start_backend() {
    echo "🔧 启动后端 API 服务 (端口 3001)..."
    check_port 3001
    
    cd "$(dirname "$0")/backend"
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo "📦 安装后端依赖..."
        npm install
    fi
    
    nohup npm run dev > ../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../.backend.pid
    
    sleep 3
    if ps -p $BACKEND_PID > /dev/null; then
        echo -e "${GREEN}✅ 后端服务已启动 (PID: $BACKEND_PID)${NC}"
    else
        echo -e "${RED}❌ 后端服务启动失败，请查看 logs/backend.log${NC}"
        exit 1
    fi
    
    cd ..
}

# 启动前端
start_frontend() {
    echo "🎨 启动前端服务 (端口 3000)..."
    check_port 3000
    
    cd "$(dirname "$0")/../linkbot-ai-frontend"
    
    # 检查依赖
    if [ ! -d "node_modules" ]; then
        echo "📦 安装前端依赖..."
        npm install
    fi
    
    nohup npm start > ../linkbot-ai/logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../linkbot-ai/.frontend.pid
    
    sleep 5
    if ps -p $FRONTEND_PID > /dev/null; then
        echo -e "${GREEN}✅ 前端服务已启动 (PID: $FRONTEND_PID)${NC}"
    else
        echo -e "${RED}❌ 前端服务启动失败，请查看 logs/frontend.log${NC}"
        exit 1
    fi
    
    cd ../linkbot-ai
}

# 创建日志目录
mkdir -p logs

# 主流程
main() {
    echo "=========================================="
    echo "  LinkBot-AI 智能客服系统"
    echo "  为主公开疆拓土！🚀"
    echo "=========================================="
    echo ""
    
    check_dependencies
    load_env
    
    # 启动服务
    start_go_service
    start_backend
    start_frontend
    
    echo ""
    echo "=========================================="
    echo -e "${GREEN}✅ 所有服务启动成功！${NC}"
    echo "=========================================="
    echo ""
    echo "📡 服务地址："
    echo "  - 前端: http://localhost:3000"
    echo "  - 后端: http://localhost:3001"
    echo "  - Go代理: http://localhost:8080"
    echo ""
    echo "📊 查看日志："
    echo "  - Go服务: tail -f logs/go-service.log"
    echo "  - 后端: tail -f logs/backend.log"
    echo "  - 前端: tail -f logs/frontend.log"
    echo ""
    echo "🛑 停止服务："
    echo "  ./stop.sh"
    echo ""
}

# 运行主流程
main

