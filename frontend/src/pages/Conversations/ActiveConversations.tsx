import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  List,
  Avatar,
  Badge,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Tooltip,
  Modal,
  Form,
  message,
  Tabs,
  Divider,
  Typography,
  Rate,
  Progress,
  Statistic,
  Alert,
  Drawer,
  Switch,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  MessageOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MoreOutlined,
  SendOutlined,
  SmileOutlined,
  PaperClipOutlined,
  RobotOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 模拟数据
const mockConversations = [
  {
    id: '1',
    user: {
      name: '张先生',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
      phone: '138****8888',
      email: 'zhang@example.com',
      source: '抖音',
      location: '北京市朝阳区',
    },
    lastMessage: {
      content: '请问你们的产品价格是多少？我想了解一下具体的报价。',
      time: '2分钟前',
      type: 'text',
      isFromUser: true,
    },
    status: 'active',
    priority: 'high',
    assignedTo: '客服小王',
    tags: ['价格咨询', '潜在客户'],
    duration: '15分钟',
    messageCount: 8,
    satisfaction: null,
    aiAssistance: true,
  },
  {
    id: '2',
    user: {
      name: '李女士',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
      phone: '139****9999',
      email: 'li@example.com',
      source: '快手',
      location: '上海市浦东新区',
    },
    lastMessage: {
      content: '我想了解一下售后服务，包括保修期和维修流程。',
      time: '5分钟前',
      type: 'text',
      isFromUser: true,
    },
    status: 'waiting',
    priority: 'medium',
    assignedTo: null,
    tags: ['售后服务', '咨询'],
    duration: '8分钟',
    messageCount: 5,
    satisfaction: null,
    aiAssistance: false,
  },
  {
    id: '3',
    user: {
      name: '王总',
      avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
      phone: '137****7777',
      email: 'wang@example.com',
      source: '视频号',
      location: '广州市天河区',
    },
    lastMessage: {
      content: '好的，我考虑一下，稍后联系您。',
      time: '10分钟前',
      type: 'text',
      isFromUser: true,
    },
    status: 'closed',
    priority: 'low',
    assignedTo: '客服小李',
    tags: ['已成交', 'VIP客户'],
    duration: '45分钟',
    messageCount: 23,
    satisfaction: 5,
    aiAssistance: true,
  },
];

const mockMessages = [
  {
    id: '1',
    content: '您好，欢迎咨询我们的产品！请问有什么可以帮助您的吗？',
    time: '2024-01-15 14:00:00',
    isFromUser: false,
    sender: 'AI助手',
    type: 'text',
  },
  {
    id: '2',
    content: '请问你们的产品价格是多少？',
    time: '2024-01-15 14:01:00',
    isFromUser: true,
    sender: '张先生',
    type: 'text',
  },
  {
    id: '3',
    content: '我们的产品价格根据配置不同有所差异，基础版是2999元，专业版是5999元，企业版是9999元。您比较倾向于哪个版本呢？',
    time: '2024-01-15 14:01:30',
    isFromUser: false,
    sender: 'AI助手',
    type: 'text',
  },
  {
    id: '4',
    content: '我想了解一下具体的报价。',
    time: '2024-01-15 14:02:00',
    isFromUser: true,
    sender: '张先生',
    type: 'text',
  },
];

