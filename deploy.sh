#!/bin/bash

# LinkBot-AI 一键部署脚本
# 作者：赵国第一科技官

set -e

echo "🚀 LinkBot-AI 一键部署开始..."

# 检查 Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ 请先安装 Railway CLI:"
    echo "npm install -g @railway/cli"
    echo "railway login"
    exit 1
fi

# 检查是否已登录
if ! railway whoami &> /dev/null; then
    echo "❌ 请先登录 Railway:"
    echo "railway login"
    exit 1
fi

echo "✅ Railway CLI 已就绪"

# 创建项目
echo "📦 创建 Railway 项目..."
railway init

# 添加 PostgreSQL 数据库
echo "🗄️ 添加 PostgreSQL 数据库..."
railway add postgresql

# 添加 Redis
echo "🔴 添加 Redis..."
railway add redis

# 部署后端服务
echo "🔧 部署后端服务..."
cd backend
railway up --detach
cd ..

# 部署代理服务
echo "🌐 部署代理服务..."
cd proxy
railway up --detach
cd ..

# 部署前端服务
echo "🎨 部署前端服务..."
cd frontend
npm run build
railway up --detach
cd ..

echo "✅ 部署完成！"
echo ""
echo "📊 服务地址："
echo "前端: https://$(railway domain)"
echo "后端: https://$(railway domain)-backend"
echo "代理: https://$(railway domain)-proxy"
echo ""
echo "🔧 环境变量配置："
echo "请在 Railway 控制台配置以下环境变量："
echo "- COZE_BOT_ID=your_bot_id"
echo "- COZE_TOKEN=your_coze_token"
echo "- NB_API=https://your-nocobase-url"
echo "- NB_TOKEN=your_nocobase_token"
echo ""
echo "🎉 部署成功！现在可以开始使用了！"
