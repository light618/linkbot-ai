"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.API_PORT || 3001;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined'));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        success: false,
        message: '请求过于频繁，请稍后再试',
    },
});
app.use('/api', limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'LinkBot-AI API 服务运行正常',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'LinkBot-AI API 服务',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            channels: '/api/channels',
            conversations: '/api/conversations',
            leads: '/api/leads',
            ai: '/api/ai',
            analytics: '/api/analytics',
            system: '/api/system',
        },
    });
});
app.use('/api', require('./routes/simple'));
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在',
        path: req.originalUrl,
    });
});
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || '服务器内部错误',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});
app.listen(PORT, () => {
    console.log('🚀 LinkBot-AI 后端服务启动成功！');
    console.log(`📡 服务地址: http://localhost:${PORT}`);
    console.log(`📊 健康检查: http://localhost:${PORT}/health`);
    console.log(`📚 API文档: http://localhost:${PORT}/api`);
    console.log(`👨‍💻 作者: 赵国第一科技官`);
});
exports.default = app;
//# sourceMappingURL=index.js.map