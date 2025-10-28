import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Tag,
  Space,
  message,
  Popconfirm,
  Tabs,
  List,
  Progress,
  Statistic,
  Alert,
  Tooltip,
  Divider,
  Typography,
  Badge,
  Avatar,
  Rate,
  Drawer,
  Timeline,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  UserOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  ExportOutlined,
  ImportOutlined,
  FilterOutlined,
  SearchOutlined,
  CalendarOutlined,
  GlobalOutlined,
  DollarOutlined,
  StarOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// 模拟数据
const mockLeads = [
  {
    id: '1',
    name: '张先生',
    company: '北京科技有限公司',
    position: '技术总监',
    phone: '138****8888',
    email: 'zhang@example.com',
    source: '抖音',
    status: 'new',
    priority: 'high',
    assignedTo: '销售小王',
    value: 50000,
    probability: 0.8,
    lastContact: '2024-01-15 14:30:25',
    nextFollowUp: '2024-01-16 10:00:00',
    tags: ['潜在客户', '高价值', '技术背景'],
    notes: '对产品功能很感兴趣，需要详细演示',
    conversationCount: 5,
    satisfaction: 4.5,
    location: '北京市朝阳区',
    industry: '互联网',
    createdAt: '2024-01-10 09:15:30',
  },
  {
    id: '2',
    name: '李女士',
    company: '上海贸易有限公司',
    position: '采购经理',
    phone: '139****9999',
    email: 'li@example.com',
    source: '快手',
    status: 'contacted',
    priority: 'medium',
    assignedTo: '销售小李',
    value: 30000,
    probability: 0.6,
    lastContact: '2024-01-14 16:20:15',
    nextFollowUp: '2024-01-17 14:00:00',
    tags: ['已联系', '价格敏感', '决策者'],
    notes: '比较关注价格，需要提供详细报价',
    conversationCount: 3,
    satisfaction: 4.0,
    location: '上海市浦东新区',
    industry: '贸易',
    createdAt: '2024-01-08 11:30:45',
  },
  {
    id: '3',
    name: '王总',
    company: '广州制造有限公司',
    position: '总经理',
    phone: '137****7777',
    email: 'wang@example.com',
    source: '视频号',
    status: 'qualified',
    priority: 'high',
    assignedTo: '销售经理',
    value: 100000,
    probability: 0.9,
    lastContact: '2024-01-15 10:15:20',
    nextFollowUp: '2024-01-18 09:30:00',
    tags: ['已确认', 'VIP客户', '大单'],
    notes: '已确认需求，准备签约',
    conversationCount: 8,
    satisfaction: 5.0,
    location: '广州市天河区',
    industry: '制造业',
    createdAt: '2024-01-05 14:20:10',
  },
  {
    id: '4',
    name: '赵女士',
    company: '深圳创新科技有限公司',
    position: '产品经理',
    phone: '136****6666',
    email: 'zhao@example.com',
    source: '小红书',
    status: 'lost',
    priority: 'low',
    assignedTo: '未分配',
    value: 20000,
    probability: 0.1,
    lastContact: '2024-01-12 15:45:30',
    nextFollowUp: null,
    tags: ['已流失', '预算不足', '竞品选择'],
    notes: '选择了竞品，预算有限',
    conversationCount: 2,
    satisfaction: 3.0,
    location: '深圳市南山区',
    industry: '科技',
    createdAt: '2024-01-03 16:10:25',
  },
];

const mockFollowUpHistory = [
  {
    id: '1',
    leadId: '1',
    type: 'call',
    content: '电话沟通产品功能，客户很感兴趣',
    user: '销售小王',
    time: '2024-01-15 14:30:25',
    result: 'positive',
  },
  {
    id: '2',
    leadId: '1',
    type: 'email',
    content: '发送产品资料和演示视频',
    user: '销售小王',
    time: '2024-01-15 15:00:00',
    result: 'sent',
  },
  {
    id: '3',
    leadId: '1',
    type: 'meeting',
    content: '安排产品演示会议',
    user: '销售小王',
    time: '2024-01-16 10:00:00',
    result: 'scheduled',
  },
];

