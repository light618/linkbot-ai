import express from 'express';
import { ApiResponse, Channel } from '../types';

const router = express.Router();

// 模拟渠道数据
const mockChannels: Channel[] = [
  {
    id: '1',
    tenantId: 'tenant-1',
    type: 'douyin',
    name: '抖音直播间',
    accountId: 'douyin_123456',
    accountName: '我的抖音号',
    avatar: 'https://example.com/avatar.jpg',
    status: 'online',
    lastHeartbeat: new Date(),
    config: {
      autoReply: true,
      keywords: ['价格', '购买', '咨询'],
      welcomeMessage: '欢迎来到直播间！有什么问题随时问我~',
      silenceTimeout: 30,
      maxConcurrent: 100,
    },
    createdAt: new Date(),
  },
];

// 获取渠道列表
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    
    let filteredChannels = mockChannels;
    
    if (type) {
      filteredChannels = filteredChannels.filter(c => c.type === type);
    }
    
    if (status) {
      filteredChannels = filteredChannels.filter(c => c.status === status);
    }
    
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit);
    const paginatedChannels = filteredChannels.slice(start, end);
    
    res.json({
      success: true,
      message: '获取渠道列表成功',
      data: {
        channels: paginatedChannels,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: filteredChannels.length,
          totalPages: Math.ceil(filteredChannels.length / Number(limit)),
        },
      },
    } as ApiResponse);
  } catch (error) {
    console.error('获取渠道列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 获取渠道详情
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const channel = mockChannels.find(c => c.id === id);
    
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: '渠道不存在',
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      message: '获取渠道详情成功',
      data: { channel },
    } as ApiResponse);
  } catch (error) {
    console.error('获取渠道详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 创建渠道
router.post('/', (req, res) => {
  try {
    const { type, name, accountId, accountName, config } = req.body;
    
    const newChannel: Channel = {
      id: Date.now().toString(),
      tenantId: 'tenant-1', // 实际应该从认证中获取
      type,
      name,
      accountId,
      accountName,
      status: 'offline',
      lastHeartbeat: new Date(),
      config: config || {
        autoReply: true,
        keywords: [],
        welcomeMessage: '欢迎！',
        silenceTimeout: 30,
        maxConcurrent: 100,
      },
      createdAt: new Date(),
    };
    
    mockChannels.push(newChannel);
    
    res.status(201).json({
      success: true,
      message: '创建渠道成功',
      data: { channel: newChannel },
    } as ApiResponse);
  } catch (error) {
    console.error('创建渠道错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 更新渠道
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, config } = req.body;
    
    const channelIndex = mockChannels.findIndex(c => c.id === id);
    if (channelIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '渠道不存在',
      } as ApiResponse);
    }
    
    mockChannels[channelIndex] = {
      ...mockChannels[channelIndex],
      name: name || mockChannels[channelIndex].name,
      config: config || mockChannels[channelIndex].config,
    };
    
    res.json({
      success: true,
      message: '更新渠道成功',
      data: { channel: mockChannels[channelIndex] },
    } as ApiResponse);
  } catch (error) {
    console.error('更新渠道错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 删除渠道
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const channelIndex = mockChannels.findIndex(c => c.id === id);
    
    if (channelIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '渠道不存在',
      } as ApiResponse);
    }
    
    mockChannels.splice(channelIndex, 1);
    
    res.json({
      success: true,
      message: '删除渠道成功',
    } as ApiResponse);
  } catch (error) {
    console.error('删除渠道错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 获取渠道状态
router.get('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const channel = mockChannels.find(c => c.id === id);
    
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: '渠道不存在',
      } as ApiResponse);
    }
    
    res.json({
      success: true,
      message: '获取渠道状态成功',
      data: {
        status: channel.status,
        lastHeartbeat: channel.lastHeartbeat,
        online: channel.status === 'online',
      },
    } as ApiResponse);
  } catch (error) {
    console.error('获取渠道状态错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

module.exports = router;
