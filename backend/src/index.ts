import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// 安全中间件
app.use(helmet());

// CORS 配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// 压缩中间件
app.use(compression());

// 日志中间件
app.use(morgan('combined'));

// 限流中间件 - 为登录接口设置更宽松的限制
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 20, // 登录接口：15分钟内最多20次尝试
  message: {
    success: false,
    message: '登录尝试过于频繁，请稍后再试',
  },
  skipSuccessfulRequests: true, // 成功请求不计入限制
  standardHeaders: true,
  legacyHeaders: false,
});

// 通用限流中间件 - 排除登录和注册接口
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 分钟
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 限制每个 IP 100 次请求
  message: {
    success: false,
    message: '请求过于频繁，请稍后再试',
  },
  skip: (req) => {
    // 跳过登录和注册接口，它们使用专门的限流
    return req.path === '/auth/login' || req.path === '/auth/register';
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 登录和注册接口使用更宽松的限流（在路由之前应用）
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth/register', loginLimiter);

// 其他API使用通用限流
app.use('/api', limiter);

// 解析 JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'LinkBot-AI API 服务运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API 路由
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

// 简化路由（临时使用）
app.use('/api', require('./routes/simple'));

// 完整路由（暂时注释，等修复错误后再启用）
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/channels', require('./routes/channels'));
// app.use('/api/conversations', require('./routes/conversations'));
// app.use('/api/leads', require('./routes/leads'));
// app.use('/api/ai', require('./routes/ai'));
// app.use('/api/analytics', require('./routes/analytics'));
// app.use('/api/system', require('./routes/system'));

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl,
  });
});

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('服务器错误:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('🚀 LinkBot-AI 后端服务启动成功！');
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log(`📊 健康检查: http://localhost:${PORT}/health`);
  console.log(`📚 API文档: http://localhost:${PORT}/api`);
  console.log(`👨‍💻 作者: 赵国第一科技官`);
});

export default app;
