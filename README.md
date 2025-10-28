# 全域获客智能客服系统（LinkBot-AI）

**定位**：0 研发、1 人 2 周上线，公域直播间+短视频全自动获客 → 私域线索沉淀，留资率≥30%，客服成本降 60%。

## 🏗️ 技术架构

```
┌─ 前端(白标Admin) https://admin.linkbot-ai.com
├─ 渠道层 wss://proxy.linkbot-ai.com (Go 长连)
├─ AI 引擎 https://api.coze.com/open/v1/bot/chat (GPT-4o)
├─ CRM 库 https://db.linkbot-ai.com (NocoBase+PostgreSQL)
└─ 托管 & 监控 Railway 一键部署+HTTPS
```

## 📁 项目结构

```
linkbot-ai/
├── frontend/          # 白标管理后台 (React + Ant Design)
├── backend/           # API 服务 (Node.js + Express)
├── proxy/             # 渠道代理服务 (Go + WebSocket)
├── docs/              # 文档和手册
├── deploy/            # Railway 部署配置
└── README.md
```

## 🚀 快速开始

### 1. 环境要求
- Node.js 18+
- Go 1.21+
- Docker & Docker Compose
- Railway CLI

### 2. 本地开发
```bash
# 启动所有服务
docker-compose up -d

# 或分别启动
cd frontend && npm install && npm start
cd backend && npm install && npm run dev
cd proxy && go run main.go
```

### 3. 生产部署
```bash
# Railway 一键部署
railway login
railway link
railway up
```

## 📊 功能模块

### A. 渠道中心
- A01 抖音接入 - OAuth2 扫码绑定
- A02 快手接入 - 多开支持
- A03 视频号接入 - 微信 MP OAuth
- A04 渠道状态灯 - 实时监控

### B. 对话管理
- B01 进行中对话 - 三栏工作台
- B02 自动回复配置 - 关键词+沉默超时
- B03 人机切换 - Alt+R 强制接管

### C. AI 机器人
- C01 意图管理 - Coze 拖拽配置
- C02 知识图谱 FAQ - Neo4j-lite
- C03 大模型设置 - 温度+安全审核

### D. 线索中心
- D01 线索列表 - 10分制评分
- D02 分配规则 - 轮询+权重+地理
- D03 留资组件 - 手机授权+验证

### E. 流程编排
- E01 画布设计 - BPMN 可视化
- E02 版本&灰度 - 蓝绿发布

### F. 数据分析
- F01 实时仪表盘 - 进场+留资+转化率
- F02 渠道对比 - 条形图+下钻
- F03 客服绩效 - 响应时长+转化率

### G. 内容安全
- G01 敏感词库 - 三级分类
- G02 审核记录 - 命中+置信度+处置

### H. 系统管理
- H01 租户管理 - 多租户+套餐
- H02 计费账单 - Stripe/支付宝
- H03 监控告警 - CPU+内存+延迟

## 🎯 商用指标

- ✅ 支持平台：抖音、快手、视频号、小红书
- ✅ 并发：单直播间 5w 在线
- ✅ 延迟：事件→回复 ≤1s
- ✅ 计费：Stripe/支付宝订阅
- ✅ 许可证：MIT + NocoBase AGPL

## 📞 联系方式

- 作者：赵国第一科技官
- 邮箱：admin@linkbot-ai.com
- 官网：https://linkbot-ai.com

---

**祝上线大卖！** 🚀
