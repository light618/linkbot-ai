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
  Switch,
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
  Tree,
  InputNumber,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  EyeOutlined,
  CopyOutlined,
  ExportOutlined,
  ImportOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// 模拟数据
const mockIntents = [
  {
    id: '1',
    name: '价格咨询',
    description: '客户询问产品价格相关信息',
    status: 'active',
    priority: 'high',
    confidence: 0.95,
    trainingCount: 156,
    lastTraining: '2024-01-15 14:30:25',
    keywords: ['价格', '多少钱', '费用', '报价', '成本'],
    responses: [
      '我们的产品价格根据配置不同有所差异，基础版2999元，专业版5999元，企业版9999元。',
      '我可以为您详细介绍各版本的功能特点，帮助您选择最适合的方案。'
    ],
    entities: ['产品类型', '价格范围', '客户类型'],
    tags: ['销售', '价格', '咨询'],
    aiModel: 'GPT-4',
    accuracy: 0.92,
  },
  {
    id: '2',
    name: '售后服务',
    description: '客户咨询售后服务相关问题',
    status: 'active',
    priority: 'medium',
    confidence: 0.88,
    trainingCount: 89,
    lastTraining: '2024-01-15 10:15:30',
    keywords: ['售后', '维修', '保修', '服务', '支持'],
    responses: [
      '我们提供7x24小时售后服务，包括在线技术支持、远程协助和现场服务。',
      '产品保修期为1年，保修期内免费维修，保修期外提供优惠维修服务。'
    ],
    entities: ['服务类型', '保修期', '联系方式'],
    tags: ['售后', '服务', '支持'],
    aiModel: 'GPT-4',
    accuracy: 0.89,
  },
  {
    id: '3',
    name: '产品功能',
    description: '客户了解产品功能特性',
    status: 'active',
    priority: 'medium',
    confidence: 0.91,
    trainingCount: 234,
    lastTraining: '2024-01-14 16:45:12',
    keywords: ['功能', '特性', '特点', '优势', '能力'],
    responses: [
      '我们的产品具有智能分析、自动回复、多渠道接入等核心功能。',
      '支持自定义工作流、数据分析和报表生成等高级功能。'
    ],
    entities: ['功能模块', '技术特性', '应用场景'],
    tags: ['产品', '功能', '介绍'],
    aiModel: 'GPT-4',
    accuracy: 0.91,
  },
  {
    id: '4',
    name: '投诉建议',
    description: '客户投诉或建议处理',
    status: 'inactive',
    priority: 'high',
    confidence: 0.76,
    trainingCount: 45,
    lastTraining: '2024-01-13 09:20:15',
    keywords: ['投诉', '建议', '问题', '不满意', '改进'],
    responses: [
      '非常抱歉给您带来不便，我们会认真处理您的问题。',
      '感谢您的建议，我们会持续改进产品和服务质量。'
    ],
    entities: ['问题类型', '严重程度', '处理方式'],
    tags: ['投诉', '建议', '处理'],
    aiModel: 'GPT-4',
    accuracy: 0.76,
  },
];

const mockTrainingData = [
  {
    id: '1',
    intent: '价格咨询',
    userInput: '你们的产品多少钱？',
    expectedIntent: '价格咨询',
    predictedIntent: '价格咨询',
    confidence: 0.95,
    isCorrect: true,
    timestamp: '2024-01-15 14:30:25',
  },
  {
    id: '2',
    intent: '售后服务',
    userInput: '产品坏了怎么办？',
    expectedIntent: '售后服务',
    predictedIntent: '售后服务',
    confidence: 0.88,
    isCorrect: true,
    timestamp: '2024-01-15 14:25:10',
  },
  {
    id: '3',
    intent: '产品功能',
    userInput: '这个系统有什么功能？',
    expectedIntent: '产品功能',
    predictedIntent: '价格咨询',
    confidence: 0.65,
    isCorrect: false,
    timestamp: '2024-01-15 14:20:35',
  },
];

const IntentsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [intents, setIntents] = useState(mockIntents);
  const [trainingData, setTrainingData] = useState(mockTrainingData);
  const [intentModalVisible, setIntentModalVisible] = useState(false);
  const [trainingModalVisible, setTrainingModalVisible] = useState(false);
  const [intentForm] = Form.useForm();
  const [trainingForm] = Form.useForm();
  const [selectedIntent, setSelectedIntent] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadIntents();
  }, []);

  const loadIntents = async () => {
    setLoading(true);
    try {
      // 调用真实API
      const response = await fetch('/api/ai/intents/data');
      const result = await response.json();
      
      if (result.success) {
        // 转换API数据格式
        const intents = result.data.intents.map((intent: any) => ({
          ...intent,
          description: `${intent.name}相关意图`,
          priority: intent.confidence > 0.9 ? 'high' : intent.confidence > 0.7 ? 'medium' : 'low',
          keywords: [`${intent.name}`, '咨询', '问题'],
          responses: [`关于${intent.name}的回复模板`],
          entities: ['实体1', '实体2'],
          tags: [intent.name, 'AI'],
          aiModel: 'GPT-4',
        }));
        setIntents(intents);
        // 保持训练数据为模拟数据
        setTrainingData(mockTrainingData);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('加载意图数据失败:', error);
      message.error('加载意图数据失败');
      // 如果API调用失败，使用模拟数据
      setIntents(mockIntents);
      setTrainingData(mockTrainingData);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIntent = async (values: any) => {
    try {
      // 模拟创建意图
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newIntent = {
        id: Date.now().toString(),
        ...values,
        status: 'active',
        trainingCount: 0,
        lastTraining: new Date().toLocaleString(),
        accuracy: 0.8,
      };
      setIntents([...intents, newIntent]);
      setIntentModalVisible(false);
      intentForm.resetFields();
      message.success('意图创建成功');
    } catch (error) {
      message.error('创建意图失败');
    }
  };

  const handleUpdateIntent = async (values: any) => {
    try {
      // 模拟更新意图
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIntents(intents.map(intent => 
        intent.id === selectedIntent.id 
          ? { ...intent, ...values }
          : intent
      ));
      setIntentModalVisible(false);
      setSelectedIntent(null);
      intentForm.resetFields();
      message.success('意图更新成功');
    } catch (error) {
      message.error('更新意图失败');
    }
  };

  const handleDeleteIntent = async (intentId: string) => {
    try {
      // 模拟删除意图
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIntents(intents.filter(intent => intent.id !== intentId));
      message.success('意图删除成功');
    } catch (error) {
      message.error('删除意图失败');
    }
  };

  const handleTrainIntent = async (intentId: string) => {
    try {
      setLoading(true);
      // 模拟训练意图
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIntents(intents.map(intent => 
        intent.id === intentId 
          ? { 
              ...intent, 
              trainingCount: intent.trainingCount + 1,
              lastTraining: new Date().toLocaleString(),
              accuracy: Math.min(0.99, intent.accuracy + 0.01)
            }
          : intent
      ));
      message.success('意图训练完成');
    } catch (error) {
      message.error('训练失败');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'training': return 'processing';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '启用';
      case 'inactive': return '禁用';
      case 'training': return '训练中';
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

  const intentColumns = [
    {
      title: '意图名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <RobotOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontWeight: 'bold' }}>{text}</span>
          <Tag color={getPriorityColor(record.priority)}>
            {getPriorityText(record.priority)}
          </Tag>
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => (
        <div>
          <Progress 
            percent={Math.round(confidence * 100)} 
            size="small" 
            showInfo={false}
            strokeColor={confidence > 0.9 ? '#52c41a' : confidence > 0.7 ? '#fa8c16' : '#ff4d4f'}
          />
          <Text style={{ fontSize: '12px' }}>
            {Math.round(confidence * 100)}%
          </Text>
        </div>
      ),
    },
    {
      title: '准确率',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (accuracy: number) => (
        <div>
          <Progress 
            percent={Math.round(accuracy * 100)} 
            size="small" 
            showInfo={false}
            strokeColor={accuracy > 0.9 ? '#52c41a' : accuracy > 0.7 ? '#fa8c16' : '#ff4d4f'}
          />
          <Text style={{ fontSize: '12px' }}>
            {Math.round(accuracy * 100)}%
          </Text>
        </div>
      ),
    },
    {
      title: '训练次数',
      dataIndex: 'trainingCount',
      key: 'trainingCount',
      render: (count: number) => (
        <Space>
          <ThunderboltOutlined />
          <span>{count}</span>
        </Space>
      ),
    },
    {
      title: 'AI模型',
      dataIndex: 'aiModel',
      key: 'aiModel',
      render: (model: string) => <Tag color="blue">{model}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      render: (record: any) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedIntent(record);
              intentForm.setFieldsValue(record);
              setIntentModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<PlayCircleOutlined />}
            onClick={() => handleTrainIntent(record.id)}
            loading={loading}
          >
            训练
          </Button>
          <Popconfirm
            title="确定要删除这个意图吗？"
            onConfirm={() => handleDeleteIntent(record.id)}
          >
            <Button type="link" size="small" icon={<DeleteOutlined />} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const trainingColumns = [
    {
      title: '用户输入',
      dataIndex: 'userInput',
      key: 'userInput',
      ellipsis: true,
    },
    {
      title: '预期意图',
      dataIndex: 'expectedIntent',
      key: 'expectedIntent',
      render: (intent: string) => <Tag color="blue">{intent}</Tag>,
    },
    {
      title: '预测意图',
      dataIndex: 'predictedIntent',
      key: 'predictedIntent',
      render: (intent: string, record: any) => (
        <Space>
          <Tag color={record.isCorrect ? 'green' : 'red'}>{intent}</Tag>
          {!record.isCorrect && <Tag color="orange">错误</Tag>}
        </Space>
      ),
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence: number) => (
        <Progress 
          percent={Math.round(confidence * 100)} 
          size="small" 
          showInfo={false}
          strokeColor={confidence > 0.8 ? '#52c41a' : '#fa8c16'}
        />
      ),
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
  ];

  const filteredIntents = intents.filter(intent => {
    const matchesSearch = intent.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         intent.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || intent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题和操作 */}
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
              <RobotOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              意图管理
            </h1>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
              管理AI机器人的意图识别和智能回复配置
            </p>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={loadIntents}>
                刷新
              </Button>
              <Button icon={<ImportOutlined />}>导入</Button>
              <Button icon={<ExportOutlined />}>导出</Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => {
                  setSelectedIntent(null);
                  intentForm.resetFields();
                  setIntentModalVisible(true);
                }}
              >
                新建意图
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
              title="总意图数"
              value={intents.length}
              prefix={<RobotOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="启用意图"
              value={intents.filter(i => i.status === 'active').length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="平均准确率"
              value={Math.round(intents.reduce((acc, intent) => acc + intent.accuracy, 0) / intents.length * 100)}
              suffix="%"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title="总训练次数"
              value={intents.reduce((acc, intent) => acc + intent.trainingCount, 0)}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Input
              placeholder="搜索意图名称或描述..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Select
              placeholder="筛选状态"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">全部状态</Option>
              <Option value="active">启用</Option>
              <Option value="inactive">禁用</Option>
              <Option value="training">训练中</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Space>
              <Button icon={<SettingOutlined />}>高级筛选</Button>
              <Button icon={<ThunderboltOutlined />}>批量训练</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 意图列表 */}
      <Card title="意图列表">
        <Table
          columns={intentColumns}
          dataSource={filteredIntents}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '16px', backgroundColor: '#fafafa' }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div>
                      <strong>关键词:</strong>
                      <div style={{ marginTop: '8px' }}>
                        {record.keywords.map((keyword, index) => (
                          <Tag key={index} color="blue" style={{ marginBottom: '4px' }}>
                            {keyword}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>
                      <strong>实体:</strong>
                      <div style={{ marginTop: '8px' }}>
                        {record.entities.map((entity, index) => (
                          <Tag key={index} color="green" style={{ marginBottom: '4px' }}>
                            {entity}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>
                <Divider />
                <div>
                  <strong>回复模板:</strong>
                  <div style={{ marginTop: '8px' }}>
                    {record.responses.map((response, index) => (
                      <div key={index} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#fff', borderRadius: '4px' }}>
                        {response}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ),
          }}
        />
      </Card>

      {/* 训练数据 */}
      <Card title="训练数据" style={{ marginTop: '24px' }}>
        <Table
          columns={trainingColumns}
          dataSource={trainingData}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      </Card>

      {/* 意图编辑弹窗 */}
      <Modal
        title={selectedIntent ? '编辑意图' : '新建意图'}
        open={intentModalVisible}
        onCancel={() => {
          setIntentModalVisible(false);
          setSelectedIntent(null);
          intentForm.resetFields();
        }}
        onOk={() => intentForm.submit()}
        width={800}
      >
        <Form
          form={intentForm}
          layout="vertical"
          onFinish={selectedIntent ? handleUpdateIntent : handleCreateIntent}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="意图名称"
                rules={[{ required: true, message: '请输入意图名称' }]}
              >
                <Input placeholder="请输入意图名称" />
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
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <TextArea rows={3} placeholder="请输入意图描述" />
          </Form.Item>
          
          <Form.Item
            name="keywords"
            label="关键词"
            rules={[{ required: true, message: '请输入关键词' }]}
          >
            <Select
              mode="tags"
              placeholder="请输入关键词，按回车添加"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            name="responses"
            label="回复模板"
            rules={[{ required: true, message: '请输入回复模板' }]}
          >
            <Select
              mode="tags"
              placeholder="请输入回复模板，按回车添加"
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="aiModel"
                label="AI模型"
                rules={[{ required: true, message: '请选择AI模型' }]}
              >
                <Select placeholder="请选择AI模型">
                  <Option value="GPT-4">GPT-4</Option>
                  <Option value="GPT-3.5">GPT-3.5</Option>
                  <Option value="Claude">Claude</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                valuePropName="checked"
              >
                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default IntentsPage;
