import express from 'express';

const router = express.Router();

// 简化的健康检查
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'LinkBot-AI 后端服务运行正常',
    data: {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});

// 模拟抖音OAuth授权回调
router.get('/auth/douyin/oauth/callback', (req, res) => {
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

// 简化的登录接口
router.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({
      success: true,
      message: '登录成功',
      data: {
        token: 'mock-token-123',
        user: {
          id: '1',
          username: 'admin',
          email: 'admin@linkbot-ai.com',
          role: 'admin',
          tenantId: 'tenant-1',
        },
        tenant: {
          id: 'tenant-1',
          name: 'LinkBot-AI 演示企业',
          plan: 'pro',
        },
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: '用户名或密码错误',
    });
  }
});

// 抖音OAuth授权 - 获取授权URL
router.get('/channels/douyin/oauth/url', async (req, res) => {
  try {
    // 调用Go服务的OAuth接口，请求JSON格式
    const proxyUrl = process.env.PROXY_URL || 'http://localhost:8080';
    const response = await fetch(`${proxyUrl}/oauth/douyin?format=json`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('获取授权URL失败');
    }
    
    const data: any = await response.json();
    res.json({
      success: true,
      message: '获取授权URL成功',
      data: {
        authUrl: data.auth_url || data.url,
      },
    });
  } catch (error: any) {
    console.error('获取抖音授权URL错误:', error);
    res.status(500).json({
      success: false,
      message: error.message || '获取授权URL失败',
    });
  }
});

// 抖音OAuth回调处理
router.get('/channels/douyin/oauth/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: '授权码不存在',
      });
    }
    
    // 调用Go服务处理OAuth回调
    const proxyUrl = process.env.PROXY_URL || 'http://localhost:8080';
    const response = await fetch(`${proxyUrl}/oauth/callback?code=${code}&state=${state}`);
    
    if (!response.ok) {
      throw new Error('处理OAuth回调失败');
    }
    
    const data: any = await response.json();
    
    // 返回授权成功信息
    return res.json({
      success: true,
      message: '抖音授权成功',
      data: {
        accessToken: data.access_token,
        userInfo: data.user_info,
        accountId: data.user_info?.open_id,
        accountName: data.user_info?.nickname,
      },
    });
  } catch (error: any) {
    console.error('抖音OAuth回调错误:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '处理授权回调失败',
    });
  }
});

// 启动抖音渠道监听
router.post('/channels/douyin/start', async (req, res) => {
  try {
    const { accountId, accessToken, roomId, videoId } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'accessToken不能为空',
      });
    }
    
    // 调用Go服务启动渠道
    const proxyUrl = process.env.PROXY_URL || 'http://localhost:8080';
    const response = await fetch(`${proxyUrl}/api/channel/douyin/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_id: accountId,
        access_token: accessToken,
        room_id: roomId,
        video_id: videoId,
      }),
    });
    
    if (!response.ok) {
      throw new Error('启动渠道失败');
    }
    
    const data: any = await response.json();
    
    return res.json({
      success: true,
      message: '启动抖音渠道成功',
      data: {
        channelId: data.channel_id,
        status: 'connected',
      },
    });
  } catch (error: any) {
    console.error('启动抖音渠道错误:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '启动渠道失败',
    });
  }
});

// 停止抖音渠道监听
router.post('/channels/douyin/stop', async (req, res) => {
  try {
    const { accountId } = req.body;
    
    // 调用Go服务停止渠道
    const proxyUrl = process.env.PROXY_URL || 'http://localhost:8080';
    const response = await fetch(`${proxyUrl}/api/channel/douyin/stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_id: accountId,
      }),
    });
    
    if (!response.ok) {
      throw new Error('停止渠道失败');
    }
    
    res.json({
      success: true,
      message: '停止抖音渠道成功',
    });
  } catch (error: any) {
    console.error('停止抖音渠道错误:', error);
    res.status(500).json({
      success: false,
      message: error.message || '停止渠道失败',
    });
  }
});

// 获取抖音渠道状态
router.get('/channels/douyin/status/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    
    // 调用Go服务获取状态
    const proxyUrl = process.env.PROXY_URL || 'http://localhost:8080';
    const response = await fetch(`${proxyUrl}/api/status?account_id=${accountId}`);
    
    if (!response.ok) {
      throw new Error('获取渠道状态失败');
    }
    
    const data: any = await response.json();
    
    res.json({
      success: true,
      message: '获取渠道状态成功',
      data: {
        status: data.status || 'disconnected',
        connected: data.connected || false,
        lastMessage: data.last_message,
      },
    });
  } catch (error: any) {
    console.error('获取抖音渠道状态错误:', error);
    res.status(500).json({
      success: false,
      message: error.message || '获取渠道状态失败',
    });
  }
});

