import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Button, Space, Table, Badge, Statistic, Progress, 
  Modal, Form, Input, message, Avatar, Typography, Tag, Divider,
  Alert, QRCode, Tooltip
} from 'antd';
import {
  GlobalOutlined, PlayCircleOutlined, PauseCircleOutlined, 
  SettingOutlined, ReloadOutlined, PlusOutlined, EditOutlined, 
  DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined,
  MessageOutlined, UserOutlined, ClockCircleOutlined,
  QrcodeOutlined, RiseOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import api from '../../services/api';

const { Title, Text } = Typography;

// 模拟多账号数据
const mockAccounts = [
  {
    id: '1',
    name: '官方旗舰店主账号',
    appId: 'dy123456789',
    appSecret: 'dy_secret_***',
    status: 'connected',
    onlineUsers: 1250,
    messagesToday: 89,
    lastActive: '2分钟前',
    remark: '用于新品发布和推广',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=1',
  },
  {
    id: '2', 
    name: '客服专线账号',
    appId: 'dy987654321',
    appSecret: 'dy_secret_***',
    status: 'connected',
    onlineUsers: 456,
    messagesToday: 34,
    lastActive: '5分钟前',
    remark: '用于客户服务和售后',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=2',
  },
  {
    id: '3',
    name: '测试账号',
    appId: 'dy555666777',
    appSecret: 'dy_secret_***',
    status: 'disconnected',
    onlineUsers: 0,
    messagesToday: 0,
    lastActive: '1小时前',
    remark: '用于功能测试',
    avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=3',
  },
];

// 模拟直播数据
const mockLiveStreams = [
  {
    id: '1',
    title: '新品发布会直播',
    status: 'live',
    viewers: 1250,
    messages: 89,
    duration: '2小时30分',
    startTime: '2024-01-15 14:00',
  },
  {
    id: '2',
    title: '产品使用教程',
    status: 'ended',
    viewers: 856,
    messages: 45,
    duration: '1小时15分',
    startTime: '2024-01-15 10:00',
  },
];

// 模拟消息数据
const mockMessages = [
  {
    id: '1',
    user: '张先生',
    message: '这个产品价格是多少？',
    time: '2分钟前',
    type: 'text',
    status: 'replied',
  },
  {
    id: '2',
    user: '李女士',
    message: '有优惠活动吗？',
    time: '5分钟前',
    type: 'text',
    status: 'pending',
  },
];

const DouyinPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [authUrl, setAuthUrl] = useState('');
  const [configForm] = Form.useForm();
  const [liveStreams, setLiveStreams] = useState(mockLiveStreams);
  const [messages, setMessages] = useState(mockMessages);

  useEffect(() => {
    loadChannelData();
    
    // 监听OAuth授权成功消息
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'DOUYIN_AUTH_SUCCESS') {
        const authData = event.data.data;
        
        // 弹层显示授权信息
        Modal.info({
          title: '🎉 抖音授权成功！',
          content: (
            <div>
              <p><strong>OpenID:</strong> {authData.open_id}</p>
              <p><strong>昵称:</strong> {authData.nickname}</p>
              <p><strong>Access Token:</strong> {authData.access_token.substring(0, 20)}...</p>
              <p><strong>有效期:</strong> {authData.expires_in}秒</p>
            </div>
          ),
          width: 500,
          onOk: () => {
            // 添加到账号列表
            const newAccount = {
              id: Date.now().toString(),
              name: authData.nickname || '抖音授权账号',
              appId: 'aw6hj204nms0vumu',
              appSecret: '***',
              accessToken: authData.access_token,
              status: 'connected',
              onlineUsers: 0,
              messagesToday: 0,
              lastActive: '刚刚',
              remark: '通过扫码授权添加',
              avatar: authData.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Douyin',
            };
            
            setAccounts(prev => [...prev, newAccount]);
            message.success('抖音账号授权成功！');
          }
        });
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // 模拟实时数据更新
    const interval = setInterval(() => {
      setAccounts(prev => prev.map(account => 
        account.status === 'connected' 
          ? { 
              ...account, 
              onlineUsers: account.onlineUsers + Math.floor(Math.random() * 10) - 5,
              messagesToday: account.messagesToday + Math.floor(Math.random() * 3),
              lastActive: '刚刚'
            }
          : account
      ));
    }, 5000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const loadChannelData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccounts(mockAccounts);
      setLiveStreams(mockLiveStreams);
      setMessages(mockMessages);
      // 默认选择第一个账号
      if (mockAccounts.length > 0) {
        setSelectedAccount(mockAccounts[0].id);
      }
    } catch (error) {
      message.error('加载渠道数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigSubmit = async (values: any) => {
    try {
      // 模拟保存配置
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (editingAccount) {
        // 编辑账号
        setAccounts(prev => prev.map(account => 
          account.id === editingAccount.id 
            ? { ...account, ...values, status: 'disconnected' }
            : account
        ));
        setIsEditModalVisible(false);
        message.success('账号配置更新成功');
      } else {
        // 添加新账号
        const newAccount = {
          id: Date.now().toString(),
          ...values,
          status: 'disconnected',
          onlineUsers: 0,
          messagesToday: 0,
          lastActive: '刚刚',
          avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=' + Date.now(),
        };
        setAccounts(prev => [...prev, newAccount]);
        setIsAddModalVisible(false);
        message.success('账号添加成功');
      }
      configForm.resetFields();
      setEditingAccount(null);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    configForm.setFieldsValue(account);
    setIsEditModalVisible(true);
  };

  const handleDeleteAccount = (accountId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除这个账号吗？',
      onOk: () => {
        setAccounts(prev => prev.filter(account => account.id !== accountId));
        if (selectedAccount === accountId) {
          const remainingAccounts = accounts.filter(account => account.id !== accountId);
          setSelectedAccount(remainingAccounts.length > 0 ? remainingAccounts[0].id : null);
        }
        message.success('账号删除成功');
      },
    });
  };

  const handleConnectAccount = async (accountId: string) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAccounts(prev => prev.map(account => 
        account.id === accountId 
          ? { ...account, status: 'connected' }
          : account
      ));
      message.success('账号连接成功');
    } catch (error) {
      message.error('连接失败');
    } finally {
      setLoading(false);
    }
  };

  // 抖音扫码授权
  const handleDouyinAuth = async () => {
    try {
      // 直接跳转到Go代理的授权URL（从环境变量读取外网域名）
      const proxyBase = (process.env.REACT_APP_PROXY_PUBLIC_BASE || '').trim() || 'https://linkbot-ai-production.up.railway.app';
      const authUrl = `${proxyBase}/oauth/douyin`;
      window.open(authUrl, '_blank', 'width=500,height=600');
    } catch (error) {
      message.error('授权失败，请重试');
    }
  };

  // 显示二维码授权
  const showQRCodeAuth = () => {
    const proxyBase = (process.env.REACT_APP_PROXY_PUBLIC_BASE || '').trim() || 'https://linkbot-ai-production.up.railway.app';
    setAuthUrl(`${proxyBase}/oauth/douyin`);
    setQrModalVisible(true);
    
    // 移除自动触发，等待用户扫码
  };

  const handleDisconnectAccount = async (accountId: string) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAccounts(prev => prev.map(account => 
        account.id === accountId 
          ? { ...account, status: 'disconnected', onlineUsers: 0 }
          : account
      ));
      message.success('账号断开成功');
    } catch (error) {
      message.error('断开失败');
    } finally {
      setLoading(false);
    }
  };

  const currentAccount = accounts.find(account => account.id === selectedAccount);

  const liveStreamColumns = [
    {
      title: '直播标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <Space>
          <PlayCircleOutlined style={{ color: record.status === 'live' ? '#52c41a' : '#999' }} />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'live' ? 'success' : 'default'} 
          text={status === 'live' ? '直播中' : '已结束'}
        />
      ),
    },
    {
      title: '观看人数',
      dataIndex: 'viewers',
      key: 'viewers',
      render: (viewers: number) => (
        <Space>
          <UserOutlined />
          <span>{viewers}</span>
        </Space>
      ),
    },
    {
      title: '消息数',
      dataIndex: 'messages',
      key: 'messages',
      render: (messages: number) => (
        <Space>
          <MessageOutlined />
          <span>{messages}</span>
        </Space>
      ),
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
  ];

  const messageColumns = [
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (user: string) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>{user}</span>
        </Space>
      ),
    },
    {
      title: '消息内容',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'replied' ? 'success' : status === 'pending' ? 'warning' : 'error'} 
          text={status === 'replied' ? '已回复' : status === 'pending' ? '待回复' : '回复失败'}
        />
      ),
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题和操作 */}
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              <Space>
                <GlobalOutlined />
                抖音渠道管理
                <Badge count={accounts.length} style={{ backgroundColor: '#52c41a' }} />
              </Space>
            </Title>
            <Text type="secondary">管理抖音企业号接入配置和直播互动</Text>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<QrcodeOutlined />}
                onClick={showQRCodeAuth}
                style={{ background: '#ff6b35', borderColor: '#ff6b35' }}
              >
                抖音扫码授权
              </Button>
              <Button 
                type="default" 
                icon={<PlusOutlined />}
                onClick={() => setIsAddModalVisible(true)}
              >
                手动添加
              </Button>
              <Button icon={<ReloadOutlined />} onClick={loadChannelData}>
                刷新
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* 账号列表 */}
      <Card title="账号管理" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          {accounts.map(account => (
            <Col xs={24} sm={12} lg={8} key={account.id}>
              <Card 
                size="small"
                hoverable
                style={{ 
                  border: selectedAccount === account.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedAccount(account.id)}
                actions={[
                  <Button 
                    type="link" 
                    size="small"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAccount(account);
                    }}
                  >
                    编辑
                  </Button>,
                  <Button 
                    type="link" 
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAccount(account.id);
                    }}
                  >
                    删除
                  </Button>,
                ]}
              >
                <Card.Meta
                  avatar={<Avatar src={account.avatar} />}
                  title={
                    <Space>
                      <span>{account.name}</span>
                      <Badge 
                        status={account.status === 'connected' ? 'success' : 'error'} 
                        text={account.status === 'connected' ? '已连接' : '未连接'}
                      />
                    </Space>
                  }
                  description={
                    <div>
                      <div>应用ID: {account.appId}</div>
                      <div>在线用户: {account.onlineUsers}</div>
                      <div>今日消息: {account.messagesToday}</div>
                      <div>最后活跃: {account.lastActive}</div>
                    </div>
                  }
                />
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  {account.status === 'connected' ? (
                    <Button 
                      size="small" 
                      danger
                      icon={<PauseCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDisconnectAccount(account.id);
                      }}
                      loading={loading}
                    >
                      断开连接
                    </Button>
                  ) : (
                    <Button 
                      size="small" 
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnectAccount(account.id);
                      }}
                      loading={loading}
                    >
                      连接账号
                    </Button>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 当前选中账号的详细信息 */}
      {currentAccount && (
        <>
          <Card title={`${currentAccount.name} - 实时数据`} style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Statistic
                  title="连接状态"
                  value={currentAccount.status === 'connected' ? '已连接' : '未连接'}
                  prefix={
                    currentAccount.status === 'connected' ? 
                    <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
                    <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                  }
                  valueStyle={{ 
                    color: currentAccount.status === 'connected' ? '#52c41a' : '#ff4d4f' 
                  }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="在线用户"
                  value={currentAccount.onlineUsers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <Statistic
                  title="今日消息"
                  value={currentAccount.messagesToday}
                  prefix={<MessageOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
            </Row>
          </Card>

          {/* 直播管理 */}
          <Card title="直播管理" style={{ marginBottom: '24px' }}>
            <Table
              columns={liveStreamColumns}
              dataSource={liveStreams}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>

          {/* 消息管理 */}
          <Card title="消息管理">
            <Table
              columns={messageColumns}
              dataSource={messages}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </>
      )}

      {/* 添加账号模态框 */}
      <Modal
        title="添加抖音账号"
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          configForm.resetFields();
        }}
        onOk={() => configForm.submit()}
      >
        <Form
          form={configForm}
          layout="vertical"
          onFinish={handleConfigSubmit}
        >
          <Form.Item
            name="name"
            label="账号名称"
            rules={[{ required: true, message: '请输入账号名称' }]}
            tooltip="便于区分不同的抖音账号"
          >
            <Input placeholder="例如：官方旗舰店主账号" />
          </Form.Item>
          <Form.Item
            name="appId"
            label="应用ID"
            rules={[{ required: true, message: '请输入应用ID' }]}
            tooltip="在抖音开放平台获取"
          >
            <Input placeholder="请输入抖音开放平台应用ID" />
          </Form.Item>
          <Form.Item
            name="appSecret"
            label="应用密钥"
            rules={[{ required: true, message: '请输入应用密钥' }]}
            tooltip="在抖音开放平台获取，请妥善保管"
          >
            <Input.Password placeholder="请输入应用密钥" />
          </Form.Item>
          <Form.Item
            name="remark"
            label="备注信息（选填）"
          >
            <Input.TextArea rows={2} placeholder="例如：这个账号用于新品发布" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑账号模态框 */}
      <Modal
        title="编辑抖音账号"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          configForm.resetFields();
          setEditingAccount(null);
        }}
        onOk={() => configForm.submit()}
      >
        <Form
          form={configForm}
          layout="vertical"
          onFinish={handleConfigSubmit}
        >
          <Form.Item
            name="name"
            label="账号名称"
            rules={[{ required: true, message: '请输入账号名称' }]}
            tooltip="便于区分不同的抖音账号"
          >
            <Input placeholder="例如：官方旗舰店主账号" />
          </Form.Item>
          <Form.Item
            name="appId"
            label="应用ID"
            rules={[{ required: true, message: '请输入应用ID' }]}
            tooltip="在抖音开放平台获取"
          >
            <Input placeholder="请输入抖音开放平台应用ID" />
          </Form.Item>
          <Form.Item
            name="appSecret"
            label="应用密钥"
            rules={[{ required: true, message: '请输入应用密钥' }]}
            tooltip="在抖音开放平台获取，请妥善保管"
          >
            <Input.Password placeholder="请输入应用密钥" />
          </Form.Item>
          <Form.Item
            name="remark"
            label="备注信息（选填）"
          >
            <Input.TextArea rows={2} placeholder="例如：这个账号用于新品发布" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 抖音扫码授权弹窗 */}
      <Modal
        title={
          <Space>
            <QrcodeOutlined style={{ color: '#ff6b35' }} />
            抖音扫码授权
          </Space>
        }
        open={qrModalVisible}
        onCancel={() => setQrModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setQrModalVisible(false)}>
            取消
          </Button>,
          <Button key="open" type="primary" onClick={handleDouyinAuth}>
            在新窗口打开
          </Button>,
        ]}
        width={500}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Alert
            message="授权说明"
            description="请使用抖音APP扫描二维码完成授权，授权后将自动获取您的抖音账号信息并开始监听直播间和短视频评论。"
            type="info"
            showIcon
            style={{ marginBottom: '20px' }}
          />
          
          <div style={{ marginBottom: '20px' }}>
            <QRCode
              value={authUrl}
              size={200}
              color="#ff6b35"
              style={{ margin: '0 auto' }}
            />
          </div>
          
          <Text type="secondary">
            扫码后请在抖音APP中完成授权
          </Text>
          
          <Divider />
          
          <Space direction="vertical" size="small">
            <Text strong>授权后将获得以下权限：</Text>
            <Text>• 监听直播间评论和互动</Text>
            <Text>• 监听短视频评论</Text>
            <Text>• 自动回复消息</Text>
            <Text>• 获取用户基本信息</Text>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default DouyinPage;