const LeadsList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState(mockLeads);
  const [followUpHistory, setFollowUpHistory] = useState(mockFollowUpHistory);
  const [leadModalVisible, setLeadModalVisible] = useState(false);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [leadForm] = Form.useForm();
  const [followUpForm] = Form.useForm();
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      // 调用真实API
      const response = await fetch('/api/leads/data');
      const result = await response.json();
      
      if (result.success) {
        setLeads(result.data.leads);
        // 保持跟进历史为模拟数据
        setFollowUpHistory(mockFollowUpHistory);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('加载线索数据失败:', error);
      message.error('加载线索数据失败');
      // 如果API调用失败，使用模拟数据
      setLeads(mockLeads);
      setFollowUpHistory(mockFollowUpHistory);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (values: any) => {
    try {
      // 模拟创建线索
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newLead = {
        id: Date.now().toString(),
        ...values,
        status: 'new',
        probability: 0.5,
        conversationCount: 0,
        satisfaction: 0,
        createdAt: new Date().toLocaleString(),
      };
      setLeads([...leads, newLead]);
      setLeadModalVisible(false);
      leadForm.resetFields();
      message.success('线索创建成功');
    } catch (error) {
      message.error('创建线索失败');
    }
  };

  const handleUpdateLead = async (values: any) => {
    try {
      // 模拟更新线索
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLeads(leads.map(lead => 
        lead.id === selectedLead.id 
          ? { ...lead, ...values }
          : lead
      ));
      setLeadModalVisible(false);
      setSelectedLead(null);
      leadForm.resetFields();
      message.success('线索更新成功');
    } catch (error) {
      message.error('更新线索失败');
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      // 模拟删除线索
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLeads(leads.filter(lead => lead.id !== leadId));
      message.success('线索删除成功');
    } catch (error) {
      message.error('删除线索失败');
    }
  };

  const handleAssignLead = async (leadId: string, assignee: string) => {
    try {
      // 模拟分配线索
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLeads(prevLeads => prevLeads.map(lead => 
        lead.id === leadId 
          ? { ...lead, assignedTo: assignee, status: 'contacted' }
          : lead
      ));
      message.success('线索分配成功');
    } catch (error) {
      message.error('分配线索失败');
    }
  };

  const getStatusColor = (status: string): "success" | "error" | "default" | "processing" | "warning" | undefined => {
    switch (status) {
      case 'new': return 'processing';
      case 'contacted': return 'warning';
      case 'qualified': return 'success';
      case 'proposal': return 'processing';
      case 'negotiation': return 'warning';
      case 'closed-won': return 'success';
      case 'closed-lost': return 'error';
      case 'lost': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return '新线索';
      case 'contacted': return '已联系';
      case 'qualified': return '已确认';
      case 'proposal': return '提案中';
      case 'negotiation': return '谈判中';
      case 'closed-won': return '已成交';
      case 'closed-lost': return '已流失';
      case 'lost': return '已丢失';
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

  const getFollowUpTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <PhoneOutlined />;
      case 'email': return <MailOutlined />;
      case 'meeting': return <CalendarOutlined />;
      case 'message': return <MessageOutlined />;
      default: return <InfoCircleOutlined />;
    }
  };

  const getFollowUpTypeText = (type: string) => {
    switch (type) {
      case 'call': return '电话';
      case 'email': return '邮件';
      case 'meeting': return '会议';
      case 'message': return '消息';
      default: return '其他';
    }
  };

  const leadColumns = [
    {
      title: '线索信息',
      key: 'leadInfo',
      render: (record: any) => (
        <Space>
          <Avatar size="large" icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{record.name}</div>
            <div style={{ color: '#666', fontSize: '12px' }}>{record.company}</div>
            <div style={{ color: '#999', fontSize: '12px' }}>{record.position}</div>
          </div>
        </Space>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (record: any) => (
        <div>
          <div><PhoneOutlined /> {record.phone}</div>
          <div><MailOutlined /> {record.email}</div>
          <div><GlobalOutlined /> {record.location}</div>
        </div>
      ),
    },
    {
      title: '来源渠道',
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => <Tag color="blue">{source}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={getStatusColor(status)} 
          text={getStatusText(status)} 
        />
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {getPriorityText(priority)}
        </Tag>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo: string) => assignedTo || <Text type="secondary">未分配</Text>,
    },
    {
      title: '价值',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => (
        <Space>
          <DollarOutlined />
          <span style={{ fontWeight: 'bold' }}>¥{value.toLocaleString()}</span>
        </Space>
      ),
    },
    {
      title: '成交概率',
      dataIndex: 'probability',
      key: 'probability',
      render: (probability: number) => (
        <div>
          <Progress 
            percent={Math.round(probability * 100)} 
            size="small" 
            showInfo={false}
            strokeColor={probability > 0.8 ? '#52c41a' : probability > 0.5 ? '#fa8c16' : '#ff4d4f'}
          />
          <Text style={{ fontSize: '12px' }}>
            {Math.round(probability * 100)}%
          </Text>
        </div>
      ),
    },
    {
      title: '最后联系',
      dataIndex: 'lastContact',
      key: 'lastContact',
      render: (time: string) => <Text type="secondary">{time}</Text>,
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedLead(record);
              setDetailDrawerVisible(true);
            }}
          >
            查看
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedLead(record);
              leadForm.setFieldsValue(record);
              setLeadModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<MessageOutlined />}
            onClick={() => {
              setSelectedLead(record);
              setFollowUpModalVisible(true);
            }}
          >
            跟进
          </Button>
          <Popconfirm
            title="确定要删除这个线索吗？"
            onConfirm={() => handleDeleteLead(record.id)}
          >
            <Button type="link" size="small" icon={<DeleteOutlined />} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchText.toLowerCase()) ||
                         lead.phone.includes(searchText);
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesSource;
  });

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题和操作 */}
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              <TeamOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              线索列表
            </h1>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
              管理所有销售线索，跟踪转化进度和跟进记录
            </p>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={loadLeads}>
                刷新
              </Button>
              <Button icon={<ImportOutlined />}>导入</Button>
              <Button icon={<ExportOutlined />}>导出</Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setSelectedLead(null);
                  leadForm.resetFields();
                  setLeadModalVisible(true);
                }}
              >
                新建线索
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="总线索数"
              value={leads.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="新线索"
              value={leads.filter(l => l.status === 'new').length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="已确认"
              value={leads.filter(l => l.status === 'qualified').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="总价值"
              value={leads.reduce((acc, lead) => acc + lead.value, 0)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              formatter={(value) => `¥${value.toLocaleString()}`}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Input
              placeholder="搜索姓名、公司或电话..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Select
              placeholder="状态"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">全部状态</Option>
              <Option value="new">新线索</Option>
              <Option value="contacted">已联系</Option>
              <Option value="qualified">已确认</Option>
              <Option value="proposal">提案中</Option>
              <Option value="negotiation">谈判中</Option>
              <Option value="closed-won">已成交</Option>
              <Option value="closed-lost">已流失</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Select
              placeholder="优先级"
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">全部优先级</Option>
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={4}>
            <Select
              placeholder="来源渠道"
              value={sourceFilter}
              onChange={setSourceFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">全部渠道</Option>
              <Option value="抖音">抖音</Option>
              <Option value="快手">快手</Option>
              <Option value="视频号">视频号</Option>
              <Option value="小红书">小红书</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Space>
              <Button icon={<FilterOutlined />}>高级筛选</Button>
              <Button icon={<ThunderboltOutlined />}>批量操作</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 线索列表 */}
      <Card title="线索列表">
        <Table
          columns={leadColumns}
          dataSource={filteredLeads}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 线索详情抽屉 */}
      <Drawer
        title="线索详情"
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {selectedLead && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col span={24}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar size={80} icon={<UserOutlined />} />
                  <h2 style={{ margin: '16px 0 8px 0' }}>{selectedLead.name}</h2>
                  <p style={{ color: '#666', margin: 0 }}>{selectedLead.company}</p>
                  <p style={{ color: '#999', margin: 0 }}>{selectedLead.position}</p>
                </div>
              </Col>
            </Row>

            <Tabs defaultActiveKey="basic">
              <TabPane tab="基本信息" key="basic">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div><strong>电话:</strong> {selectedLead.phone}</div>
                    <div style={{ marginTop: '8px' }}><strong>邮箱:</strong> {selectedLead.email}</div>
                    <div style={{ marginTop: '8px' }}><strong>地区:</strong> {selectedLead.location}</div>
                  </Col>
                  <Col span={12}>
                    <div><strong>来源:</strong> <Tag color="blue">{selectedLead.source}</Tag></div>
                    <div style={{ marginTop: '8px' }}><strong>行业:</strong> {selectedLead.industry}</div>
                    <div style={{ marginTop: '8px' }}><strong>创建时间:</strong> {selectedLead.createdAt}</div>
                  </Col>
                </Row>
                
                <Divider />
                
                <div>
                  <strong>标签:</strong>
                  <div style={{ marginTop: '8px' }}>
                    {selectedLead.tags.map((tag: string, index: number) => (
                      <Tag key={index} color="green" style={{ marginBottom: '4px' }}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
                
                <Divider />
                
                <div>
                  <strong>备注:</strong>
                  <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    {selectedLead.notes}
                  </div>
                </div>
              </TabPane>
              
              <TabPane tab="跟进记录" key="followup">
                <Timeline>
                  {followUpHistory
                    .filter(record => record.leadId === selectedLead.id)
                    .map((record) => (
                      <Timeline.Item
                        key={record.id}
                        dot={getFollowUpTypeIcon(record.type)}
                      >
                        <div>
                          <div style={{ fontWeight: 'bold' }}>
                            {getFollowUpTypeText(record.type)} - {record.user}
                          </div>
                          <div style={{ color: '#666', marginTop: '4px' }}>
                            {record.content}
                          </div>
                          <div style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>
                            {record.time}
                          </div>
                        </div>
                      </Timeline.Item>
                    ))}
                </Timeline>
              </TabPane>
              
              <TabPane tab="统计信息" key="stats">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic
                      title="线索价值"
                      value={selectedLead.value}
                      prefix={<DollarOutlined />}
                      formatter={(value) => `¥${value.toLocaleString()}`}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="成交概率"
                      value={Math.round(selectedLead.probability * 100)}
                      suffix="%"
                      prefix={<ThunderboltOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="对话次数"
                      value={selectedLead.conversationCount}
                      prefix={<MessageOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="满意度"
                      value={selectedLead.satisfaction}
                      prefix={<StarOutlined />}
                      suffix="/5"
                    />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        )}
      </Drawer>

      {/* 线索编辑弹窗 */}
      <Modal
        title={selectedLead ? '编辑线索' : '新建线索'}
        open={leadModalVisible}
        onCancel={() => {
          setLeadModalVisible(false);
          setSelectedLead(null);
          leadForm.resetFields();
        }}
        onOk={() => leadForm.submit()}
        width={800}
      >
        <Form
          form={leadForm}
          layout="vertical"
          onFinish={selectedLead ? handleUpdateLead : handleCreateLead}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="姓名"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder="请输入姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="company"
                label="公司"
                rules={[{ required: true, message: '请输入公司名称' }]}
              >
                <Input placeholder="请输入公司名称" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="电话"
                rules={[{ required: true, message: '请输入电话' }]}
              >
                <Input placeholder="请输入电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[{ required: true, message: '请输入邮箱' }]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="source"
                label="来源渠道"
                rules={[{ required: true, message: '请选择来源渠道' }]}
              >
                <Select placeholder="请选择来源渠道">
                  <Option value="抖音">抖音</Option>
                  <Option value="快手">快手</Option>
                  <Option value="视频号">视频号</Option>
                  <Option value="小红书">小红书</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[{ required: true, message: '请选择优先级' }]}
              >
                <Select placeholder="请选择优先级">
                  <Option value="high">高</Option>
                  <Option value="medium">中</Option>
                  <Option value="low">低</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="notes"
            label="备注"
          >
            <TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 跟进记录弹窗 */}
      <Modal
        title="添加跟进记录"
        open={followUpModalVisible}
        onCancel={() => setFollowUpModalVisible(false)}
        onOk={() => followUpForm.submit()}
        width={600}
      >
        <Form
          form={followUpForm}
          layout="vertical"
          onFinish={(values) => {
            // 处理跟进记录提交
            message.success('跟进记录添加成功');
            setFollowUpModalVisible(false);
            followUpForm.resetFields();
          }}
        >
          <Form.Item
            name="type"
            label="跟进类型"
            rules={[{ required: true, message: '请选择跟进类型' }]}
          >
            <Select placeholder="请选择跟进类型">
              <Option value="call">电话</Option>
              <Option value="email">邮件</Option>
              <Option value="meeting">会议</Option>
              <Option value="message">消息</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="content"
            label="跟进内容"
            rules={[{ required: true, message: '请输入跟进内容' }]}
          >
            <TextArea rows={4} placeholder="请输入跟进内容" />
          </Form.Item>
          
          <Form.Item
            name="nextFollowUp"
            label="下次跟进时间"
          >
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LeadsList;