// 简化的仪表盘数据
router.get('/analytics/dashboard', (req, res) => {
  res.json({
    success: true,
    message: '获取仪表盘数据成功',
    data: {
      totalConversations: 1248,
      activeConversations: 23,
      totalLeads: 156,
      newLeads: 12,
      conversionRate: 12.5,
      avgResponseTime: 1.2,
      satisfactionScore: 4.8,
    },
  });
});

// 简化的实时数据
router.get('/analytics/realtime', (req, res) => {
  res.json({
    success: true,
    message: '获取实时数据成功',
    data: {
      onlineUsers: Math.floor(Math.random() * 1000) + 500,
      activeConversations: Math.floor(Math.random() * 50) + 10,
      messagesPerMinute: Math.floor(Math.random() * 100) + 20,
      systemLoad: Math.floor(Math.random() * 40) + 30,
    },
  });
});

// 渠道数据
router.get('/channels/data', (req, res) => {
  res.json({
    success: true,
    message: '获取渠道数据成功',
    data: {
      channels: [
        { name: '抖音', status: 'connected', messages: 450, leads: 45, conversion: 10.0 },
        { name: '快手', status: 'connected', messages: 320, leads: 28, conversion: 8.8 },
        { name: '视频号', status: 'warning', messages: 280, leads: 22, conversion: 7.9 },
        { name: '小红书', status: 'disconnected', messages: 198, leads: 15, conversion: 7.6 },
      ],
      totalMessages: 1248,
      totalLeads: 110,
      avgConversion: 8.6,
    },
  });
});

// 对话数据
router.get('/conversations/data', (req, res) => {
  res.json({
    success: true,
    message: '获取对话数据成功',
    data: {
      conversations: [
        {
          id: '1',
          user: '张先生',
          channel: '抖音',
          lastMessage: '请问你们的产品价格是多少？',
          time: '2分钟前',
          status: 'active',
          priority: 'high',
        },
        {
          id: '2',
          user: '李女士',
          channel: '快手',
          lastMessage: '我想了解一下售后服务',
          time: '5分钟前',
          status: 'waiting',
          priority: 'medium',
        },
        {
          id: '3',
          user: '王总',
          channel: '视频号',
          lastMessage: '好的，我考虑一下',
          time: '10分钟前',
          status: 'closed',
          priority: 'low',
        },
      ],
      totalConversations: 1248,
      activeConversations: 23,
      avgResponseTime: 1.2,
      satisfactionScore: 4.8,
    },
  });
});

// 线索数据
router.get('/leads/data', (req, res) => {
  res.json({
    success: true,
    message: '获取线索数据成功',
    data: {
      leads: [
        {
          id: '1',
          name: '张先生',
          company: '北京科技有限公司',
          phone: '138****8888',
          email: 'zhang@example.com',
          source: '抖音',
          status: 'new',
          priority: 'high',
          value: 50000,
          probability: 0.8,
        },
        {
          id: '2',
          name: '李女士',
          company: '上海贸易有限公司',
          phone: '139****9999',
          email: 'li@example.com',
          source: '快手',
          status: 'contacted',
          priority: 'medium',
          value: 30000,
          probability: 0.6,
        },
      ],
      totalLeads: 156,
      newLeads: 12,
      totalValue: 2500000,
      avgProbability: 0.7,
    },
  });
});

// AI意图数据
router.get('/ai/intents/data', (req, res) => {
  res.json({
    success: true,
    message: '获取AI意图数据成功',
    data: {
      intents: [
        {
          id: '1',
          name: '价格咨询',
          status: 'active',
          confidence: 0.95,
          trainingCount: 156,
          accuracy: 0.92,
        },
        {
          id: '2',
          name: '售后服务',
          status: 'active',
          confidence: 0.88,
          trainingCount: 89,
          accuracy: 0.89,
        },
      ],
      totalIntents: 8,
      activeIntents: 6,
      avgAccuracy: 0.87,
      totalTraining: 1245,
    },
  });
});

module.exports = router;
