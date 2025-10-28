import express from 'express';
import { ApiResponse, DashboardStats, RealtimeData } from '../types';

const router = express.Router();

// 获取仪表盘统计
router.get('/dashboard', (req, res) => {
  try {
    const stats: DashboardStats = {
      totalConversations: 1248,
      activeConversations: 23,
      totalLeads: 156,
      newLeads: 12,
      conversionRate: 12.5,
      avgResponseTime: 1.2,
      satisfactionScore: 4.8,
    };
    
    res.json({
      success: true,
      message: '获取仪表盘统计成功',
      data: stats,
    } as ApiResponse);
  } catch (error) {
    console.error('获取仪表盘统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 获取实时数据
router.get('/realtime', (req, res) => {
  try {
    const realtimeData: RealtimeData = {
      onlineUsers: Math.floor(Math.random() * 1000) + 500,
      activeConversations: Math.floor(Math.random() * 50) + 10,
      messagesPerMinute: Math.floor(Math.random() * 100) + 20,
      systemLoad: Math.floor(Math.random() * 40) + 30,
    };
    
    res.json({
      success: true,
      message: '获取实时数据成功',
      data: realtimeData,
    } as ApiResponse);
  } catch (error) {
    console.error('获取实时数据错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 获取渠道统计
router.get('/channels', (req, res) => {
  try {
    const channelStats = [
      {
        channelId: '1',
        channelName: '抖音',
        conversations: 456,
        leads: 67,
        conversionRate: 14.7,
        avgScore: 7.2,
        revenue: 12500,
      },
      {
        channelId: '2',
        channelName: '快手',
        conversations: 234,
        leads: 34,
        conversionRate: 14.5,
        avgScore: 6.8,
        revenue: 8900,
      },
      {
        channelId: '3',
        channelName: '视频号',
        conversations: 189,
        leads: 28,
        conversionRate: 14.8,
        avgScore: 7.5,
        revenue: 7200,
      },
      {
        channelId: '4',
        channelName: '小红书',
        conversations: 123,
        leads: 18,
        conversionRate: 14.6,
        avgScore: 6.9,
        revenue: 4800,
      },
    ];
    
    res.json({
      success: true,
      message: '获取渠道统计成功',
      data: { channels: channelStats },
    } as ApiResponse);
  } catch (error) {
    console.error('获取渠道统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 获取时间趋势数据
router.get('/trends', (req, res) => {
  try {
    const { period = '24h' } = req.query;
    
    let data: any[] = [];
    
    if (period === '24h') {
      data = [
        { time: '00:00', conversations: 12, leads: 2, revenue: 500 },
        { time: '04:00', conversations: 8, leads: 1, revenue: 300 },
        { time: '08:00', conversations: 45, leads: 6, revenue: 1200 },
        { time: '12:00', conversations: 78, leads: 12, revenue: 2100 },
        { time: '16:00', conversations: 65, leads: 8, revenue: 1800 },
        { time: '20:00', conversations: 89, leads: 15, revenue: 2500 },
      ];
    } else if (period === '7d') {
      data = [
        { date: '2024-01-01', conversations: 156, leads: 23, revenue: 5600 },
        { date: '2024-01-02', conversations: 189, leads: 28, revenue: 7200 },
        { date: '2024-01-03', conversations: 167, leads: 25, revenue: 6300 },
        { date: '2024-01-04', conversations: 201, leads: 31, revenue: 8100 },
        { date: '2024-01-05', conversations: 178, leads: 27, revenue: 6900 },
        { date: '2024-01-06', conversations: 195, leads: 29, revenue: 7500 },
        { date: '2024-01-07', conversations: 223, leads: 35, revenue: 8900 },
      ];
    }
    
    res.json({
      success: true,
      message: '获取趋势数据成功',
      data: { trends: data },
    } as ApiResponse);
  } catch (error) {
    console.error('获取趋势数据错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 获取客服绩效
router.get('/performance', (req, res) => {
  try {
    const performance = [
      {
        operatorId: 'op_1',
        operatorName: '张三',
        conversations: 45,
        avgResponseTime: 1.2,
        satisfactionScore: 4.8,
        conversionRate: 15.6,
        revenue: 12500,
      },
      {
        operatorId: 'op_2',
        operatorName: '李四',
        conversations: 38,
        avgResponseTime: 1.5,
        satisfactionScore: 4.6,
        conversionRate: 12.3,
        revenue: 9800,
      },
      {
        operatorId: 'op_3',
        operatorName: '王五',
        conversations: 42,
        avgResponseTime: 1.1,
        satisfactionScore: 4.9,
        conversionRate: 18.2,
        revenue: 15200,
      },
    ];
    
    res.json({
      success: true,
      message: '获取客服绩效成功',
      data: { performance },
    } as ApiResponse);
  } catch (error) {
    console.error('获取客服绩效错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

// 获取漏斗分析
router.get('/funnel', (req, res) => {
  try {
    const funnel = [
      { stage: '进入直播间', count: 10000, rate: 100 },
      { stage: '发送消息', count: 2500, rate: 25 },
      { stage: '留资', count: 375, rate: 15 },
      { stage: '转化', count: 56, rate: 14.9 },
    ];
    
    res.json({
      success: true,
      message: '获取漏斗分析成功',
      data: { funnel },
    } as ApiResponse);
  } catch (error) {
    console.error('获取漏斗分析错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
    } as ApiResponse);
  }
});

module.exports = router;
