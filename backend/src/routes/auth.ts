import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiResponse, User, Tenant } from '../types';

const router = express.Router();

// 模拟用户数据（实际项目中应该从数据库获取）
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@linkbot-ai.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    tenantId: 'tenant-1',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    username: 'operator',
    email: 'operator@linkbot-ai.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'operator',
    tenantId: 'tenant-1',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'LinkBot-AI 演示企业',
    domain: 'demo.linkbot-ai.com',
    plan: 'pro',
    status: 'active',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
    createdAt: new Date(),
  },
];

// 用户登录
// 模拟抖音OAuth授权回调
router.get('/douyin/oauth/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // 模拟返回授权成功
  res.json({
    success: true,
    message: '授权成功',
    data: {
      access_token: `mock_token_${Date.now()}`,
      refresh_token: `mock_refresh_${Date.now()}`,
      expires_in: 7200,
      user_info: {
        open_id: 'mock_open_123',
        union_id: 'mock_union_123',
        nickname: '测试抖音账号',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Douyin',
      },
    },
  });
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空',
      } as ApiResponse);
    }

    // 查找用户
    const user = mockUsers.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误',
      } as ApiResponse);
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误',
      } as ApiResponse);
    }

    // 检查用户状态
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: '账户已被禁用',
      } as ApiResponse);
    }

    // 查找租户信息
    const tenant = mockTenants.find(t => t.id === user.tenantId);
    if (!tenant) {
      return res.status(401).json({
        success: false,
        message: '租户信息不存在',
      } as ApiResponse);
    }

    // 生成 JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
      process.env.JWT_SECRET || 'linkbot-ai-secret-key',
      { expiresIn: '7d' }
    );

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: userWithoutPassword,
        tenant: {
          id: tenant.id,
          name: tenant.name,
          plan: tenant.plan,
        },
      },
    } as ApiResponse);
  } catch (error) {
    console.error('登录错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword, tenantName } = req.body;

    // 验证输入
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: '所有字段都是必填的',
      } as ApiResponse);
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: '两次输入的密码不一致',
      } as ApiResponse);
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码至少需要6个字符',
      } as ApiResponse);
    }

    // 检查用户名是否已存在
    const existingUser = mockUsers.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已存在',
      } as ApiResponse);
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      role: 'admin', // 注册用户默认为管理员
      tenantId: `tenant-${Date.now()}`,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 创建新租户
    const newTenant: Tenant = {
      id: newUser.tenantId,
      name: tenantName || `${username}的企业`,
      domain: `${username}.linkbot-ai.com`,
      plan: 'basic',
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天试用
      createdAt: new Date(),
    };

    // 添加到模拟数据（实际项目中应该保存到数据库）
    mockUsers.push(newUser);
    mockTenants.push(newTenant);

    // 生成 JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        tenantId: newUser.tenantId,
      },
      process.env.JWT_SECRET || 'linkbot-ai-secret-key',
      { expiresIn: '7d' }
    );

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        token,
        user: userWithoutPassword,
        tenant: {
          id: newTenant.id,
          name: newTenant.name,
          plan: newTenant.plan,
        },
      },
    } as ApiResponse);
  } catch (error) {
    console.error('注册错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 获取当前用户信息
router.get('/me', (req, res) => {
  try {
    // 从请求头获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌',
      } as ApiResponse);
    }

    const token = authHeader.substring(7);
    
    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'linkbot-ai-secret-key') as any;
    
    // 查找用户
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在',
      } as ApiResponse);
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      success: true,
      message: '获取用户信息成功',
      data: {
        user: userWithoutPassword,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    return res.status(401).json({
      success: false,
      message: '认证令牌无效',
    } as ApiResponse);
  }
});

// 刷新 token
router.post('/refresh', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌',
      } as ApiResponse);
    }

    const token = authHeader.substring(7);
    
    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'linkbot-ai-secret-key') as any;
    
    // 生成新的 token
    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
        tenantId: decoded.tenantId,
      },
      process.env.JWT_SECRET || 'linkbot-ai-secret-key',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Token 刷新成功',
      data: {
        token: newToken,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('刷新 token 错误:', error);
    return res.status(401).json({
      success: false,
      message: '认证令牌无效',
    } as ApiResponse);
  }
});

// 修改密码
router.put('/password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '旧密码和新密码不能为空',
      } as ApiResponse);
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: '新密码至少需要6个字符',
      } as ApiResponse);
    }

    // 从请求头获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌',
      } as ApiResponse);
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'linkbot-ai-secret-key') as any;
    
    // 查找用户
    const user = mockUsers.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在',
      } as ApiResponse);
    }

    // 验证旧密码
    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: '旧密码错误',
      } as ApiResponse);
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.updatedAt = new Date();

    return res.json({
      success: true,
      message: '密码修改成功',
    } as ApiResponse);
  } catch (error) {
    console.error('修改密码错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

module.exports = router;
