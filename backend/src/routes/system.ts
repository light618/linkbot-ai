import express from 'express';
import { ApiResponse, Tenant, BillingPlan, Subscription } from '../types';

const router = express.Router();

// 模拟系统数据
const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'LinkBot-AI 演示企业',
    domain: 'demo.linkbot-ai.com',
    plan: 'pro',
    status: 'active',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
];

const mockBillingPlans: BillingPlan[] = [
  {
    id: 'basic',
    name: '基础版',
    price: 29,
    currency: 'USD',
    interval: 'month',
    features: [
      '最多3个渠道',
      '1000次对话/月',
      '基础AI回复',
      '邮件支持',
    ],
    limits: {
      conversations: 1000,
      channels: 3,
      users: 5,
      storage: 10,
    },
  },
  {
    id: 'pro',
    name: '专业版',
    price: 99,
    currency: 'USD',
    interval: 'month',
    features: [
      '最多10个渠道',
      '10000次对话/月',
      '高级AI回复',
      '线索管理',
      '数据分析',
      '优先支持',
    ],
    limits: {
      conversations: 10000,
      channels: 10,
      users: 20,
      storage: 100,
    },
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: 299,
    currency: 'USD',
    interval: 'month',
    features: [
      '无限渠道',
      '无限对话',
      '定制AI模型',
      '高级分析',
      'API访问',
      '专属客服',
    ],
    limits: {
      conversations: -1,
      channels: -1,
      users: -1,
      storage: 1000,
    },
  },
];

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub_1',
    tenantId: 'tenant-1',
    planId: 'pro',
    status: 'active',
    currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: false,
  },
];

// 获取租户列表
router.get('/tenants', (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let filteredTenants = mockTenants;
    
    if (status) {
      filteredTenants = filteredTenants.filter(t => t.status === status);
    }
    
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit);
    const paginatedTenants = filteredTenants.slice(start, end);
    
    res.json({
      success: true,
      message: '获取租户列表成功',
      data: {
        tenants: paginatedTenants,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: filteredTenants.length,
          totalPages: Math.ceil(filteredTenants.length / Number(limit)),
        },
      },
    } as ApiResponse);
  } catch (error) {
    console.error('获取租户列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 获取计费套餐
router.get('/billing/plans', (req, res) => {
  try {
    res.json({
      success: true,
      message: '获取计费套餐成功',
      data: { plans: mockBillingPlans },
    } as ApiResponse);
  } catch (error) {
    console.error('获取计费套餐错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 获取订阅信息
router.get('/billing/subscription', (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string || 'tenant-1';
    const subscription = mockSubscriptions.find(s => s.tenantId === tenantId);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: '订阅信息不存在',
      } as ApiResponse);
    }
    
    const plan = mockBillingPlans.find(p => p.id === subscription.planId);
    
    res.json({
      success: true,
      message: '获取订阅信息成功',
      data: {
        subscription: {
          ...subscription,
          plan,
        },
      },
    } as ApiResponse);
  } catch (error) {
    console.error('获取订阅信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 创建订阅
router.post('/billing/subscribe', (req, res) => {
  try {
    const { planId, paymentMethodId } = req.body;
    const tenantId = req.headers['x-tenant-id'] as string || 'tenant-1';
    
    const plan = mockBillingPlans.find(p => p.id === planId);
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: '套餐不存在',
      } as ApiResponse);
    }
    
    // 模拟创建订阅
    const newSubscription: Subscription = {
      id: `sub_${Date.now()}`,
      tenantId,
      planId,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
    };
    
    mockSubscriptions.push(newSubscription);
    
    res.status(201).json({
      success: true,
      message: '订阅创建成功',
      data: {
        subscription: {
          ...newSubscription,
          plan,
        },
      },
    } as ApiResponse);
  } catch (error) {
    console.error('创建订阅错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 取消订阅
router.put('/billing/cancel', (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string || 'tenant-1';
    const subscription = mockSubscriptions.find(s => s.tenantId === tenantId);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: '订阅信息不存在',
      } as ApiResponse);
    }
    
    subscription.cancelAtPeriodEnd = true;
    
    res.json({
      success: true,
      message: '订阅已取消，将在当前周期结束后生效',
      data: { subscription },
    } as ApiResponse);
  } catch (error) {
    console.error('取消订阅错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 获取系统监控
router.get('/monitoring', (req, res) => {
  try {
    const monitoring = {
      system: {
        cpu: Math.floor(Math.random() * 20) + 30,
        memory: Math.floor(Math.random() * 15) + 45,
        disk: Math.floor(Math.random() * 10) + 25,
        network: Math.floor(Math.random() * 50) + 100,
      },
      services: {
        api: 'healthy',
        database: 'healthy',
        redis: 'healthy',
        proxy: 'healthy',
      },
      uptime: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400),
      version: '1.0.0',
    };
    
    res.json({
      success: true,
      message: '获取系统监控成功',
      data: monitoring,
    } as ApiResponse);
  } catch (error) {
    console.error('获取系统监控错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 获取系统日志
router.get('/logs', (req, res) => {
  try {
    const { level = 'all', page = 1, limit = 50 } = req.query;
    
    const mockLogs = [
      {
        id: '1',
        level: 'info',
        message: '用户登录成功',
        timestamp: new Date(),
        service: 'auth',
      },
      {
        id: '2',
        level: 'warn',
        message: 'API调用频率过高',
        timestamp: new Date(),
        service: 'api',
      },
      {
        id: '3',
        level: 'error',
        message: '数据库连接失败',
        timestamp: new Date(),
        service: 'database',
      },
    ];
    
    let filteredLogs = mockLogs;
    if (level !== 'all') {
      filteredLogs = mockLogs.filter(log => log.level === level);
    }
    
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit);
    const paginatedLogs = filteredLogs.slice(start, end);
    
    res.json({
      success: true,
      message: '获取系统日志成功',
      data: {
        logs: paginatedLogs,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: filteredLogs.length,
          totalPages: Math.ceil(filteredLogs.length / Number(limit)),
        },
      },
    } as ApiResponse);
  } catch (error) {
    console.error('获取系统日志错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

module.exports = router;
