"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const mockUsers = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@linkbot-ai.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
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
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'operator',
        tenantId: 'tenant-1',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
const mockTenants = [
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
router.get('/douyin/oauth/callback', async (req, res) => {
    const { code, state } = req.query;
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
            });
        }
        const user = mockUsers.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '用户名或密码错误',
            });
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: '用户名或密码错误',
            });
        }
        if (user.status !== 'active') {
            return res.status(401).json({
                success: false,
                message: '账户已被禁用',
            });
        }
        const tenant = mockTenants.find(t => t.id === user.tenantId);
        if (!tenant) {
            return res.status(401).json({
                success: false,
                message: '租户信息不存在',
            });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
        }, process.env.JWT_SECRET || 'linkbot-ai-secret-key', { expiresIn: '7d' });
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
        });
    }
    catch (error) {
        console.error('登录错误:', error);
        return res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, confirmPassword, tenantName } = req.body;
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: '所有字段都是必填的',
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: '两次输入的密码不一致',
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: '密码至少需要6个字符',
            });
        }
        const existingUser = mockUsers.find(u => u.username === username || u.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: '用户名或邮箱已存在',
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password: hashedPassword,
            role: 'admin',
            tenantId: `tenant-${Date.now()}`,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const newTenant = {
            id: newUser.tenantId,
            name: tenantName || `${username}的企业`,
            domain: `${username}.linkbot-ai.com`,
            plan: 'basic',
            status: 'active',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
        };
        mockUsers.push(newUser);
        mockTenants.push(newTenant);
        const token = jsonwebtoken_1.default.sign({
            userId: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            tenantId: newUser.tenantId,
        }, process.env.JWT_SECRET || 'linkbot-ai-secret-key', { expiresIn: '7d' });
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
        });
    }
    catch (error) {
        console.error('注册错误:', error);
        return res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.get('/me', (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: '未提供认证令牌',
            });
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'linkbot-ai-secret-key');
        const user = mockUsers.find(u => u.id === decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '用户不存在',
            });
        }
        const { password: _, ...userWithoutPassword } = user;
        return res.json({
            success: true,
            message: '获取用户信息成功',
            data: {
                user: userWithoutPassword,
            },
        });
    }
    catch (error) {
        console.error('获取用户信息错误:', error);
        return res.status(401).json({
            success: false,
            message: '认证令牌无效',
        });
    }
});
router.post('/refresh', (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: '未提供认证令牌',
            });
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'linkbot-ai-secret-key');
        const newToken = jsonwebtoken_1.default.sign({
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
            tenantId: decoded.tenantId,
        }, process.env.JWT_SECRET || 'linkbot-ai-secret-key', { expiresIn: '7d' });
        return res.json({
            success: true,
            message: 'Token 刷新成功',
            data: {
                token: newToken,
            },
        });
    }
    catch (error) {
        console.error('刷新 token 错误:', error);
        return res.status(401).json({
            success: false,
            message: '认证令牌无效',
        });
    }
});
router.put('/password', async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: '旧密码和新密码不能为空',
            });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: '新密码至少需要6个字符',
            });
        }
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: '未提供认证令牌',
            });
        }
        const token = authHeader.substring(7);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'linkbot-ai-secret-key');
        const user = mockUsers.find(u => u.id === decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: '用户不存在',
            });
        }
        const isValid = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: '旧密码错误',
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.updatedAt = new Date();
        return res.json({
            success: true,
            message: '密码修改成功',
        });
    }
    catch (error) {
        console.error('修改密码错误:', error);
        return res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
module.exports = router;
//# sourceMappingURL=auth.js.map