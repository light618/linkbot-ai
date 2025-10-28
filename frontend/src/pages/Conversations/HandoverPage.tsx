import React from 'react';
import { Card, Row, Col, Button, Table, Modal, Form, Input, Select, Switch, Space, message, Tag } from 'antd';
import { SwapOutlined, UserOutlined, RobotOutlined, SettingOutlined } from '@ant-design/icons';

const HandoverPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          <SwapOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          人机切换管理
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          配置AI与人工客服的切换规则和策略
        </p>
      </div>

      <Card 
        title="切换规则配置" 
        extra={
          <Space>
            <Button icon={<SettingOutlined />}>全局设置</Button>
            <Button type="primary" icon={<SwapOutlined />}>新建规则</Button>
          </Space>
        }
      >
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
          <SwapOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <p>人机切换管理功能正在开发中</p>
        </div>
      </Card>
    </div>
  );
};

export default HandoverPage;