const ActiveConversations: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState(mockMessages);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [replyForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConversations(mockConversations);
    } catch (error) {
      message.error('加载对话列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversation: any) => {
    setSelectedConversation(conversation);
    // 加载该对话的消息
    setMessages(mockMessages);
  };

  const handleReply = async (values: any) => {
    try {
      // 模拟发送回复
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('回复发送成功');
      setReplyModalVisible(false);
      replyForm.resetFields();
    } catch (error) {
      message.error('回复发送失败');
    }
  };

  const handleCloseConversation = async (conversationId: string) => {
    try {
      // 模拟关闭对话
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, status: 'closed' }
            : conv
        )
      );
      message.success('对话已关闭');
    } catch (error) {
      message.error('关闭对话失败');
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '进行中';
      case 'waiting': return '等待中';
      case 'closed': return '已结束';
      default: return '未知';
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

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '未知';
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         conv.lastMessage.content.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || conv.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || conv.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题和统计 */}
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              <MessageOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              进行中对话
            </h1>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
              管理所有进行中的客户对话，提供实时客服支持
            </p>
          </Col>
          <Col>
            <Space>
              <Button icon={<ThunderboltOutlined />}>AI助手</Button>
              <Button type="primary" icon={<MessageOutlined />}>新建对话</Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="总对话数"
              value={conversations.length}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="进行中"
              value={conversations.filter(c => c.status === 'active').length}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="等待中"
              value={conversations.filter(c => c.status === 'waiting').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="平均满意度"
              value={4.2}
              prefix={<Rate disabled defaultValue={4} />}
              valueStyle={{ color: '#722ed1' }}
              suffix="/5"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 对话列表 */}
        <Col xs={24} lg={8}>
          <Card 
            title="对话列表" 
            extra={
              <Space>
                <Input
                  placeholder="搜索对话..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 200 }}
                />
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: 100 }}
                >
                  <Option value="all">全部</Option>
                  <Option value="active">进行中</Option>
                  <Option value="waiting">等待中</Option>
                  <Option value="closed">已结束</Option>
                </Select>
                <Select
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  style={{ width: 100 }}
                >
                  <Option value="all">优先级</Option>
                  <Option value="high">高</Option>
                  <Option value="medium">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Space>
            }
          >
            <List
              dataSource={filteredConversations}
              loading={loading}
              renderItem={(conversation) => (
                <List.Item
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedConversation?.id === conversation.id ? '#f0f8ff' : 'transparent',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '8px',
                  }}
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        dot={conversation.status === 'active'} 
                        color={conversation.status === 'active' ? '#52c41a' : '#999'}
                      >
                        <Avatar src={conversation.user.avatar} icon={<UserOutlined />} />
                      </Badge>
                    }
                    title={
                      <Space>
                        <span>{conversation.user.name}</span>
                        <Tag color={getPriorityColor(conversation.priority)}>
                          {getPriorityText(conversation.priority)}
                        </Tag>
                        <Badge 
                          status={getStatusColor(conversation.status)} 
                          text={getStatusText(conversation.status)} 
                        />
                      </Space>
                    }
                    description={
                      <div>
                        <Paragraph 
                          ellipsis={{ rows: 2 }} 
                          style={{ margin: 0, color: '#666' }}
                        >
                          {conversation.lastMessage.content}
                        </Paragraph>
                        <div style={{ marginTop: '4px' }}>
                          <Space size="small">
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {conversation.lastMessage.time}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {conversation.messageCount}条消息
                            </Text>
                            {conversation.aiAssistance && (
                              <Tag color="blue">AI</Tag>
                            )}
                          </Space>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 对话详情 */}
        <Col xs={24} lg={16}>
          {selectedConversation ? (
            <Card
              title={
                <Space>
                  <Avatar src={selectedConversation.user.avatar} icon={<UserOutlined />} />
                  <span>{selectedConversation.user.name}</span>
                  <Tag color={getPriorityColor(selectedConversation.priority)}>
                    {getPriorityText(selectedConversation.priority)}
                  </Tag>
                  <Badge 
                    status={getStatusColor(selectedConversation.status)} 
                    text={getStatusText(selectedConversation.status)} 
                  />
                </Space>
              }
              extra={
                <Space>
                  <Button 
                    type="link" 
                    icon={<PhoneOutlined />}
                    onClick={() => message.info('拨号功能待实现')}
                  >
                    拨号
                  </Button>
                  <Button 
                    type="link" 
                    icon={<EditOutlined />}
                    onClick={() => message.info('编辑功能待实现')}
                  >
                    编辑
                  </Button>
                  <Button 
                    type="link" 
                    icon={<CloseCircleOutlined />}
                    onClick={() => handleCloseConversation(selectedConversation.id)}
                  >
                    关闭
                  </Button>
                </Space>
              }
            >
              <Tabs defaultActiveKey="messages">
                <TabPane tab="消息记录" key="messages">
                  <div style={{ height: '400px', overflowY: 'auto', padding: '16px 0' }}>
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        style={{
                          display: 'flex',
                          justifyContent: message.isFromUser ? 'flex-end' : 'flex-start',
                          marginBottom: '16px',
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '70%',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            backgroundColor: message.isFromUser ? '#1890ff' : '#f5f5f5',
                            color: message.isFromUser ? '#fff' : '#000',
                          }}
                        >
                          <div style={{ marginBottom: '4px' }}>
                            <Text 
                              style={{ 
                                fontSize: '12px', 
                                color: message.isFromUser ? '#fff' : '#999' 
                              }}
                            >
                              {message.sender} · {message.time}
                            </Text>
                          </div>
                          <div>{message.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Divider />
                  
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      placeholder="输入回复内容..."
                      onPressEnter={() => setReplyModalVisible(true)}
                    />
                    <Button 
                      type="primary" 
                      icon={<SendOutlined />}
                      onClick={() => setReplyModalVisible(true)}
                    >
                      发送
                    </Button>
                  </Space.Compact>
                </TabPane>
                
                <TabPane tab="客户信息" key="customer">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div>
                        <strong>姓名:</strong> {selectedConversation.user.name}
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <strong>电话:</strong> {selectedConversation.user.phone}
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <strong>邮箱:</strong> {selectedConversation.user.email}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div>
                        <strong>来源渠道:</strong> 
                        <Tag color="blue" style={{ marginLeft: '8px' }}>
                          {selectedConversation.user.source}
                        </Tag>
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <strong>地区:</strong> {selectedConversation.user.location}
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <strong>标签:</strong>
                        <Space style={{ marginLeft: '8px' }}>
                          {selectedConversation.tags.map((tag: string, index: number) => (
                            <Tag key={index} color="green">{tag}</Tag>
                          ))}
                        </Space>
                      </div>
                    </Col>
                  </Row>
                  
                  <Divider />
                  
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Statistic
                        title="对话时长"
                        value={selectedConversation.duration}
                        prefix={<ClockCircleOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="消息数量"
                        value={selectedConversation.messageCount}
                        prefix={<MessageOutlined />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="满意度"
                        value={selectedConversation.satisfaction || '未评价'}
                        prefix={<Rate disabled defaultValue={selectedConversation.satisfaction || 0} />}
                      />
                    </Col>
                  </Row>
                </TabPane>
                
                <TabPane tab="AI助手" key="ai">
                  <Alert
                    message="AI智能助手"
                    description="AI助手正在帮助您分析对话内容，提供智能回复建议和客户情绪分析。"
                    type="info"
                    showIcon
                    style={{ marginBottom: '16px' }}
                  />
                  
                  <div style={{ marginBottom: '16px' }}>
                    <h4>智能回复建议:</h4>
                    <Card size="small">
                      <p>根据客户询问的产品价格问题，建议回复：</p>
                      <p style={{ color: '#1890ff', fontStyle: 'italic' }}>
                        "感谢您的咨询！我们的产品价格根据配置不同有所差异，基础版2999元，专业版5999元，企业版9999元。我可以为您详细介绍各版本的功能特点，帮助您选择最适合的方案。"
                      </p>
                    </Card>
                  </div>
                  
                  <div>
                    <h4>客户情绪分析:</h4>
                    <Space>
                      <Tag color="green">积极</Tag>
                      <Tag color="blue">理性</Tag>
                      <Tag color="orange">谨慎</Tag>
                    </Space>
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          ) : (
            <Card style={{ textAlign: 'center', padding: '60px 0' }}>
              <MessageOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
              <p style={{ color: '#999', fontSize: '16px' }}>请选择一个对话查看详情</p>
            </Card>
          )}
        </Col>
      </Row>

      {/* 回复弹窗 */}
      <Modal
        title="发送回复"
        open={replyModalVisible}
        onCancel={() => setReplyModalVisible(false)}
        onOk={() => replyForm.submit()}
        width={600}
      >
        <Form
          form={replyForm}
          layout="vertical"
          onFinish={handleReply}
        >
          <Form.Item
            name="content"
            label="回复内容"
            rules={[{ required: true, message: '请输入回复内容' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入回复内容..."
            />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="回复类型"
            initialValue="text"
          >
            <Select>
              <Option value="text">文本</Option>
              <Option value="image">图片</Option>
              <Option value="file">文件</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="aiAssistance"
            label="AI辅助"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ActiveConversations;
