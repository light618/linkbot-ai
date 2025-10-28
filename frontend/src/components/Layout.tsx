import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Button, Space, Typography, Badge } from 'antd';
import {
  DashboardOutlined,
  MessageOutlined,
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
  RobotOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  GlobalOutlined,
  SafetyOutlined,
  ForkOutlined,
  TeamOutlined,
  DollarOutlined,
  MonitorOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';
import { useAuth } from '../contexts/AuthContext';

const { Header, Sider, Content } = AntLayout;
const { Text } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '实时仪表盘',
    },
    {
      key: 'channels',
      icon: <GlobalOutlined />,
      label: '渠道中心',
      children: [
        { key: '/channels/douyin', label: '抖音接入' },
        { key: '/channels/kuaishou', label: '快手接入' },
        { key: '/channels/wechat', label: '视频号接入' },
        { key: '/channels/xiaohongshu', label: '小红书接入' },
        { key: '/channels/status', label: '渠道状态' },
      ],
    },
    {
      key: 'conversations',
      icon: <MessageOutlined />,
      label: '对话管理',
      children: [
        { key: '/conversations/active', label: '进行中对话' },
        { key: '/conversations/auto-reply', label: '自动回复配置' },
        { key: '/conversations/handover', label: '人机切换' },
      ],
    },
    {
      key: 'ai',
      icon: <RobotOutlined />,
      label: 'AI 机器人',
      children: [
        { key: '/ai/intents', label: '意图管理' },
        { key: '/ai/knowledge', label: '知识图谱 FAQ' },
        { key: '/ai/models', label: '大模型设置' },
      ],
    },
    {
      key: 'leads',
      icon: <TeamOutlined />,
      label: '线索中心',
      children: [
        { key: '/leads/list', label: '线索列表' },
        { key: '/leads/assignment', label: '分配规则' },
        { key: '/leads/components', label: '留资组件' },
      ],
    },
    {
      key: 'workflow',
      icon: <ForkOutlined />,
      label: '流程编排',
      children: [
        { key: '/workflow/designer', label: '画布设计' },
        { key: '/workflow/versions', label: '版本&灰度' },
      ],
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: '数据分析',
      children: [
        { key: '/analytics/dashboard', label: '实时仪表盘' },
        { key: '/analytics/channels', label: '渠道对比' },
        { key: '/analytics/performance', label: '客服绩效' },
      ],
    },
    {
      key: 'security',
      icon: <SafetyOutlined />,
      label: '内容安全',
      children: [
        { key: '/security/sensitive-words', label: '敏感词库' },
        { key: '/security/audit', label: '审核记录' },
      ],
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: '系统管理',
      children: [
        { key: '/system/tenants', label: '租户管理' },
        { key: '/system/billing', label: '计费账单' },
        { key: '/system/monitoring', label: '监控告警' },
      ],
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    // 如果点击的是实时仪表盘，收起所有二级菜单
    if (key === '/dashboard') {
      setOpenKeys([]);
    }
    navigate(key);
  };

  const handleOpenChange = (keys: string[]) => {
    // 只保留最后一个展开的菜单
    const latestOpenKey = keys[keys.length - 1];
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div style={{
          height: 32,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {collapsed ? 'LB' : 'LinkBot-AI'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <AntLayout>
        <Header style={{
          padding: '0 16px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <Space>
            <NotificationCenter />
            <Text>欢迎，{user?.username}</Text>
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
            >
              <Avatar
                style={{ backgroundColor: '#1890ff', cursor: 'pointer' }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </Space>
        </Header>
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          background: '#fff',
          minHeight: 280,
          borderRadius: 8,
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
