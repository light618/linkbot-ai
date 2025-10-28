import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Tag,
  Button,
  Space,
  Tooltip,
  Alert,
  Tabs,
  List,
  Avatar,
  Badge,
  Timeline,
  Spin,
} from 'antd';
import {
  MessageOutlined,
  UserOutlined,
  CheckCircleOutlined,
  RobotOutlined,
  BarChartOutlined,
  GlobalOutlined,
  TeamOutlined,
  DollarOutlined,
  RiseOutlined,
  EyeOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const { TabPane } = Tabs;

// 模拟数据
const mockStats = {
  totalConversations: 1248,
  activeConversations: 23,
  totalLeads: 156,
  newLeads: 12,
  conversionRate: 12.5,
  avgResponseTime: 1.2,
  satisfactionScore: 4.8,
  onlineUsers: 856,
  messagesPerMinute: 45,
  systemLoad: 65,
};

const mockChannelData = [
  { name: '抖音', value: 45, color: '#ff6b6b' },
  { name: '快手', value: 30, color: '#4ecdc4' },
  { name: '视频号', value: 20, color: '#45b7d1' },
  { name: '小红书', value: 5, color: '#f9ca24' },
];

const mockTrendData = [
  { time: '00:00', conversations: 12, leads: 3, satisfaction: 4.2 },
  { time: '04:00', conversations: 8, leads: 2, satisfaction: 4.5 },
  { time: '08:00', conversations: 45, leads: 8, satisfaction: 4.3 },
  { time: '12:00', conversations: 78, leads: 15, satisfaction: 4.7 },
  { time: '16:00', conversations: 92, leads: 18, satisfaction: 4.6 },
  { time: '20:00', conversations: 65, leads: 12, satisfaction: 4.4 },
];

const mockChannelPerformance = [
  { channel: '抖音', messages: 450, leads: 45, conversion: 10.0 },
  { channel: '快手', messages: 320, leads: 28, conversion: 8.8 },
  { channel: '视频号', messages: 280, leads: 22, conversion: 7.9 },
  { channel: '小红书', messages: 198, leads: 15, conversion: 7.6 },
];

const mockSatisfactionData = [
  { name: '非常满意', value: 45, color: '#52c41a' },
  { name: '满意', value: 35, color: '#1890ff' },
  { name: '一般', value: 15, color: '#fa8c16' },
  { name: '不满意', value: 5, color: '#ff4d4f' },
];

const mockAgentPerformance = [
  { agent: '客服小王', conversations: 45, satisfaction: 4.8, responseTime: 1.2 },
  { agent: '客服小李', conversations: 38, satisfaction: 4.6, responseTime: 1.5 },
  { agent: '客服小张', conversations: 42, satisfaction: 4.7, responseTime: 1.3 },
  { agent: 'AI助手', conversations: 156, satisfaction: 4.5, responseTime: 0.8 },
];

const mockRadarData = [
  { subject: '响应速度', A: 120, B: 110, fullMark: 150 },
  { subject: '准确率', A: 98, B: 130, fullMark: 150 },
  { subject: '满意度', A: 86, B: 130, fullMark: 150 },
  { subject: '转化率', A: 99, B: 100, fullMark: 150 },
  { subject: '覆盖率', A: 85, B: 90, fullMark: 150 },
];

const mockRecentConversations = [
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
];

const mockSystemAlerts = [
  {
    type: 'warning',
    title: '抖音渠道连接异常',
    description: '检测到抖音API响应超时，请检查网络连接',
    time: '5分钟前',
  },
  {
    type: 'info',
    title: '系统更新完成',
    description: 'AI模型已更新至最新版本，响应速度提升20%',
    time: '1小时前',
  },
  {
    type: 'success',
    title: '新线索分配成功',
    description: '12个新线索已自动分配给销售团队',
    time: '2小时前',
  },
];

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(mockStats);
  const [recentConversations, setRecentConversations] = useState(mockRecentConversations);
  const [channelStats, setChannelStats] = useState(mockChannelData);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadRealtimeData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 调用真实API
      const [dashboardRes, conversationsRes, channelsRes] = await Promise.all([
        fetch('/api/analytics/dashboard').then(res => res.json()),
        fetch('/api/conversations/data').then(res => res.json()),
        fetch('/api/channels/data').then(res => res.json()),
      ]);

      if (dashboardRes.success) {
        setStats(dashboardRes.data);
      }
      if (conversationsRes.success) {
        setRecentConversations(conversationsRes.data.conversations);
      }
      if (channelsRes.success) {
        // 转换渠道数据格式
        const channelData = channelsRes.data.channels.map((channel: any) => ({
          name: channel.name,
          value: Math.round((channel.messages / channelsRes.data.totalMessages) * 100),
          color: channel.status === 'connected' ? '#52c41a' : 
                 channel.status === 'warning' ? '#fa8c16' : '#ff4d4f'
        }));
        setChannelStats(channelData);
      }
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
      // 如果API调用失败，使用模拟数据
      setStats(mockStats);
      setRecentConversations(mockRecentConversations);
      setChannelStats(mockChannelData);
    } finally {
      setLoading(false);
    }
  };

  const loadRealtimeData = async () => {
    try {
      // 调用真实API获取实时数据
      const response = await fetch('/api/analytics/realtime');
      const result = await response.json();
      
      if (result.success) {
        setStats(prev => ({
          ...prev,
          onlineUsers: result.data.onlineUsers,
          activeConversations: result.data.activeConversations,
          messagesPerMinute: result.data.messagesPerMinute,
          systemLoad: result.data.systemLoad,
        }));
      }
    } catch (error) {
      console.error('加载实时数据失败:', error);
      // 如果API调用失败，使用模拟数据
      setStats(prev => ({
        ...prev,
        onlineUsers: Math.floor(Math.random() * 1000) + 500,
        activeConversations: Math.floor(Math.random() * 50) + 10,
        messagesPerMinute: Math.floor(Math.random() * 100) + 20,
        systemLoad: Math.floor(Math.random() * 40) + 30,
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'processing';
      case 'waiting': return 'warning';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const conversationColumns = [
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (text: string, record: any) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>{text}</span>
          <Tag color={getPriorityColor(record.priority)}>
            {record.priority === 'high' ? '高' : record.priority === 'medium' ? '中' : '低'}
          </Tag>
        </Space>
      ),
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      render: (channel: string) => <Tag color="blue">{channel}</Tag>,
    },
    {
      title: '最新消息',
      dataIndex: 'lastMessage',
      key: 'lastMessage',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge status={getStatusColor(status)} text={
          status === 'active' ? '进行中' : 
          status === 'waiting' ? '等待中' : '已结束'
        } />
      ),
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => (
        <Space>
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">回复</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题和操作 */}
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              <ThunderboltOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              实时仪表盘
            </h1>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
              全域获客智能客服系统 - 实时监控与数据分析
            </p>
          </Col>
          <Col>
            <Space>
              <Button icon={<ClockCircleOutlined />}>刷新数据</Button>
              <Button type="primary" icon={<BarChartOutlined />}>导出报告</Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 系统告警 */}
      <Alert
        message="系统状态"
        description={
          <Timeline>
            {mockSystemAlerts.map((alert, index) => (
              <Timeline.Item
                key={index}
                color={alert.type === 'warning' ? 'orange' : alert.type === 'error' ? 'red' : 'green'}
              >
                <strong>{alert.title}</strong> - {alert.description}
                <span style={{ color: '#999', marginLeft: '8px' }}>({alert.time})</span>
              </Timeline.Item>
            ))}
          </Timeline>
        }
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      {/* 核心指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总对话数"
              value={stats.totalConversations}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix="次"
            />
            <div style={{ marginTop: '8px' }}>
              <span style={{ color: '#52c41a' }}>
                <RiseOutlined /> +12.5%
              </span>
              <span style={{ color: '#999', marginLeft: '8px' }}>较昨日</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="进行中对话"
              value={stats.activeConversations}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix="个"
            />
            <div style={{ marginTop: '8px' }}>
              <Progress 
                percent={Math.round((stats.activeConversations / 50) * 100)} 
                size="small" 
                showInfo={false}
                strokeColor="#52c41a"
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总线索数"
              value={stats.totalLeads}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix="个"
            />
            <div style={{ marginTop: '8px' }}>
              <span style={{ color: '#52c41a' }}>
                <RiseOutlined /> +{stats.newLeads}
              </span>
              <span style={{ color: '#999', marginLeft: '8px' }}>今日新增</span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="转化率"
              value={stats.conversionRate}
              suffix="%"
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Progress 
                percent={stats.conversionRate} 
                size="small" 
                showInfo={false}
                strokeColor="#722ed1"
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 实时数据卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="在线用户"
              value={stats.onlineUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#13c2c2' }}
              suffix="人"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="消息/分钟"
              value={stats.messagesPerMinute}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              suffix="条"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="平均响应时间"
              value={stats.avgResponseTime}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#eb2f96' }}
              suffix="秒"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="系统负载"
              value={stats.systemLoad}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: stats.systemLoad > 80 ? '#ff4d4f' : '#52c41a' }}
              suffix="%"
            />
            <div style={{ marginTop: '8px' }}>
              <Progress 
                percent={stats.systemLoad} 
                size="small" 
                showInfo={false}
                strokeColor={stats.systemLoad > 80 ? '#ff4d4f' : '#52c41a'}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card title="对话趋势分析" extra={<Button type="link">详细分析</Button>}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <RechartsTooltip />
                <Area 
                  type="monotone" 
                  dataKey="conversations" 
                  stackId="1"
                  stroke="#1890ff" 
                  fill="#1890ff"
                  fillOpacity={0.6}
                  name="对话数"
                />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stackId="2"
                  stroke="#52c41a" 
                  fill="#52c41a"
                  fillOpacity={0.6}
                  name="线索数"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="渠道分布" extra={<Button type="link">查看详情</Button>}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockChannelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockChannelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '16px' }}>
              {mockChannelData.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <div 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: item.color, 
                      marginRight: '8px',
                      borderRadius: '2px'
                    }} 
                  />
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 新增图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="渠道绩效对比" extra={<Button type="link">详细分析</Button>}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockChannelPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="messages" fill="#1890ff" name="消息数" />
                <Bar dataKey="leads" fill="#52c41a" name="线索数" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="客户满意度分布" extra={<Button type="link">查看详情</Button>}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockSatisfactionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockSatisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '16px' }}>
              {mockSatisfactionData.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <div 
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: item.color, 
                      marginRight: '8px',
                      borderRadius: '2px'
                    }} 
                  />
                  <span>{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 客服绩效和雷达图 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="客服绩效排行" extra={<Button type="link">详细分析</Button>}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAgentPerformance} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="agent" type="category" />
                <RechartsTooltip />
                <Bar dataKey="conversations" fill="#1890ff" name="对话数" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="系统性能雷达图" extra={<Button type="link">查看详情</Button>}>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={mockRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 150]} />
                <Radar name="当前" dataKey="A" stroke="#1890ff" fill="#1890ff" fillOpacity={0.6} />
                <Radar name="目标" dataKey="B" stroke="#52c41a" fill="#52c41a" fillOpacity={0.6} />
                <RechartsTooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* 最近对话和系统状态 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title="最近对话" 
            extra={
              <Space>
                <Button type="link">查看全部</Button>
                <Button type="primary" size="small">新建对话</Button>
              </Space>
            }
          >
            <Table
              columns={conversationColumns}
              dataSource={recentConversations}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="系统状态" extra={<Button type="link">监控中心</Button>}>
            <List
              dataSource={[
                { name: '抖音渠道', status: 'normal', uptime: '99.9%' },
                { name: '快手渠道', status: 'normal', uptime: '99.8%' },
                { name: '视频号渠道', status: 'warning', uptime: '95.2%' },
                { name: 'AI引擎', status: 'normal', uptime: '99.9%' },
                { name: '数据库', status: 'normal', uptime: '99.9%' },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <span>{item.name}</span>
                        <Badge 
                          status={item.status === 'normal' ? 'success' : 'warning'} 
                          text={item.status === 'normal' ? '正常' : '异常'}
                        />
                      </Space>
                    }
                    description={`运行时间: ${item.uptime}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;